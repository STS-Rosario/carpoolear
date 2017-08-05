<template>
  <div class="col-lg-6 col-md-8 col-sm-12">
    <div class="friend-card rate-pending_component clearfix" > 
      <template v-if="user">
        <div class="rate-pending_photo">
            <router-link :to="{name: 'profile', params: {id: user.id, userProfile: user}}">
              <div class="trip_driver_img circle-box" v-imgSrc:profile="user.image"></div>
            </router-link>
        </div>
        <div class="rate-pending-message">
          <div>
            <strong>{{ user.name }}</strong>
            <slot></slot>
          </div>
        </div>
      </template>
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

<style scoped>
  .friend-card {
    padding: 1em;
  }
  .friend-card .trip_driver_img {
    width: 5em;
    height: 5em;
  }
  .rate-pending_photo {
    margin-top: .2em;
    width: 6em;
  }
  .rate-pending-message {
    margin-top: 0;
  }
  .pending-buttons button {
    width: calc(50% - .3em);
    border-radius: .3em;
    min-width: auto;
    padding: .92em;
  }
  .pending-buttons button:first-child {
    margin-right: .3em;
  }
  @media only screen and (min-width: 782px) {
    .friends-list .col-sm-12 {
      padding: 0;
    }
  }

  @media only screen and (min-width: 992px) {
    .btn-primary {
        font-size: 11px;
        min-width: 3rem;
        border-radius: .2em;
        padding: .8em .8em;
    }
  }
</style>