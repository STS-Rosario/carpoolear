<template>
  <span class='svgItem'>
      <svg v-if="icon === 'profile'" :height="computedSize" viewBox="0 0 24 24" :width="computedSize" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>

      <svg v-else-if="icon === 'addPhoto'" :height="computedSize" viewBox="0 0 24 24" :width="computedSize" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
            <path d="M24 24H0V0h24v24z" id="a"/>
        </defs>
        <clipPath id="b">
            <use overflow="visible" xlink:href="#a"/>
        </clipPath>
        <path clip-path="url(#b)" d="M3 4V1h2v3h3v2H5v3H3V6H0V4h3zm3 6V7h3V4h7l1.83 2H21c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V10h3zm7 9c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-3.2-5c0 1.77 1.43 3.2 3.2 3.2s3.2-1.43 3.2-3.2-1.43-3.2-3.2-3.2-3.2 1.43-3.2 3.2z"/>
      </svg>

      <svg v-else-if="icon === 'home'" :height="computedSize" viewBox="0 0 24 24" :width="computedSize" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>

      <svg v-else-if="icon === 'message'" :height="computedSize" viewBox="0 0 24 24" :width="computedSize" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>

      <svg v-else-if="icon === 'bell'" :height="computedSize" viewBox="0 0 24 24" :width="computedSize" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
      </svg>

      <svg v-else-if="icon === 'contact'" :height="computedSize" viewBox="0 0 24 24" :width="computedSize" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>

      <svg v-else-if="icon === 'thumbDown'" :height="computedSize" viewBox="0 0 24 24" :width="computedSize" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
      </svg>

      <svg  v-else-if="icon === 'thumbUp'" :height="computedSize" viewBox="0 0 24 24" :width="computedSize" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"/>
      </svg>

      <svg v-else-if="icon === 'add'" :height="computedSize" viewBox="0 0 24 24" :width="computedSize" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
  </span>
</template>


<script>
export default {
    name: 'svgItem',
    data () {
        return {
        };
    },
    props: ['icon', 'size'],
    computed: {
        computedSize () {
            if (!this.size) {
                return 48;
            } else {
                return this.size;
            }
        }
    }
};
</script>

<style>
  svg {
    fill: #000;
  }
  .profile_image-edit svg {
    fill: var(--secondary-background);
  }
  .profile_image-edit:hover svg {
    fill: #0f90bb;
  }
  .trip-detail-component .profile-info--ratings svg {
    display: inline;
    margin-right: .4em;
    vertical-align: middle;
    fill: #fff;
  }
  .actionbar-bottom .actionbar_item svg {
    fill: #666;
  }
  .actionbar-bottom .actionbar_item .big svg {
    margin-top: 6px;
    fill: #fff
  }
  .actionbar-bottom .actionbar_item .big .svgItem path:first-child{
    stroke: #fff;
  }
  .actionbar-bottom .actionbar_item.active svg {
    fill: var(--secondary-background);
  }


</style>