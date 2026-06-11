<template>
    <div class="new-trip-component container new-trip-tooltips--left">
        <div class="alert alert-info alert-sellado-viaje" v-if="this.config.module_trip_creation_payment_enabled">
            <p>{{ $t('mensajeContandoSobreSelladoViaje') }}</p>
            <p>{{ $t('podesHacerViajesGratis', { freeTrips: free_trips_amount }) }}</p>
            <div v-if="trips_created_by_user_amount >= free_trips_amount">
                <p>{{ $t('yaCreasteViajes', { tripsCreated: trips_created_by_user_amount }) }}</p>
            </div>
            <div v-if="trips_created_by_user_amount < free_trips_amount">
                <p>{{ $t('teQuedaViajesGratis', { remaining: remainingFreeTrips }) }}</p>
            </div>
        </div>

        <TripCreationSuccess
            v-if="showWizardSuccess && createdTrip"
            :trip="createdTrip"
            :creation-snapshot="creationSnapshot"
            @start-return-trip="startReturnTripCreation"
        />
        <NewTripCreationWizard
            v-else
            ref="tripCreationWizard"
            :key="tripCreationWizardKey"
            :draft-saving-enabled="!showWizardSuccess"
        />

        <modal
            name="newtrip-rear-comfort-seats-conflict"
            v-if="showRearMaxTwoSeatsConflictModal"
            @close="closeRearMaxTwoSeatsConflictModal"
        >
            <template #header><h3>
                <span>{{ $t('priorizarComodidad') }}</span>
            </h3></template>
            <template #body><div class="text-left color-black">
                <p>{{ $t('rearMaxTwoRequiresThreeOrFewerSeats') }}</p>
            </div></template>
        </modal>
        <CompleteCarModal
            :visible="showCompleteCarModal"
            :car="carToComplete"
            @close="showCompleteCarModal = false"
            @saved="onCarCompletionSaved"
        />
        <TripCarsModal
            :visible="showTripCarsModal"
            @close="onTripCarsModalClose"
            @updated="onTripCarsUpdated"
        />
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useCarsStore } from '../../stores/car';
import { useDeviceStore } from '../../stores/device';
import { useTripsStore } from '../../stores/trips';
import { useRootStore } from '../../stores/root';
// import { parseOsmStreet } from '../../services/maps.js';
import DatePicker from '../DatePicker';
import modal from '../Modal';
import dialogs from '../../services/dialogs.js';
import spinner from '../Spinner.vue';
import dayjs from '../../dayjs';
import { last } from 'lodash';
import TripApi from '../../services/api/Trips';
import UserApi from '../../services/api/User';
import autocomplete from '../Autocomplete';
import SvgItem from '../SvgItem';
import WeeklySchedule from '../elements/WeeklySchedule';
import CompleteCarModal from '../elements/CompleteCarModal.vue';
import TripCarsModal from '../elements/TripCarsModal.vue';
import bus from '../../services/bus-event.js';
import { getMaxContributionExceededMessage } from '../../utils/maxContributionExceededMessage.js';
import { rememberMaxContributionWarning } from '../../utils/maxContributionWarningState.js';
import {
    isNegativeSeatPriceInput,
    parseSeatPriceInput,
    priceInputNumberFromStoredSeatPriceCents,
    seatPriceCentsForApi
} from '../../utils/tripSeatPrice.js';
import { seatPriceCentsFromTripPriceCents } from '../../utils/tripPriceOccupants.js';
import { exceedsMaximumSeatPrice } from '../../utils/tripMaxPriceValidation.js';
import { isRearMaxTwoCompatibleWithSeats, shouldBlockSeatSelection } from '../../utils/tripRearComfortSeats.js';
import {
    activeCarsWithPlate,
    hasDriverPlate,
    isCarComplete,
    needsCarSelection,
    requiresDriverPlate,
    resolveTripCarId,
    restoreSelectedCarIdFromTrip
} from '../../utils/profileRequirements';
import { clearTripCreationDraft, saveTripCreationDraft } from '../../utils/tripCreationDraft.js';
import { applyTripCreationFormReset } from '../../utils/tripCreationFormReset.js';
import {
    buildOutboundTripCreationSnapshot,
    buildReturnTripCreationDraftFromSnapshot
} from '../../utils/tripCreationReturnDraft.js';
import {
    filterTripPointsForSave,
    removeEmptyIntermediatePoints
} from '../../utils/tripCreationPoints.js';
import { TRIP_INFO_STATUS } from '../../utils/tripCreationTripInfo.js';
import NewTripCreationWizard from './NewTripCreationWizard.vue';
import TripCreationSuccess from './TripCreationSuccess.vue';

let tripApi = new TripApi();
let userApi = new UserApi();

class Error {
    constructor(state = false, message = '') {
        this.state = false;
        this.message = '';
    }
}

