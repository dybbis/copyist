(function() {
    'use strict';

    angular.module('cmd', [
        /* Components modules */
        'cmd.mode.controller',

        /* Shared modules*/
        'cmd.core',
        'cmd.gist',

        /* Feature modules */
        'cmd.main.router',
        'cmd.main.controller',
        'cmd.user.gist.result.controller',
        'cmd.user.gist.search.controller',

        /* Service modules */
        'cmd.config.service',
        'cmd.keysequence.service'

    ]);

    angular.module('cmd.core', [
        /* Shared modules */
        'cmd.gist',

        /* Angular modules */
        'ngRoute',
        'ngAnimate',
        'ngProgress',
        'ngResource',
        'ngMessages',
        'ngMaterial',

    ]);

})();
