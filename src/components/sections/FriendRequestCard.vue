<template>
  <div class="col-lg-6 col-md-8 col-sm-12">
    <div class="friend-card clearfix" >
      <template v-if="user">
        <div class="rate-pending_photo">
            <router-link :to="{name: 'profile', params: { id: user.id, userProfile: user, activeTab: 1}}">
              <div class="trip_driver_img circle-box" v-imgSrc:profile="user.image"></div>
            </router-link>
        </div>
        <div class="rate-pending-message">
            <strong>{{ user.name }}</strong>
        </div>
        <slot></slot>
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
  .form-group {
    width: 100%;
  }
  .friend-card {
    padding: .6em;
    vertical-align: middle;
    line-height: 5em;
  }
  .friend-card .trip_driver_img {
    width: 5em;
    height: 5em;
  }
  .rate-pending_photo {
    margin-top: .2em;
    width: 6em;
    float: left;
    height: 5.5em;
  }
  .delete-friend {
    width: 1.6em;
    float: left;
  }
  .delete-friend i {
    font-size: 20px;
    cursor: pointer;
  }
  .rate-pending-message {
    margin-top: 0;
    float: left;
    width: calc(100% - 7.6em);
    padding-left: .4em;
    white-space: nowrap;
    word-break: normal;
  }
  .pending-buttons button {
    width: calc(50% - .3em);
    border-radius: .3em;
    min-width: auto;
    padding: .8em;
  }
  .pending-buttons button:first-child {
    margin-right: .3em;
  }
  #friends-list > div {
    padding: 0;
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
    @media only screen and (max-width: 400px) {
      .pending-buttons .btn-accept-request {
          padding: .92em;
      }
    }
    @media only screen and (max-width: 350px) {
        .rate-pending_photo {
            display: block;
        }
    }
    @media only screen and (max-width: 300px) {
        .rate-pending_photo {
            display: none;
        }
        .rate-pending-message {
            width: calc(100% - 1.6em);
        }
    }
</style>
