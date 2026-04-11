import autofocus from './autofocus';
import Jump from '@movilizame/vue-jumper';
import imgSrc from './imageSrc';
import numberFormatter from './numberFormatter';
import dateFormatter from './dateFormatter';
import debounceInput from './debounceInput';
import { vMaska } from 'maska/vue';
import clickOutside from './clickOutside';
import fancyCheckbox from './fancyCheckbox';

export function registerDirectives(app) {
    app.directive('focus', autofocus);
    app.directive('jump', Jump);
    app.directive('imgSrc', imgSrc);
    app.directive('mask', vMaska);
    app.directive('numberMask', numberFormatter);
    app.directive('dateFormatter', dateFormatter);
    app.directive('debounceInput', debounceInput);
    app.directive('clickoutside', clickOutside);
    app.directive('fancycheckbox', fancyCheckbox);
}
