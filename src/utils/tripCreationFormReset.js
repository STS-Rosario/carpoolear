import { TRIP_INFO_STATUS } from './tripCreationTripInfo.js';

function createTripFormError() {
    return {
        state: false,
        message: ''
    };
}

export function createEmptyTripPoint(id = 0) {
    return {
        name: '',
        place: null,
        json: null,
        location: null,
        error: createTripFormError(),
        id
    };
}

export function createInitialTripCreationTrip() {
    return {
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
        points: []
    };
}

function createInitialOtherTripState(defaultTime) {
    return {
        minDate: new Date(),
        dateError: createTripFormError(),
        timeError: createTripFormError(),
        commentError: createTripFormError(),
        seatsError: createTripFormError(),
        no_lucrar: false,
        sameCity: false,
        points: [createEmptyTripPoint(0), createEmptyTripPoint(1)],
        date: '',
        dateAnswer: '',
        time: defaultTime,
        duration: 0,
        passengers: 0,
        trip: createInitialTripCreationTrip()
    };
}

export function applyTripCreationFormReset(form, options = {}) {
    const {
        defaultTime = '12:00',
        defaultReturnTime = '12:00',
        clearSuccessState = true
    } = options;

    if (!form) {
        return form;
    }

    form.points = [createEmptyTripPoint(0), createEmptyTripPoint(1)];
    form.date = '';
    form.dateAnswer = '';
    form.time = defaultTime;
    form.price = '';
    form.returnPrice = '';
    form.no_lucrar = false;
    form.sameCity = false;
    Object.assign(form.trip, createInitialTripCreationTrip());
    form.selectedCarId = null;
    form.allowForeignPoints = false;
    form.wantsIntermediateStops = false;
    form.useWeeklySchedule = false;
    form.weeklySchedule = 0;
    form.weeklyScheduleTime = defaultTime;
    form.weeklyScheduleReturnTime = defaultReturnTime;
    form.duration = 0;
    form.route_needs_payment = false;
    form.maximum_trip_price_cents = 0;
    form.recommended_trip_price_cents = 0;
    form.maximum_seat_price_cents = 0;
    form.recommended_seat_price_cents = 0;
    form.maximum_return_trip_price_cents = 0;
    form.recommended_return_trip_price_cents = 0;
    form.maximum_return_seat_price_cents = 0;
    form.recommended_return_seat_price_cents = 0;
    form.tripInfoStatus = TRIP_INFO_STATUS.IDLE;
    form.parentTripId = null;
    form.showReturnTrip = false;

    if (form.otherTrip) {
        Object.assign(form.otherTrip, createInitialOtherTripState(defaultReturnTime));
    }

    form.lucrarError = createTripFormError();
    form.dateError = createTripFormError();
    form.timeError = createTripFormError();
    form.priceError = createTripFormError();
    form.returnPriceError = createTripFormError();
    form.commentError = createTripFormError();
    form.seatsError = createTripFormError();
    form.carSelectionError = createTripFormError();
    form.hasShownMaxContributionExceededWarning = false;
    form.hasShownReturnMaxContributionExceededWarning = false;

    if (clearSuccessState) {
        form.showWizardSuccess = false;
        form.createdTrip = null;
        form.creationSnapshot = null;
    }

    return form;
}
