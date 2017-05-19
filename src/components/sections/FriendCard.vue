<template>
  <div class="col-lg-6 col-md-8 col-sm-12">

    <div class="trip" > 
        <div class="panel panel-default panel-card card card-trip">
          <div class="panel-heading card_heading">
            <div class="panel-title card-trip_title row">
              <template v-if="user">
                <div class="col-xs-5">
                    <img alt="" :src="user.image | profile-image" class="trip_driver_img circle-box" />
                </div>
                <div class="col-xs-14">
                  <div class="trip_driver_name" >
                    {{ user.name }}
                  </div>
                </div>
                <div class="col-xs-6">
                  <slot></slot>
                </div>
              </template>
            </div>
          </div>
        </div>
    </div>   

  </div>
</template>
<script>
export default {
    name: 'friend_card',
    props: [
        'user'
    ],
    data () {
        return {

        };
    },
    mounted () {

    }
};
</script>