<template>
    <div class="rate-item">
        <div class="row">
            <div class="col-xs-4">
                <img alt="" :src="rate.from.image | profile-image" class="trip_driver_img circle-box" />
            </div>
            <div class="col-xs-20">
                <div class="rate-item-title">
                    {{rate.from.name}} viaje a {{rate.trip.to_town}} (como {{rateType}}):
                    <span class="rate-item-value">
                        <i class="fa fa-thumbs-o-up" aria-hidden="true" v-if="rate.rating == 1"></i>
                        <i class="fa fa-thumbs-o-down" aria-hidden="true" v-if="rate.rating == 0"></i>
                    </span>
                </div>
                <div class="rate-item-comment">
                    {{rate.comment}}
                </div>
                <div class="rate-item-datetime">
                    {{rate.rate_at | moment("calendar")}}
                </div> 
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {

        };
    },
    computed: {
        rateType () {
            return this.rate.user_to_type === 0 ? 'pasajero' : 'conductor';
        }
    },
    props: [
        'user',
        'rate'
    ]
};
</script>