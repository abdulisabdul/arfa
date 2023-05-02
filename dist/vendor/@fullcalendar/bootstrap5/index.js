import { createPlugin } from '@fullcalendar/core/index.js';
import { BootstrapTheme } from './internal.js';
import '@fullcalendar/core/internal.js';

var index = createPlugin({
    name: '@fullcalendar/bootstrap5',
    themeClasses: {
        bootstrap5: BootstrapTheme,
    },
});

export { index as default };
