import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import calendar from 'dayjs/plugin/calendar';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/es';
import 'dayjs/locale/en';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(calendar);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(advancedFormat);
dayjs.extend(updateLocale);

// Match moment.js Spanish calendar strings
dayjs.updateLocale('es', {
    calendar: {
        sameDay: '[hoy a las] LT',
        nextDay: '[mañana a las] LT',
        nextWeek: 'dddd [a las] LT',
        lastDay: '[ayer a las] LT',
        lastWeek: '[el] dddd [pasado a las] LT',
        sameElse: 'L'
    }
});

dayjs.tz.setDefault('America/Argentina/Buenos_Aires');
dayjs.locale('es');

export default dayjs;
