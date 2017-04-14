<template>
  <div class="trip"> 
      <div class="panel panel-default panel-card card card-trip">
        <div class="panel-heading">
          <div class="panel-title card-trip_title">
            <template v-if="trip.user.image !== ''">
              <img alt="" :src="trip.user.image" class="trip_driver_img" />
            </template>
            <template v-else>
              <img alt="" src="/static/img/default-profile.png" class="trip_driver_img" />
            </template>
            <div class="trip_driver_name" >
              {{ trip.user.name }}
            </div>
            <div class="trip_driver_ratings">
              X calificaciones
            </div>
            <span class="trip_visibility">
              <span v-if="trip.friendship_type_id === 0" title="Visibilidad: Solo amigos">
                <i class="fa fa-user" aria-hidden="true"></i>
              </span>
              <span v-else-if="trip.friendship_type_id === 1" title="Visibilidad: Amigos de amigos">
                <i class="fa fa-users" aria-hidden="true"></i>
              </span>
              <span v-else-if="trip.friendship_type_id === 2" title="Visilidad: Público">
                <i class="fa fa-car" aria-hidden="true"></i>
              </span>
            </span>
          </div>
        </div>
        <div class="panel-body card_body">
          <div class="trip_location">
            <template v-if="trip.points.length >= 2">
              <div class="trip_location_from">
                <span class="trip_location_from_city">{{ trip.points[0].json_address.ciudad }}</span>
                <span class="trip_location_from_state-country">{{ trip.points[0].json_address.provincia }}, {{ trip.points[0].json_address.pais }}</span>
              </div>
              <div class="trip_location_to">
                <span class="trip_location_from_city">{{ trip.points[trip.points.length - 1].json_address.ciudad }}</span>
                <span class="trip_location_from_state-country">{{ trip.points[trip.points.length - 1].json_address.provincia }}, {{ trip.points[trip.points.length - 1].json_address.pais }}</span>
              </div>
            </template>
            <template v-else>
                <div class="trip_location_from">
                  {{ trip.from_town }}
                </div>
                <div class="trip_location_to">
                  {{ trip.to_town }}
                </div>
            </template>
          </div>
          <time class="trip_datetime" :datetime="trip.trip_date">
            <span class="trip_datetime_date">{{ [ trip.trip_date ] | moment("DD MMMM YYYY") }}</span>
            -
            <span class="trip_datetime_time">{{ [ trip.trip_date ] | moment("h:mm a") }}</span>
          </time>
          <div class="trip_seats-available">
            <span>{{ trip.seats_available }}</span>
            <span>Lugares disponibles</span>
          </div>
          <div class="trip_actions">
            <router-link :to=" { name: 'trips', params: { id: trip.id } }" class="btn btn-default btn-lg">Ver</router-link>
          </div>
        </div>
      </div>
  </div>   
</template>
<script> 
export default {
  name: 'trip',
  props: ['trip'],
  data () {
    return { 

    }
  },
  mounted() {
     
  }
}
</script>