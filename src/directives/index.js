
import Vue from 'vue';
import autofocus from './autofocus';
import jump from './jump';
import imgSrc from './imageSrc.js';

Vue.directive('focus', autofocus);
Vue.directive('jump', jump);
Vue.directive('imgSrc', imgSrc);
