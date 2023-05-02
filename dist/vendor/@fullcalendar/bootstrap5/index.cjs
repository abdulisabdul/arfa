'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var index_cjs = require('@fullcalendar/core/index.cjs');
var internalCommon = require('./internal.cjs');
require('@fullcalendar/core/internal.cjs');

var index = index_cjs.createPlugin({
    name: '@fullcalendar/bootstrap5',
    themeClasses: {
        bootstrap5: internalCommon.BootstrapTheme,
    },
});

exports["default"] = index;
