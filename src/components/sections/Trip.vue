<template>
  <div class="col-lg-6 col-md-8 col-sm-12" v-on:click='goToDetail' >
    <div class="trip" v-bind:class="{ 'trip-almost-fill': trip.seats_available == 1, 'trip-mostly-available': trip.seats_available > 3, 'trip-with-driver': user }" >
        <div class="panel panel-default panel-card card card-trip">
          <div class="panel-heading card_heading">
            <div class="panel-title card-trip_title row">
              <div class="card-icon">
                <span class="trip_visibility">
                  <span v-if="trip.friendship_type_id === 0" title="Visibilidad: Solo amigos">
                    <i class="fa fa-lock" aria-hidden="true"></i>
                  </span>
                  <span v-else-if="trip.friendship_type_id === 1" title="Visibilidad: Amigos de amigos">
                    <i class="fa fa-users" aria-hidden="true"></i>
                  </span>
                  <span v-else-if="trip.friendship_type_id === 2" title="Visilidad: Público">
                    <i class="fa fa-car" aria-hidden="true"></i>
                  </span>
                </span>
              </div>
              <template v-if="user">
                <div class="trip_driver_img_container">
                  <div class="trip_driver_img circle-box" v-imgSrc:profile="trip.user.image"></div>
                </div>
                <div class="trip_driver_details">
                  <div class="trip_driver_name" >
                    {{ trip.user.name }}
                  </div>
                  <div class="trip_driver_ratings">
                    {{ trip.user.positive_ratings + trip.user.negative_ratings }} calificaciones
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="panel-body card_body">
            <div class="trip_location">
              <template v-if="trip.points.length >= 2">
                <div class="row trip_location_from">
                  <div class="col-xs-4 text-right">
                    <i class="fa fa-map-marker" aria-hidden="true"></i>
                  </div>
                  <div class="col-xs-20">
                    <span class="trip_location_from_city" :style="originLongName ? LONG_NAME_STYLE : {}">{{ trip.points[0].json_address.ciudad }}</span>
                    <span class="trip_location_from_state-country">{{ trip.points[0].json_address.provincia }}, {{ trip.points[0].json_address.pais }}</span>
                  </div>
                </div>
                <div class="row trip_location_to">
                  <div class="col-xs-4 text-right">
                    <i class="fa fa-map-marker" aria-hidden="true"></i>
                  </div>
                  <div class="col-xs-20">
                    <span class="trip_location_from_city" :style="destinyLongName ? LONG_NAME_STYLE : {}">{{ trip.points[trip.points.length - 1].json_address.ciudad }}</span>
                    <span class="trip_location_from_state-country">{{ trip.points[trip.points.length - 1].json_address.provincia }}, {{ trip.points[trip.points.length - 1].json_address.pais }}</span>
                  </div>
                </div>
                <div class="col-xs-4 trip_location-dot-line">
                  <div></div>
                </div>
              </template>
              <template v-else>
                  <div class="row trip_location_from">
                    <div class="col-xs-4 text-right">
                      <i class="fa fa-map-marker" aria-hidden="true"></i>
                    </div>
                    <div  class="col-xs-20">
                      {{ trip.from_town }}
                    </div>
                </div>
                <div class="row trip_location_to">
                  <div class="col-xs-4 text-right">
                    <i class="fa fa-map-marker" aria-hidden="true"></i>
                  </div>
                  <div class="col-xs-20">
                    {{ trip.to_town }}
                  </div>
                </div>
              </template>
            </div>
            <div class="row">
                <time class="trip_datetime col-xs-offset-4 col-xs-20" :datetime="trip.trip_date">
                  <span class="trip_datetime_date">{{ [ trip.trip_date ] | moment("DD MMMM YYYY") }}</span>
                  -
                  <span class="trip_datetime_time">{{ [ trip.trip_date ] | moment("h:mm a") }}</span>
                </time>
            </div>
            <div class="row">
              <div class="trip_seats-available col-xs-offset-2 col-xs-12">
                <span class="trip_seats-available_value pull-left">{{ trip.seats_available }}</span>
                <span class="trip_seats-available_label"><span>Lugares</span><span>libres</span></span>
              </div>
              <div class="trip_actions col-xs-10">
                <div class="btn btn-default btn-lg btn-trip-detail">Ver</div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
    name: 'trip',
    props: [
        'trip',
        'user'
    ],

    methods: {
        goToDetail: function (event) {
            this.$router.push({ name: 'detail_trip', params: { id: this.trip.id } });
        }
    },
    data () {
        return {
            CITY_NAME_LONG_LENGTH: 16,
            LONG_NAME_STYLE: {
                'font-size': '17px'
            }
        };
    },
    computed: {
        originLongName () {
            return this.trip.points[0].json_address.ciudad.length > this.CITY_NAME_LONG_LENGTH;
        },
        destinyLongName () {
            return this.trip.points[this.trip.points.length - 1].json_address.ciudad.length > this.CITY_NAME_LONG_LENGTH;
        }
    },
    mounted () {

    }
};
</script>
