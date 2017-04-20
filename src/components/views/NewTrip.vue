<template>
  <div>
   
   <div v-for="(m, index) in points">
        <span v-if="index == 0"> Origen: </span>
        <span v-if="index == points.length - 1"> Destino: </span>
        <GmapAutocomplete :placeholder="getPlaceholder(index)"  :value="m.name" v-on:place_changed="(data) => getPlace(index, data)"> </GmapAutocomplete>
   </div>

    <gmap-map
        :center="center"
        :zoom="7"
        style="width: 500px; height: 300px"
        ref="map"
    >
        <gmap-marker
        :key="index"
        v-for="(m, index) in points"
        :position="m.location"
        :clickable="true"
        :draggable="true"
        @click="center=m.location"
        v-if="m.location"
        ></gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
export default {
    name: 'new-trip',
    data () {
        return {
            center: {lat: -10.0, lng: 10.0},
            markers: [{
                position: {lat: 10.0, lng: 10.0}
            }, {
                position: {lat: 11.0, lng: 11.0}
            }],
            points: [
                {
                    name: '',
                    place: null,
                    json: null,
                    location: null
                },
                {
                    name: '',
                    place: null,
                    json: null,
                    location: null
                }
            ]
        };
    },
    mounted () {
        this.$refs.map.$mapCreated.then(() => {
            console.log('Map was created');
            /* eslint-disable no-undef */
            this.directionsService = new google.maps.DirectionsService();
            this.directionsDisplay = new google.maps.DirectionsRenderer();
            this.directionsDisplay.setMap(this.$refs.map.$mapObject);
        });
    },

    methods: {
        getPlace (i, data) {
            this.points[i].place = data;
            this.points[i].name = data.formatted_address;
            this.center = this.points[i].location = {
                lat: data.geometry.location.lat(),
                lng: data.geometry.location.lng()
            };
            this.calcRoute();
        },

        getPlaceholder (index) {
            if (this.points.length - 1 === index) {
                return 'Destino';
            } else if (index === 0) {
                return 'Origen';
            } else {
                return 'Ingrese punto intermedio';
            }
        },

        calcRoute () {
            for (let i = 0; i < this.points.length; i++) {
                if (!this.points[i].place) {
                    return;
                }
            }

            this.directionsService.route({
                origin: this.points[0].name,
                destination: this.points[this.points.length - 1].name,
                travelMode: 'DRIVING'
            }, (response, status) => {
                if (status === 'OK') {
                    this.directionsDisplay.setDirections(response);
                } else {
                    console.log('Directions request failed due to ' + status);
                }
            });
        }
    }
};
</script>