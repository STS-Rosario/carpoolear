
import Vue from 'vue';
import autofocus from './autofocus';
import jump from './jump';
import imgSrc from './imageSrc.js';
import { VueMaskDirective } from 'v-mask';

Vue.directive('focus', autofocus);
Vue.directive('jump', jump);
Vue.directive('imgSrc', imgSrc);
Vue.directive('mask', VueMaskDirective);

