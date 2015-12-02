(function() {
    'use strict';

    angular.module('cmd', [

        /* Shared modules*/
        'cmd.core',
        'cmd.header',

        /* Feature modules */
        'cmd.front',

    ]);

    angular.module('cmd.core', [
        /* Shared modules */

        /* Angular modules */
        'ngRoute',
        'ngAnimate',
        'ngProgress',
        'ngResource',
        'ngMessages',
        'ngMaterial',

    ]);

})();