export default {
    name: 'new-trip',
    props: {
        id: {
            type: [String, Number],
            required: false
        }
    },
    components: {
        DatePicker,
        WeeklySchedule,
        SvgItem,
        autocomplete,
        spinner,
        modal,
        CompleteCarModal,
        TripCarsModal,
        NewTripCreationWizard,
        TripCreationSuccess
    },
    provide() {
        return {
            newTripForm: this
        };
    },
    data() {
        return {
            minDate: dayjs().toDate(),
            lucrarError: new Error(),
            dateError: new Error(),
            timeError: new Error(),
            priceError: new Error(),
            hasShownMaxContributionExceededWarning: false,
            returnPriceError: new Error(),
            hasShownReturnMaxContributionExceededWarning: false,
            commentError: new Error(),
            seatsError: new Error(),
            no_lucrar: false,
            sameCity: false,
            points: [
                {
                    name: '',
                    place: null,
                    json: null,
                    location: null,
                    error: new Error(),
                    id: 0
                },
                {
                    name: '',
                    place: null,
                    json: null,
                    location: null,
                    error: new Error(),
                    id: 1
                }
            ],
            date: '',
            dateAnswer: this.date,
            time: '12:00',
            price: '',
            needs_to_pay_for_next_trip: false,
            maximum_trip_price_cents: 0,
            recommended_trip_price_cents: 0,
            maximum_seat_price_cents: 0,
            recommended_seat_price_cents: 0,
            maximum_return_trip_price_cents: 0,
            recommended_return_trip_price_cents: 0,
            maximum_return_seat_price_cents: 0,
            recommended_return_seat_price_cents: 0,
            free_trips_amount: 0,
            trips_created_by_user_amount: 0,
            route_needs_payment: false,
            returnPrice: '',
            duration: 0,
            passengers: 0,
            trip: {
                is_passenger: 0,
                from_town: '',
                to_town: '',
                trip_date: '',
                total_seats: 2,
                friendship_type_id: 2,
                estimated_time: '00:00',
                distance: 0.0,
                co2: 0.0,
                description: '',
                allow_kids: false,
                allow_smoking: false,
                allow_animals: false,
                rear_max_two_passengers: false,
                autoaccept_friends_requests: true,
                car_id: null,
                enc_path: '123',
                seat_price_cents: null,
                points: [] /* address json_address lat lng */
            },
            updatingTrip: null,
            selectedCarId: null,
            carSelectionError: new Error(),
            showCompleteCarModal: false,
            showTripCarsModal: false,
            carToComplete: null,
            saving: false,
            allowForeignPoints: false,
            wantsIntermediateStops: false,
            url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
            attribution:
                '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            showReturnTrip: false,
            showRearMaxTwoSeatsConflictModal: false,
            outboundSeatsRadioRevision: 0,
            returnSeatsRadioRevision: 0,
            otherTrip: {
                minDate: dayjs().toDate(),
                dateError: new Error(),
                timeError: new Error(),
                commentError: new Error(),
                seatsError: new Error(),
                no_lucrar: false,
                sameCity: false,
                points: [
                    {
                        name: '',
                        place: null,
                        json: null,
                        location: null,
                        error: new Error()
                    },
                    {
                        name: '',
                        place: null,
                        json: null,
                        location: null,
                        error: new Error()
                    }
                ],
                date: '',
                dateAnswer: this.date,
                time: '12:00',
                duration: 0,
                passengers: 0,
                trip: {
                    is_passenger: 0,
                    from_town: '',
                    to_town: '',
                    trip_date: '',
                    total_seats: 2,
                    friendship_type_id: 2,
                    estimated_time: '00:00',
                    distance: 0.0,
                    co2: 0.0,
                    description: '',
                    car_id: null,
                    enc_path: '123',
                    allow_kids: false,
                    allow_smoking: false,
                    allow_animals: false,
                    rear_max_two_passengers: false,
                    seat_price_cents: null,
                    points: [] /* address json_address lat lng */
                }
            },
            useWeeklySchedule: false,
            weeklySchedule: 0,
            weeklyScheduleTime: '12:00',
            weeklyScheduleReturnTime: '12:00',
            showWizardSuccess: false,
            createdTrip: null,
            creationSnapshot: null,
            parentTripId: null,
            tripInfoStatus: TRIP_INFO_STATUS.IDLE,
            tripCreationWizardKey: 0
        };
    },
    mounted() {
        let self = this;
        this.time = dayjs().add(1, 'hours').format('HH:00');
        this.otherTrip.time = dayjs().add(2, 'hours').format('HH:00');
        this.weeklyScheduleTime = dayjs().add(1, 'hours').format('HH:00');
        this.weeklyScheduleReturnTime = dayjs().add(2, 'hours').format('HH:00');
        bus.off('clear-click', this.onBackButton);
        bus.on('clear-click', this.onBackButton);

        if (self.id) {
            self.loadTrip();
        }

        this.hydrateDriverCarsFromProfile();
        this.carIndex().then(() => {
            this.preselectDriverCar();
        });

        userApi.selladoViaje().then((result) => {
            // if user is over the free trips limit, show a message telling them they need to pay for the next trip
            this.needs_to_pay_for_next_trip = this.config.module_trip_creation_payment_enabled && result.data.user_over_free_limit;
            this.free_trips_amount = result.data.free_trips_amount;
            this.trips_created_by_user_amount = result.data.trips_created_by_user_amount;
        });

        if (!this.id) {
            this.$nextTick(() => {
                this.refreshTripCreationTemplates();
            });
        }
    },
    activated() {
        if (!this.id) {
            this.refreshTripCreationTemplates();
        }
    },
    beforeRouteLeave(to, from, next) {
        if (!this.id && this.showWizardSuccess) {
            if (this.user?.id != null) {
                clearTripCreationDraft(this.user.id);
            }
            this.resetTripCreationForm();
        }
        next();
    },
    beforeRouteUpdate(to, from, next) {
        if (this.id) {
            next();
            return;
        }

        if (to.query.resumeDraft === '1') {
            next();
            return;
        }

        if (this.showWizardSuccess) {
            if (this.user?.id != null) {
                clearTripCreationDraft(this.user.id);
            }
            this.resetTripCreationForm();
        }

        next();

        if (!this.id) {
            this.$nextTick(() => {
                this.refreshTripCreationTemplates();
            });
        }
    },
    beforeUnmount() {},

    computed: {
        ...mapState(useAuthStore, {
            user: 'user',
            config: 'appConfig',
            tripCardTheme: 'tripCardTheme'
        }),
        ...mapState(useCarsStore, {
            cars: 'cars'
        }),
        driverCarsWithPlate() {
            return activeCarsWithPlate(this.cars);
        },
        showTripCarSelection() {
            return (
                requiresDriverPlate(this.trip) &&
                this.driverCarsWithPlate.length > 0
            );
        },
        profilePatenteLink() {
            return {
                name: 'profile_update',
                query: { missing: 'patente' }
            };
        },
        ...mapState(useDeviceStore, {
            isMobile: 'isMobile'
        }),
        columnClass() {
            return !this.isMobile && this.tripCardTheme === 'light'
                ? ['col-sm-10', 'col-sm-14']
                : ['col-sm-8', 'col-sm-16'];
        },
        distanceString() {
            return Math.floor(this.trip.distance / 1000) + ' Km';
        },
        estimatedTimeString() {
            const totalMinutes = Math.floor(this.duration / 60);
            const minutes = Math.floor(totalMinutes % 60);
            const hour = Math.floor(totalMinutes / 60);
            return (
                (hour < 10 ? '0' : '') +
                hour +
                ':' +
                (minutes < 10 ? '0' : '') +
                minutes
            );
        },
        CO2String() {
            return (Math.floor(this.trip.distance / 1000) * 0.15).toFixed(1)  + ' Kg';
        },
        otherTripDistanceString() {
            return Math.floor(this.otherTrip.trip.distance / 1000) + ' Km';
        },
        otherTripEstimatedTimeString() {
            const totalMinutes = Math.floor(this.otherTrip.duration / 60);
            const minutes = Math.floor(totalMinutes % 60);
            const hour = Math.floor(totalMinutes / 60);
            return (
                (hour < 10 ? '0' : '') +
                hour +
                ':' +
                (minutes < 10 ? '0' : '') +
                minutes
            );
        },
        otherTripCO2String() {
            return (
                Math.floor(this.otherTrip.trip.distance / 1000) * 0.15 + ' Kg'
            );
        },
        tripCardTheme() {
            return this.config ? this.config.trip_card_design : '';
        },
        remainingFreeTrips() {
            return this.free_trips_amount - this.trips_created_by_user_amount;
        },
        center() {
            return this.config.map_coordinates;
        },
        zoom() {
            return this.config.map_zoom;
        },
        contribucionPorPersonaTooltipText() {
            if (this.config && this.config.module_trip_creation_payment_enabled) {
                return this.$t('contribucionPorPersonaTooltipConSellado');
            }
            return this.$t('contribucionPorPersonaTooltipSinSellado');
        },
        contribucionRecomendadaCardDescripcionText() {
            if (this.config && this.config.module_trip_creation_payment_enabled) {
                return this.$t('contribucionRecomendadaCardDescripcionConSellado');
            }
            return this.$t('contribucionRecomendadaCardDescripcionSinSellado');
        }
    },
    watch: {
        cars() {
            this.preselectDriverCar();
        },
        no_lucrar: function () {
            this.lucrarError.state = false;
        },
        'trip.rear_max_two_passengers': function() {
            if (this.trip.distance > 0) {
                this.recalculateRecommendedPrice();
            }
        },
        'trip.total_seats': function(newValue, oldValue) {
            this.guardTotalSeatsAgainstRearComfortConflict(
                this.trip,
                newValue,
                oldValue
            );
        },
        'otherTrip.trip.rear_max_two_passengers': function() {
            if (this.otherTrip.trip.distance > 0) {
                this.recalculateRecommendedReturnPrice();
            }
        },
        'otherTrip.trip.total_seats': function(newValue, oldValue) {
            this.guardTotalSeatsAgainstRearComfortConflict(
                this.otherTrip.trip,
                newValue,
                oldValue
            );
        },
        dateAnswer: function (value) {
            if (!this.showReturnTrip || !this.otherTrip.dateAnswer) {
                // const v = dayjs(value);
                // let date = '';
                /* if (v.isValid()) {
                    date = value;
                } */
                // this.otherTrip.date = date;
                // this.otherTrip.dateAnswer = date;
            }
            // this.dateError.state = false;
        },
        time: function () {
            this.timeError.state = false;
        },
        weeklyScheduleTime: function () {
            this.timeError.state = false;
        },
        weeklyScheduleReturnTime: function () {
            this.otherTrip.timeError.state = false;
        },
        'otherTrip.dateAnswer': function () {
            this.otherTrip.dateError.state = false;
        },
        'otherTrip.time': function () {
            this.otherTrip.timeError.state = false;
        },
        'otherTrip.trip.description': function () {
            this.otherTrip.commentError.state = false;
        },
        'trip.friendship_type_id': function () {
            this.otherTrip.trip.friendship_type_id =
                this.trip.friendship_type_id;
        },
        'trip.is_passenger': function () {
            this.preselectDriverCar();
        },
        // 'trip.distance': function () {
        //     // TODO: FIX THIS
        //     if (this.config.module_trip_creation_payment_enabled) {
        //         let data = {
        //             from: this.points[0].place,
        //             to: last(this.points).place,
        //             distance: this.trip.distance
        //         };
        //         this.getPrice(data).then((price) => {
        //             this.price = price;
        //             console.log(this.price);
        //         });
        //     }
        // },
        // 'otherTrip.distance': function () {
        //     let data = {
        //         from: this.otherTrip.points[0].place,
        //         to: last(this.otherTrip.points).place,
        //         distance: this.otherTrip.distance
        //     };
        //     this.getPrice(data).then((price) => {
        //         this.returnPrice = price;
        //         console.log(this.returnPrice);
        //     });
        // }
    },
    methods: {
        getMaxContributionExceededMessage(maxContributionCents) {
            return getMaxContributionExceededMessage({
                t: this.$t,
                n: this.$n,
                maxContributionCents
            });
        },
        hydrateDriverCarsFromProfile() {
            if (Array.isArray(this.cars) && this.cars.length > 0) {
                return;
            }
            const profileCars = this.user && this.user.cars;
            if (Array.isArray(profileCars) && profileCars.length > 0) {
                useCarsStore().$patch({ cars: profileCars });
            }
        },
        preselectDriverCar() {
            if (!requiresDriverPlate(this.trip)) {
                return;
            }
            const withPlate = this.driverCarsWithPlate;
            if (this.selectedCarId != null && this.selectedCarId !== '') {
                const stillActive = withPlate.find(
                    (car) => String(car.id) === String(this.selectedCarId)
                );
                if (stillActive) {
                    return;
                }
                this.selectedCarId = null;
                this.trip.car_id = null;
            }
            if (withPlate.length === 1) {
                this.selectedCarId = withPlate[0].id;
            }
        },
        resolveDriverCarForTrip() {
            const carId = resolveTripCarId(this.cars, this.selectedCarId);
            if (carId == null) {
                return null;
            }

            return (this.cars || []).find(
                (car) => String(car.id) === String(carId)
            );
        },
        async onCarCompletionSaved() {
            this.showCompleteCarModal = false;
            await this.carIndex();
            this.save();
        },
        openTripCarsModal() {
            this.showTripCarsModal = true;
        },
        startReturnTripCreation() {
            if (!this.createdTrip || !this.user?.id) {
                return;
            }

            const snapshot = buildOutboundTripCreationSnapshot(this);
            const draft = buildReturnTripCreationDraftFromSnapshot(
                snapshot,
                this.createdTrip.id
            );
            saveTripCreationDraft(this.user.id, draft);
            this.showWizardSuccess = false;
            this.createdTrip = null;
            this.creationSnapshot = null;
            this.tripCreationWizardKey += 1;
        },
        onTripCarsModalClose() {
            this.showTripCarsModal = false;
        },
        async onTripCarsUpdated() {
            await this.carIndex();
            this.preselectDriverCar();
        },
        markMaxContributionExceededWarningAsShown() {
            this.hasShownMaxContributionExceededWarning = rememberMaxContributionWarning(
                {
                    hasBeenShown: this.hasShownMaxContributionExceededWarning,
                    hasExceededMaxContribution: true
                }
            );
        },
        markReturnMaxContributionExceededWarningAsShown() {
            this.hasShownReturnMaxContributionExceededWarning = rememberMaxContributionWarning(
                {
                    hasBeenShown: this.hasShownReturnMaxContributionExceededWarning,
                    hasExceededMaxContribution: true
                }
            );
        },
        ...mapActions(useTripsStore, {
            createTrip: 'create',
            updateTrip: 'update',
            getPrice: 'price'
        }),
        ...mapActions(useCarsStore, {
            carIndex: 'index'
        }),
        ...mapActions(useRootStore, {
            getTrip: 'getTrip'
        }),
        tripStaticImg(filename) {
            const base = process.env.ROUTE_BASE || '/';
            const normalized = base.endsWith('/') ? base : `${base}/`;
            return `${normalized}img/${filename}`;
        },
        normalizeAllowFlagsForApi(trip) {
            trip.allow_kids = trip.allow_kids ? 1 : 0;
            trip.allow_animals = trip.allow_animals ? 1 : 0;
            trip.allow_smoking = trip.allow_smoking ? 1 : 0;
            trip.rear_max_two_passengers = trip.rear_max_two_passengers ? 1 : 0;
            trip.autoaccept_friends_requests = trip.autoaccept_friends_requests
                ? 1
                : 0;
        },
        setIsPassenger(value) {
            this.trip.is_passenger = value;
        },
        changeOtherTripDate(date) {
            this.otherTrip.dateError.state = false;
            this.otherTrip.dateAnswer = date;
        },
        changeDate(date) {
            this.dateError.state = false;
            this.date = date;
            this.dateAnswer = date;
        },
        jumpToError() {
            let hasError = document.getElementsByClassName('has-error');
            if (hasError.length) {
                let element = hasError[0];
                this.$scrollToElement(element);
            }
        },
    restoreData(trip) {
        this.no_lucrar = true;
        this.points = [];
        trip.points.forEach((p) => {
            let point = {
                name: p.address,
                json: p.json_address,
                location: {
                    lat: p.lat,
                    lng: p.lng
                },
                place: JSON.stringify(p.json_address),
                error: new Error()
            };
            this.points.push(point);
        });

        // In update mode, add an empty point for adding new intermediary locations
        if (this.updatingTrip && this.points.length >= 2) {
            let newPoint = {
                name: '',
                place: null,
                json: null,
                location: null,
                error: new Error()
            };
            this.points.splice(this.points.length - 1, 0, newPoint);
        }

        // Restore weekly schedule FIRST before date/time
        if (trip.weekly_schedule > 0) {
            this.useWeeklySchedule = true;
            this.weeklySchedule = trip.weekly_schedule;
            console.log('restoreData: set weeklySchedule to', this.weeklySchedule, 'from trip.weekly_schedule', trip.weekly_schedule);

            // Restore weekly schedule time
            if (trip.weekly_schedule_time) {
                this.weeklyScheduleTime = dayjs(trip.weekly_schedule_time).format('HH:mm');
            }
        } else {
            this.useWeeklySchedule = false;

            // Only restore date/time if NOT using weekly schedule
            if (trip.trip_date) {
                this.date = dayjs(trip.trip_date.split(' ')[0]).format('YYYY-MM-DD');
                this.dateAnswer = dayjs(trip.trip_date.split(' ')[0]).format('YYYY-MM-DD');
                this.time = trip.trip_date.split(' ')[1];
            }
        }
        
        this.trip.is_passenger = trip.is_passenger ? 1 : 0;
        this.passengers = trip.passenger_count;
        this.trip.total_seats = trip.total_seats;
        this.trip.friendship_type_id = trip.friendship_type_id;
        this.trip.distance = trip.distance;
        this.trip.description = trip.description;
        
        this.trip.allow_kids = Number(trip.allow_kids) > 0;
        this.trip.allow_animals = Number(trip.allow_animals) > 0;
        this.trip.allow_smoking = Number(trip.allow_smoking) > 0;
        this.trip.rear_max_two_passengers = Number(trip.rear_max_two_passengers) > 0;
        this.trip.autoaccept_friends_requests =
            Number(trip.autoaccept_friends_requests) > 0;

        const restoredCarId = restoreSelectedCarIdFromTrip(trip, this.cars);
        if (restoredCarId != null) {
            this.selectedCarId = restoredCarId;
            this.trip.car_id = restoredCarId;
        } else {
            this.selectedCarId = null;
            this.trip.car_id = null;
        }
        
        this.trip.seat_price_cents = trip.seat_price_cents;
        const restoredPrice =
            priceInputNumberFromStoredSeatPriceCents(trip.seat_price_cents);
        if (restoredPrice !== null) {
            this.price = restoredPrice;
        }
        
        this.calcRoute();
    },

        loadTrip() {
            this.getTrip(this.id)
                .then((trip) => {
                    if (this.user.id === trip.user.id) {
                        this.updatingTrip = trip;
                        this.hydrateDriverCarsFromProfile();
                        this.carIndex()
                            .then(() => {
                                this.restoreData(trip);
                                this.preselectDriverCar();
                            })
                            .catch(() => {
                                this.restoreData(trip);
                                this.preselectDriverCar();
                            });
                    } else {
                        this.$router.replace({
                            name: 'trips'
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    if (error) {
                        this.$router.replace({
                            name: 'trips'
                        });
                    }
                });
        },

        markNegativeContributionError(errorTarget) {
            errorTarget.state = true;
            errorTarget.message = this.$t('contribucionPorPersonaNegativa');
        },

        onOutboundPriceFieldInput() {
            this.validatePrice();
            const p = parseSeatPriceInput(this.price);
            if (
                p !== null &&
                !isNegativeSeatPriceInput(this.price) &&
                (this.priceError.message ===
                    this.$t('contribucionPorPersonaRequerida') ||
                    this.priceError.message ===
                        this.$t('contribucionPorPersonaNegativa'))
            ) {
                this.priceError.state = false;
            }
        },

        onReturnPriceFieldInput() {
            this.validateReturnPrice();
            const p = parseSeatPriceInput(this.returnPrice);
            if (
                p !== null &&
                !isNegativeSeatPriceInput(this.returnPrice) &&
                (this.returnPriceError.message ===
                    this.$t('contribucionPorPersonaRequerida') ||
                    this.returnPriceError.message ===
                        this.$t('contribucionPorPersonaNegativa'))
            ) {
                this.returnPriceError.state = false;
            }
        },

        validate() {
            let globalError = false;
            let foreignPoints = 0;
            let validTime = false;
            let validDate = false;
            let validOtherTripTime = false;
            let validOtherTripDate = false;
            let validWeeklySchedule = false;
            this.points = this.points.filter((point) => point.place);
            for (let index = this.points.length; index < 2; index++) {
                this.addPoint(true);
            }
            this.points = this.points.map((point) => {
                delete point.id;
                return point;
            });
            this.points.forEach((p) => {
                if (!p.json) {
                    p.error.state = true;
                    p.error.message = this.$t('localidadValida');
                    globalError = true;
                } else {
                    foreignPoints +=
                        p.json.country === this.config.osm_country ? 0 : 1;
                }
            });
            if (foreignPoints > 1) {
                globalError = true;
                this.points[0].error.state = true;
                this.points[0].error.message = this.$t(
                    'origenDestinoArgentina'
                );
            }

            if (this.showReturnTrip) {
                foreignPoints = 0;
                this.otherTrip.points.forEach((p) => {
                    if (!p.json) {
                        p.error.state = true;
                        p.error.message = this.$t('seleccioneLocalidadValida');
                        globalError = true;
                    } else {
                        foreignPoints +=
                            p.json.country === this.config.osm_country ? 0 : 1;
                    }
                });
                if (foreignPoints > 1) {
                    globalError = true;
                    this.otherTrip.points[0].error.state = true;
                    this.otherTrip.points[0].error.message = this.$t(
                        'origenDestinoArgentina'
                    );
                }
            }

            if (!this.time || !dayjs(this.time, 'HH mm').isValid()) {
                this.timeError.state = true;
                this.timeError.message = this.$t('noHorarioValido');
                globalError = true;
            } else {
                validTime = true;
            }

            if (
                this.points[0].json &&
                last(this.points).json &&
                this.points[0].name === last(this.points).name
            ) {
                this.points[0].error.state = true;
                this.points[0].error.message = this.$t(
                    'origenDestinoDistintos'
                );
                last(this.points).error.state = true;
                last(this.points).error.message = this.$t(
                    'origenDestinoDistintos'
                );
                this.sameCity = true;
                globalError = true;
            }

            if (this.useWeeklySchedule) {
                // Check if at least one day is selected for weekly schedule
                if (this.weeklySchedule === 0) {
                    globalError = true;
                    this.dateError.state = true;
                    this.dateError.message = this.$t('faltaFechaOProgramaSemanal');
                } else {
                    validWeeklySchedule = true;
                }
                
                // Validate weekly schedule time
                if (!this.weeklyScheduleTime || !dayjs(this.weeklyScheduleTime, 'HH:mm').isValid()) {
                    this.timeError.state = true;
                    this.timeError.message = this.$t('noHorarioValido');
                    globalError = true;
                }
            } else if (
                !(this.dateAnswer && this.dateAnswer.length) ||
                !dayjs(this.dateAnswer).isValid()
            ) {
                globalError = true;
                this.dateError.state = true;
                this.dateError.message = this.$t('faltaFecha');
            } else {
                validDate = true;
            }
            if (this.trip.total_seats < this.passengers) {
                globalError = true;
                this.seatsError.state = true;
                this.seatsError.message =
                    this.$t('yaTienes') +
                    this.trip.passengers +
                    this.$t('pasajerosSubidos');
                dialogs.message(
                    this.$t('yaTienes') +
                        this.trip.passengers +
                        this.$t('pasajerosSubidos'),
                    {
                        estado: 'error'
                    }
                );
            } else if (globalError) {
                dialogs.message(this.$t('algunosDatosNoValidos'), {
                    estado: 'error'
                });
            } else if (
                !this.no_lucrar &&
                this.trip.is_passenger.toString() !== '1'
            ) {
                this.lucrarError.state = true;
                this.lucrarError.message = this.$t('teComprometesANoLucrar');
                dialogs.message(this.$t('teComprometesANoLucrar'), {
                    estado: 'error'
                });
                globalError = true;
            } else if (!this.trip.description) {
                this.commentError.state = true;
                this.commentError.message = this.$t('olvidasteDescripcion');
                dialogs.message(this.$t('olvidasteDescripcion'), {
                    estado: 'error'
                });
            }
            if (validDate && validTime) {
                if (
                    dayjs(this.dateAnswer).format('YYYY-MM-DD') ===
                    dayjs().format('YYYY-MM-DD')
                ) {
                    // la fecha es de hoy, la hora no debería poder ser anterior
                    if (
                        dayjs(this.time, 'HH mm').format('HH mm') <
                        dayjs().format('HH mm')
                    ) {
                        this.timeError.state = true;
                        this.timeError.message = this.$t('viajesPasado');
                        globalError = true;
                    }
                }
            }

            if (this.trip.is_passenger == 0 && this.config.module_seat_price_enabled) {
                const seatP = parseSeatPriceInput(this.price);
                if (seatP === null) {
                    globalError = true;
                    this.priceError.state = true;
                    this.priceError.message = this.$t(
                        'contribucionPorPersonaRequerida'
                    );
                } else if (isNegativeSeatPriceInput(this.price)) {
                    globalError = true;
                    this.markNegativeContributionError(this.priceError);
                } else if (
                    this.config.module_max_price_enabled &&
                    exceedsMaximumSeatPrice({
                        seatPriceUnits: seatP,
                        maximumSeatPriceCents: this.maximum_seat_price_cents,
                        maximumTripPriceCents: this.maximum_trip_price_cents
                    })
                ) {
                    globalError = true;
                    this.priceError.state = true;
                    this.priceError.message = this.getMaxContributionExceededMessage(
                        this.maximum_seat_price_cents
                    );
                    this.markMaxContributionExceededWarningAsShown();
                } else {
                    this.priceError.state = false;
                }
            } else {
                this.priceError.state = false;
            }

            if (this.showReturnTrip) {
                if (this.useWeeklySchedule) {
                    // Check if at least one day is selected for weekly schedule
                    if (this.weeklySchedule === 0) {
                        globalError = true;
                        this.otherTrip.dateError.state = true;
                        this.otherTrip.dateError.message = this.$t('faltaFechaOProgramaSemanal');
                    } else {
                        validOtherTripDate = true;
                    }
                    
                    // Validate weekly schedule time
                    if (!this.weeklyScheduleReturnTime || !dayjs(this.weeklyScheduleReturnTime, 'HH:mm').isValid()) {
                        this.otherTrip.timeError.state = true;
                        this.otherTrip.timeError.message = this.$t('noHorarioValido');
                        globalError = true;
                    } else {
                        validOtherTripTime = true;
                    }
                } else {
                    if (
                        !this.otherTrip.time ||
                        !dayjs(this.otherTrip.time, 'HH mm').isValid()
                    ) {
                        this.otherTrip.timeError.state = true;
                        this.otherTrip.timeError.message =
                            this.$t('noHorarioValido');
                        globalError = true;
                    } else {
                        validOtherTripTime = true;
                    }
                }

                if (
                    this.otherTrip.points[0].json &&
                    last(this.otherTrip.points).json &&
                    this.otherTrip.points[0].name ===
                        last(this.otherTrip.points).name
                ) {
                    this.otherTrip.points[0].error.state = true;
                    this.otherTrip.points[0].error.message = this.$t(
                        'origenDestinoDistintos'
                    );
                    last(this.otherTrip.points).error.state = true;
                    last(this.otherTrip.points).error.message = this.$t(
                        'origenDestinoDistintos'
                    );
                    this.otherTrip.sameCity = true;
                    globalError = true;
                }

                if (
                    !(
                        this.otherTrip.dateAnswer &&
                        this.otherTrip.dateAnswer.length
                    ) ||
                    !dayjs(this.otherTrip.dateAnswer).isValid()
                ) {
                    globalError = true;
                    this.otherTrip.dateError.state = true;
                    this.otherTrip.dateError.message = this.$t('faltaFecha');
                } else {
                    validOtherTripDate = true;
                }

                if (validOtherTripTime && validOtherTripDate && !this.useWeeklySchedule) {
                    if (
                        dayjs(this.otherTrip.dateAnswer).format(
                            'YYYY-MM-DD'
                        ) === dayjs().format('YYYY-MM-DD')
                    ) {
                        // la fecha es de hoy, la hora no debería poder ser anterior
                        if (
                            dayjs(this.otherTrip.time, 'HH mm').format(
                                'HH mm'
                            ) < dayjs().format('HH mm')
                        ) {
                            this.otherTrip.timeError.state = true;
                            this.otherTrip.timeError.message =
                                this.$t('viajesPasado');
                            globalError = true;
                        }
                    }

                    let time = dayjs(this.time, 'HH:mm');
                    const tripDate = dayjs(this.dateAnswer)
                        .hour(time.hour())
                        .minute(time.minute())
                        .second(time.second());

                    time = dayjs(this.otherTrip.time, 'HH:mm');
                    const otherTripDate = dayjs(this.otherTrip.dateAnswer)
                        .hour(time.hour())
                        .minute(time.minute())
                        .second(time.second());

                    if (
                        otherTripDate.isBefore(tripDate) ||
                        otherTripDate.isSame(tripDate)
                    ) {
                        this.otherTrip.timeError.state = true;
                        this.otherTrip.timeError.message =
                            this.$t('fechaHoraLogicas');
                        globalError = true;
                    }
                }

                if (!this.otherTrip.trip.description) {
                    this.otherTrip.commentError.state = true;
                    this.otherTrip.commentError.message = this.$t('olvidasteDescripcion');
                    dialogs.message(this.$t('olvidasteDescripcion'), {
                        estado: 'error'
                    });
                }

                if (
                    this.trip.is_passenger == 0 &&
                    this.config.module_seat_price_enabled &&
                    (!this.config.module_max_price_enabled ||
                        this.config.module_trip_creation_payment_enabled)
                ) {
                    const returnSeatP = parseSeatPriceInput(
                        this.returnPrice
                    );
                    if (returnSeatP === null) {
                        globalError = true;
                        this.returnPriceError.state = true;
                        this.returnPriceError.message = this.$t(
                            'contribucionPorPersonaRequerida'
                        );
                    } else if (isNegativeSeatPriceInput(this.returnPrice)) {
                        globalError = true;
                        this.markNegativeContributionError(this.returnPriceError);
                    } else if (
                        this.config.module_trip_creation_payment_enabled &&
                        this.config.module_max_price_enabled &&
                        exceedsMaximumSeatPrice({
                            seatPriceUnits: returnSeatP,
                            maximumSeatPriceCents:
                                this.maximum_return_seat_price_cents,
                            maximumTripPriceCents:
                                this.maximum_return_trip_price_cents
                        })
                    ) {
                        globalError = true;
                        this.returnPriceError.state = true;
                        this.returnPriceError.message = this.getMaxContributionExceededMessage(
                            this.maximum_return_seat_price_cents
                        );
                        this.markReturnMaxContributionExceededWarningAsShown();
                    } else {
                        this.returnPriceError.state = false;
                    }
                } else {
                    this.returnPriceError.state = false;
                }
            }

            if (!this.showReturnTrip) {
                this.returnPriceError.state = false;
            }

            return globalError;
        },

        removeEmptyIntermediatePoints() {
            this.points = removeEmptyIntermediatePoints(this.points);
            this.calcRoute();
        },
        getSaveInfo(tripObj, estimatedTime, useWeeklySchedule = this.useWeeklySchedule, weeklyScheduleTime = this.weeklyScheduleTime) {
            const resolvedPoints = filterTripPointsForSave(tripObj.points);
            const points = resolvedPoints.map((p) => {
                return {
                    address: p.name,
                    json_address: p.json,
                    lat: p.location.lat,
                    lng: p.location.lng,
                    node_id: p.place.id
                };
            });
            const resolvedCarId = requiresDriverPlate(tripObj.trip)
                ? resolveTripCarId(this.cars, this.selectedCarId)
                : undefined;
            const tripInfo = {
                points,
                from_town: points[0].address,
                to_town: last(points).address,
                estimated_time: estimatedTime
            };

            if (resolvedCarId != null && resolvedCarId !== '') {
                tripInfo.car_id = resolvedCarId;
            }

            if (!useWeeklySchedule) {
                // Only include trip_date when in specific date view (not using weekly schedule)
                tripInfo.trip_date = tripObj.dateAnswer + ' ' + tripObj.time + ':00';
            } else {
                // Only include weekly_schedule when in weekly schedule view
                tripInfo.weekly_schedule = this.weeklySchedule;
                tripInfo.weekly_schedule_time = weeklyScheduleTime + ':00';
            }

            const result = Object.assign({}, tripObj.trip, tripInfo);

            if (requiresDriverPlate(tripObj.trip)) {
                if (resolvedCarId != null && resolvedCarId !== '') {
                    result.car_id = resolvedCarId;
                } else {
                    delete result.car_id;
                }
            } else {
                delete result.car_id;
            }

            return result;
        },

        async save() {
            this.removeEmptyIntermediatePoints();
            if (
                requiresDriverPlate(this.trip) &&
                !Array.isArray(this.cars)
            ) {
                await this.carIndex();
            }
            if (
                requiresDriverPlate(this.trip) &&
                !hasDriverPlate(this.cars)
            ) {
                dialogs.message(this.$t('olvidastePatente'), {
                    estado: 'error'
                });
                this.showTripCarsModal = true;
                return;
            }
            if (
                requiresDriverPlate(this.trip) &&
                needsCarSelection(this.cars) &&
                !resolveTripCarId(this.cars, this.selectedCarId)
            ) {
                this.carSelectionError.state = true;
                this.carSelectionError.message = this.$t('seleccionaAuto');
                return;
            }
            this.carSelectionError.state = false;
            const tripCar = this.resolveDriverCarForTrip();
            if (tripCar && !isCarComplete(tripCar)) {
                this.carToComplete = tripCar;
                this.showCompleteCarModal = true;
                return;
            }
            const validationResult = this.validate();
            if (validationResult) {
                // Jump To Error
                this.$nextTick(() => {
                    this.jumpToError();
                });
                return;
            }
            /* eslint-disable no-unreachable */
            this.saving = true;
            if (!this.updatingTrip) {
                if (this.$redirectToIdentityValidationIfRequired()) {
                    this.saving = false;
                    return;
                }
                let trip = this.getSaveInfo(this, this.estimatedTimeString);
                trip.is_passenger = trip.is_passenger ? 1 : 0;
                this.normalizeAllowFlagsForApi(trip);

                trip.seat_price_cents = seatPriceCentsForApi(this.price);

                if (trip.is_passenger === 1) {
                    trip.no_lucrar = 1;
                }
                if (this.parentTripId) {
                    trip.parent_trip_id = this.parentTripId;
                }
                this.createTrip(trip)
                    .then((t) => {
                        this.saving = false;
                        if (t.existing) {
                            dialogs.message(this.$t('viajeYaPublicado'), {
                                estado: 'info'
                            });
                        }
                        if (this.user && this.user.id != null) {
                            clearTripCreationDraft(this.user.id);
                        }
                        this.parentTripId = null;
                        this.creationSnapshot = buildOutboundTripCreationSnapshot(this);
                        this.createdTrip = t;
                        this.showWizardSuccess = true;
                    })
                    .catch((err) => {
                        console.log('error_creating', err);
                        if (this.$checkError(err, 'identity_validation_required')) {
                            this.$router.push({ name: 'identity_validation' });
                            dialogs.message(this.$t('debesValidarIdentidadParaAccion'), {
                                estado: 'error'
                            });
                        } else if (
                            err &&
                            err.data &&
                            err.data.errors &&
                            err.data.errors.driver_is_verified
                        ) {
                            dialogs.message(this.$t('tienesQueSerConductor'), {
                                estado: 'error'
                            });
                        } else if (this.$checkError(err, 'routing_service_unavailable')) {
                            dialogs.message(this.$t('routingServiceTemporaryError'), {
                                estado: 'error'
                            });
                        } else {
                            dialogs.message(
                                this.$t('problemaAlCargarElViaje'),
                                {
                                    estado: 'error'
                                }
                            );
                        }
                        this.jumpToError();
                        this.saving = false;
                    });
            } else {
                let trip = this.getSaveInfo(this, this.estimatedTimeString);
                trip.id = this.updatingTrip.id;
                trip.is_passenger = trip.is_passenger ? 1 : 0;
                this.normalizeAllowFlagsForApi(trip);
                trip.seat_price_cents = seatPriceCentsForApi(this.price);
                this.updateTrip(trip)
                    .then(() => {
                        this.saving = false;
                        this.$router.replace({
                            name: 'detail_trip',
                            params: { id: this.trip.id }
                        });
                    })
                    .catch((err) => {
                        this.saving = false;
                        if (this.$checkError(err, 'routing_service_unavailable')) {
                            dialogs.message(this.$t('routingServiceTemporaryError'), {
                                estado: 'error'
                            });
                        } else {
                            dialogs.message(this.$t('problemaAlCargarElViaje'), {
                                estado: 'error'
                            });
                        }
                    });
            }
        },

        getPlace(i, data, type) {
            type = type || 'trip';

            const trip = type === 'trip' ? this : this.otherTrip;

            trip.points[i].place = data;
            trip.points[i].name = data.name;
            // TODO: Recordar parseStreet
            trip.points[i].json = data;
            trip.points[i].error.state = false;
            trip.center = trip.points[i].location = {
                lat: parseFloat(data.lat),
                lng: parseFloat(data.lng)
            };
            if ((i === 0 || i === trip.points.length - 1) && trip.sameCity) {
                trip.points[0].error.state = false;
                last(trip.points).error.state = false;
            }

            if (type === 'trip') {
                this.tripInfoStatus = TRIP_INFO_STATUS.IDLE;
                this.addPoint();
                // Mirror the entire points array
                this.otherTrip.points = this.points.slice().reverse().map(point => ({
                    name: point.name,
                    place: point.place,
                    json: point.json,
                    location: point.location,
                    error: new Error(),
                    id: point.id  // Preserve the original ID
                }));
                
                // Update the center to the first point of the return trip
                this.otherTrip.center = this.otherTrip.points[0].location;
                this.calcRoute('returnTrip');
            } else {
                this.addReturnPoint();
            }

            this.calcRoute(type);
        },

        getPlaceholder(index) {
            if (this.points.length - 1 === index) {
                return this.$t('destino');
            } else if (index === 0) {
                return this.$t('origen');
            } else {
                return this.$t('ingresePuntoIntermedio');
            }
        },

        onBackButton() {
            this.$router.replace({
                name: 'trips'
            });
        },
        resetTripCreationForm(options = {}) {
            applyTripCreationFormReset(this, {
                defaultTime: dayjs().add(1, 'hours').format('HH:00'),
                defaultReturnTime: dayjs().add(2, 'hours').format('HH:00'),
                ...options
            });
            this.tripCreationWizardKey += 1;
            this.preselectDriverCar();
            this.$nextTick(() => {
                this.refreshTripCreationTemplates();
            });
        },
        refreshTripCreationTemplates() {
            this.$refs.tripCreationWizard?.refreshAvailableTemplates?.();
        },

        addPoint(force) {
            if (
                this.points.filter((point) => point.name === '').length === 0 ||
                force
            ) {
                let newArr = this.points.splice(0);
                let newp = {
                    name: '',
                    place: null,
                    json: null,
                    location: null,
                    error: new Error(),
                    id: new Date().getTime()
                };
                newArr.splice(this.points.length - 1, 0, newp);
                this.points = newArr;
            }
        },
        addReturnPoint(force) {
            if (
                this.otherTrip.points.filter((point) => point.name === '').length === 0 ||
                force
            ) {
                let newArr = this.otherTrip.points.splice(0);
                let newp = {
                    name: '',
                    place: null,
                    json: null,
                    location: null,
                    error: new Error(),
                    id: new Date().getTime()
                };
                newArr.splice(this.otherTrip.points.length - 1, 0, newp);
                this.otherTrip.points = newArr;
            }
        },
        resetPoints(m, index) {
            if (index === 0 || index === this.points.length - 1) {
                // If removing origin or destination, clear the point
                m.name = '';
                m.place = null;
                m.json = null;
                m.location = null;
            } else {
                // If removing intermediate point, remove it and shift remaining points
                this.points.splice(index, 1);
            }
            // Always recalculate trip info
            this.tripInfoStatus = TRIP_INFO_STATUS.IDLE;
            this.calcRoute('trip');
        },

        calcRoute(type) {
            type = type || 'trip';

            const trip = type === 'trip' ? this : this.otherTrip;

            let points = trip.points.filter((point) => point.name);

            // Only proceed if we have at least 2 points with names
            if (points.length < 2) {
                if (type === 'trip') {
                    this.tripInfoStatus = TRIP_INFO_STATUS.IDLE;
                }
                return;
            }

            let data = {
                points: points.map((point) => point.location)
            };

            if (type === 'trip') {
                this.tripInfoStatus = TRIP_INFO_STATUS.LOADING;
            }

            tripApi.getTripInfo(data).then((result) => {
                if (result.status === true) {
                    if (type === 'trip') {
                        this.tripInfoStatus = TRIP_INFO_STATUS.READY;
                    }
                    trip.trip.distance = result.data.distance;
                    trip.duration = result.data.duration;
                    trip.trip.co2 = result.data.co2;
                    trip.route_needs_payment = result.data.route_needs_payment;
                    
                    if (type === 'trip') {
                        this.maximum_trip_price_cents = result.data.maximum_trip_price_cents;
                        this.recommended_trip_price_cents = result.data.recommended_trip_price_cents;
                        this.recalculateRecommendedPrice();
                    } else {
                        this.maximum_return_trip_price_cents = result.data.maximum_trip_price_cents;
                        this.recommended_return_trip_price_cents = result.data.recommended_trip_price_cents;
                        this.recalculateRecommendedReturnPrice();
                    }
                } else if (result.error_code === 'routing_service_unavailable') {
                    if (type === 'trip') {
                        this.tripInfoStatus = TRIP_INFO_STATUS.ERROR;
                    }
                    dialogs.message(this.$t('routingServiceTemporaryError'), {
                        estado: 'error'
                    });
                } else if (type === 'trip') {
                    this.tripInfoStatus = TRIP_INFO_STATUS.ERROR;
                }
            }).catch(() => {
                if (type === 'trip') {
                    this.tripInfoStatus = TRIP_INFO_STATUS.ERROR;
                }
            });

        },
        validatePrice() {
            const p = parseSeatPriceInput(this.price);
            if (isNegativeSeatPriceInput(this.price)) {
                this.markNegativeContributionError(this.priceError);
                return;
            }
            if (
                this.config.module_max_price_enabled &&
                exceedsMaximumSeatPrice({
                    seatPriceUnits: p,
                    maximumSeatPriceCents: this.maximum_seat_price_cents,
                    maximumTripPriceCents: this.maximum_trip_price_cents
                })
            ) {
                this.priceError.state = true;
                this.priceError.message = this.getMaxContributionExceededMessage(
                    this.maximum_seat_price_cents
                );
                this.markMaxContributionExceededWarningAsShown();
            } else if (
                this.priceError.message ===
                this.getMaxContributionExceededMessage(
                    this.maximum_seat_price_cents
                )
            ) {
                this.priceError.state = false;
            }
            if (
                p !== null &&
                this.priceError.message ===
                    this.$t('contribucionPorPersonaRequerida')
            ) {
                this.priceError.state = false;
            }
        },
        recalculateRecommendedPrice() {
            this.maximum_seat_price_cents = seatPriceCentsFromTripPriceCents(
                this.maximum_trip_price_cents,
                this.trip.rear_max_two_passengers
            );
            this.recommended_seat_price_cents = seatPriceCentsFromTripPriceCents(
                this.recommended_trip_price_cents,
                this.trip.rear_max_two_passengers
            );
            this.validatePrice();
        },
        showRearMaxTwoSeatsConflictMessage() {
            this.showRearMaxTwoSeatsConflictModal = true;
        },
        closeRearMaxTwoSeatsConflictModal() {
            this.showRearMaxTwoSeatsConflictModal = false;
        },
        guardTotalSeatsAgainstRearComfortConflict(tripRef, newValue, oldValue) {
            if (
                newValue === oldValue ||
                isRearMaxTwoCompatibleWithSeats(
                    newValue,
                    tripRef.rear_max_two_passengers
                )
            ) {
                return;
            }
            tripRef.total_seats = oldValue;
            if (tripRef === this.trip) {
                this.outboundSeatsRadioRevision += 1;
            } else {
                this.returnSeatsRadioRevision += 1;
            }
            this.showRearMaxTwoSeatsConflictMessage();
        },
        onOutboundSeatRadioAttempt(seats, event) {
            if (
                shouldBlockSeatSelection(
                    seats,
                    this.trip.rear_max_two_passengers
                )
            ) {
                event.preventDefault();
                event.stopPropagation();
                this.outboundSeatsRadioRevision += 1;
                this.showRearMaxTwoSeatsConflictMessage();
            }
        },
        onReturnSeatRadioAttempt(seats, event) {
            if (
                shouldBlockSeatSelection(
                    seats,
                    this.otherTrip.trip.rear_max_two_passengers
                )
            ) {
                event.preventDefault();
                event.stopPropagation();
                this.returnSeatsRadioRevision += 1;
                this.showRearMaxTwoSeatsConflictMessage();
            }
        },
        onOutboundRearMaxTwoChange(event) {
            const wantsChecked = event.target.checked;
            if (
                wantsChecked &&
                !isRearMaxTwoCompatibleWithSeats(this.trip.total_seats, true)
            ) {
                event.target.checked = false;
                this.showRearMaxTwoSeatsConflictMessage();
                return;
            }
            this.trip.rear_max_two_passengers = wantsChecked;
        },
        onReturnRearMaxTwoChange(event) {
            const wantsChecked = event.target.checked;
            if (
                wantsChecked &&
                !isRearMaxTwoCompatibleWithSeats(
                    this.otherTrip.trip.total_seats,
                    true
                )
            ) {
                event.target.checked = false;
                this.showRearMaxTwoSeatsConflictMessage();
                return;
            }
            this.otherTrip.trip.rear_max_two_passengers = wantsChecked;
        },
        recalculateRecommendedReturnPrice() {
            this.maximum_return_seat_price_cents = seatPriceCentsFromTripPriceCents(
                this.maximum_return_trip_price_cents,
                this.otherTrip.trip.rear_max_two_passengers
            );
            this.recommended_return_seat_price_cents = seatPriceCentsFromTripPriceCents(
                this.recommended_return_trip_price_cents,
                this.otherTrip.trip.rear_max_two_passengers
            );
            this.validateReturnPrice();
        },
        validateReturnPrice() {
            const p = parseSeatPriceInput(this.returnPrice);
            if (isNegativeSeatPriceInput(this.returnPrice)) {
                this.markNegativeContributionError(this.returnPriceError);
                return;
            }
            if (
                exceedsMaximumSeatPrice({
                    seatPriceUnits: p,
                    maximumSeatPriceCents:
                        this.maximum_return_seat_price_cents,
                    maximumTripPriceCents:
                        this.maximum_return_trip_price_cents
                })
            ) {
                this.returnPriceError.state = true;
                this.returnPriceError.message = this.getMaxContributionExceededMessage(
                    this.maximum_return_seat_price_cents
                );
                this.markReturnMaxContributionExceededWarningAsShown();
            } else if (
                this.returnPriceError.message ===
                this.getMaxContributionExceededMessage(
                    this.maximum_return_seat_price_cents
                )
            ) {
                this.returnPriceError.state = false;
            }
            if (
                p !== null &&
                this.returnPriceError.message ===
                    this.$t('contribucionPorPersonaRequerida')
            ) {
                this.returnPriceError.state = false;
            }
        },
        resetReturnPoints(m, index) {
            if (index === 0 || index === this.otherTrip.points.length - 1) {
                // If removing origin or destination, clear the point
                m.name = '';
                m.place = null;
                m.json = null;
                m.location = null;
            } else {
                // If removing intermediate point, remove it and shift remaining points
                this.otherTrip.points.splice(index, 1);
            }
            // Always recalculate trip info
            this.calcRoute('returnTrip');
        }
    }
};
</script>

<style scoped>
hr {
    border-top: 1px solid var(--primary-color);
    margin: 1em;
}
.no-padding {
    padding: 0;
}
.show-return-trip {
    margin-top: 1em;
}

.trip-comfort-preference {
    margin: 0.5rem 0;
}

.trip-comfort-preference__label {
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
    margin: 0;
    font-weight: normal;
}

.preferences-text {
    font-size: 0.8em;
}
.preferences {
    margin-right: 0px;
}

.trip_terms--lucrar-card {
    margin-top: 1rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    max-width: 100%;
    background: var(--form-background, #fff);
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    box-sizing: border-box;
}

.trip_terms--lucrar-card__label.trip_terms_label,
.trip_terms--lucrar-card__label.checkbox-click-target {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 12px;
    width: 100%;
    margin: 0;
    padding: 14px 16px;
    box-sizing: border-box;
    color: #111;
    line-height: 1.4;
    vertical-align: unset;
}

.trip_terms--lucrar-card__label.trip_terms_label.has-error {
    color: #111;
}

.trip_terms--lucrar-card__box.checkbox-box {
    position: relative;
    top: 2px;
    left: 0;
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    border-width: 2px;
    border-radius: 5px;
    border-color: #aeb6bd;
}

.trip_terms--lucrar-card__box.checkbox-box:after {
    width: 11px;
    height: 7px;
    left: 3px;
    top: 5px;
    border: 2px solid #444;
    border-top: none;
    border-right: none;
}

.trip_terms--lucrar-card__copy {
    flex: 1;
    min-width: 0;
}

.trip_terms--lucrar-card__title-row {
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-start;
    gap: 0.35rem;
}

.trip_terms--lucrar-card__tooltip {
    flex-shrink: 0;
    margin-top: 0.15em;
}

.trip_terms--lucrar-card__title {
    flex: 1 1 0;
    min-width: 0;
    font-weight: 700;
    font-size: 1.125rem;
    line-height: 1.35;
    color: #111;
}

.trip_terms--lucrar-card__lead {
    margin: 0.65rem 0 0 0;
    font-weight: 700;
    font-size: 0.9375rem;
    color: #111;
    line-height: 1.35;
}

.trip_terms--lucrar-card__text {
    margin: 0.4rem 0 0 0;
    font-weight: 400;
    font-size: 0.8125rem;
    color: #111;
    line-height: 1.45;
}

.trip_terms--lucrar-card__label.has-error .trip_terms--lucrar-card__title {
    color: var(--main-error, #d72521);
}

.container {
    padding-top: 0;
}
.trip-type-selection {
    margin-top: 1.4rem;
}
span.error {
    display: block;
    font-size: 12px;
    margin-top: -5px;
    font-weight: bold;
    color: red;
    margin-bottom: 0.4em;
}
span.error.textarea {
    margin-top: 0.8em;
}

span.error.max-contribution-reminder {
    margin-top: 0.5em;
}
.trip_points--left {
    margin-left: 0.5rem;
}
.title--desktop {
    margin-left: 0.5em;
    margin-bottom: 20px;
    color: var(--primary-color);
}
@media only screen and (min-width: 768px) {
    .row-showReturnTrip hr {
        padding-top: 1em;
    }
    hr {
        width: 68%;
    }
    .container {
        padding-top: 1.5em;
    }
    .trip-type-selection {
        margin-top: 0;
    }
    span.error {
        font-weight: 300;
    }
    .row-showReturnTrip {
        margin-bottom: 1.5rem;
    }
}
.tooltip-bottom {
    color: var(--trip-almost-fill-color);
}
textarea.form-control {
    min-height: 14em;
    height: auto;
}
.alert-sellado-viaje {
    margin-top: -1em;
}

.trip-car-selection__label {
    font-weight: normal;
}

.trip-car-selection__profile-link {
    margin-left: 0.35em;
    font-weight: normal;
}

.label-tooltip {
    width: 100%;
}

.new-trip-tooltips--left .tooltip-seat-price.tooltip-bottom::before {
    width: auto;
    min-width: 20vw;
    max-width: 40vw;
}

/* Bottom tooltips: anchor to the trigger’s right edge and expand leftward */
.new-trip-tooltips--left :deep([data-tooltip].tooltip-bottom:before) {
    left: auto;
    right: 0;
    margin-left: 0;
    transform: translate(0, 20px);
    text-align: left;
    width: auto;
    min-width: 20vw;
    max-width: 40vw;
}

.new-trip-tooltips--left :deep([data-tooltip].tooltip-bottom:after) {
    left: auto;
    right: 10px;
    margin-left: 0;
    transform: translate(0, 20px);
}

/* Long legal copy next to “Me comprometo…” */
.new-trip-tooltips--left
    :deep(.trip_terms--lucrar-card__tooltip[data-tooltip].tooltip-bottom:before) {
    min-width: min(28rem, 92vw);
    max-width: min(36rem, 92vw);
}

.new-trip-tooltips--left :deep([data-tooltip].tooltip-bottom:hover:before),
.new-trip-tooltips--left :deep([data-tooltip].tooltip-bottom:hover:after),
.new-trip-tooltips--left :deep([data-tooltip].tooltip-bottom:focus:before),
.new-trip-tooltips--left :deep([data-tooltip].tooltip-bottom:focus:after) {
    transform: translate(0, 20px);
}

@media only screen and (max-width: 768px) {
    .new-trip-tooltips--left .tooltip-seat-price.tooltip-bottom::before {
        min-width: 40vw;
        max-width: 60vw;
    }

    .new-trip-tooltips--left :deep([data-tooltip].tooltip-bottom:before) {
        min-width: 40vw;
        max-width: 60vw;
    }
}

.trip_schedule-toggle {
    margin-bottom: 1em;
}

.schedule-toggle-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 0.5em;
}

.schedule-toggle-buttons .schedule-tab {
    flex: 1;
    padding: 8px 16px;
    border: 1px solid var(--primary-color);
    background: transparent;
    color: var(--primary-color);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.schedule-toggle-buttons .schedule-tab:hover {
    background: var(--secondary-background);
    color: white;
}

.schedule-toggle-buttons .schedule-tab.active {
    background: var(--secondary-background);
    color: white;
}

.trip-weekly-schedule {
    margin-bottom: 1em;
}

.trip-create--update {
    margin-top: 2em;
}

.trip-form-info-icon {
    width: 1.1em;
    height: 1.1em;
    vertical-align: middle;
    display: inline-block;
}

.trip-pref-cards__cell {
    text-align: center;
    margin-bottom: 0.35rem;
}

.trip-pref-card {
    display: inline-block;
    max-width: 100%;
}

.trip-pref-card__label {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    margin: 0;
    font-weight: normal;
}

.trip-pref-card__surface {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.15rem;
    height: 3.15rem;
    box-sizing: border-box;
    border: 1px solid #cfd4d8;
    border-radius: 4px;
    background: #fffef8;
    transition:
        border-color 0.15s ease,
        background-color 0.15s ease;
}

.trip-pref-card__input:checked + .trip-pref-card__label .trip-pref-card__surface {
    border-color: var(--primary-color, #0070b8);
    background: #fffef8;
}

.trip-pref-card__badge {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 1.125rem;
    height: 1.125rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    box-sizing: border-box;
    border: 1px solid #aeb6bd;
    background: #fff;
    color: #fff;
    font-size: 0.65rem;
    line-height: 1;
    pointer-events: none;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.06);
    transition:
        border-color 0.15s ease,
        background-color 0.15s ease,
        box-shadow 0.15s ease;
}

.trip-pref-card__badge .fa-check {
    opacity: 0;
    transform: scale(0.75);
    transition:
        opacity 0.12s ease,
        transform 0.12s ease;
}

.trip-pref-card__input:checked + .trip-pref-card__label .trip-pref-card__badge {
    border-color: var(--primary-color, #0070b8);
    background: var(--primary-color, #0070b8);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.trip-pref-card__input:checked + .trip-pref-card__label .trip-pref-card__badge .fa-check {
    opacity: 1;
    transform: scale(1.12);
}

.trip-pref-card__icon {
    display: block;
    object-fit: contain;
    width: 1.4rem;
    height: 1.4rem;
}

.trip-pref-card__caption {
    display: block;
    margin-top: 0.35rem;
    font-size: 0.8rem;
    text-align: center;
    color: var(--main-font-color, #555);
    max-width: 7.5rem;
    line-height: 1.25;
}

.trip-pref-card__input:focus-visible + .trip-pref-card__label .trip-pref-card__surface {
    outline: 2px solid var(--primary-color, #0070b8);
    outline-offset: 2px;
}

.trip-form-error-with-icon {
    display: flex;
    align-items: flex-start;
    gap: 0.35em;
}

.trip-form-warning-icon {
    width: 1em;
    height: 1em;
    flex-shrink: 0;
    margin-top: 0.15em;
    object-fit: contain;
}

.trip-form-mobile-footer {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 11;
    bottom: calc(52px + env(safe-area-inset-bottom, 0px));
    padding: 0.75rem 1rem;
    background: var(--main-background, #fff);
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
    border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.trip-form-mobile-footer__return {
    margin-bottom: 0.5rem;
}

.trip-form-mobile-footer__submit {
    margin: 0 !important;
    width: 100%;
    min-width: 100%;
}

.trip-contribucion-recomendada-card {
    background: #f0f9eb;
    border: 1px solid var(--trip-mostly-free-color, #91b64c);
    border-radius: 6px;
    padding: 0.75rem 1rem;
    margin: 0.75rem 0 1rem;
}

.trip-contribucion-recomendada-card__main {
    font-size: 1rem;
    line-height: 1.35;
    margin-bottom: 0.35rem;
    color: #2d5016;
}

.trip-contribucion-recomendada-card__main strong {
    font-weight: 700;
}

.trip-contribucion-recomendada-card__hint {
    margin: 0;
    font-size: 0.8125rem;
    line-height: 1.4;
    color: #5c6d3a;
    opacity: 0.95;
}
</style>
