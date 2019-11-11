import Vue from 'vue';
import autofocus from './autofocus';
import Jump from '@movilizame/vue-jumper';
import imgSrc from './imageSrc';
import numberFormatter from './numberFormatter';
import dateFormatter from './dateFormatter';
import debounceInput from './debounceInput';
import { VueMaskDirective } from 'v-mask';
import clickOutside from './clickOutside';

Vue.directive('focus', autofocus);
Vue.directive('jump', Jump);
Vue.directive('imgSrc', imgSrc);
Vue.directive('mask', VueMaskDirective);
Vue.directive('numberMask', numberFormatter);
Vue.directive('dateFormatter', dateFormatter);
Vue.directive('debounceInput', debounceInput);
Vue.directive('clickoutside', clickOutside);
