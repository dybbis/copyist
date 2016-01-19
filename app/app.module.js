(function() {
    'use strict';

    angular.module('cmd', [
        /* Components modules */
        'cmd.mode.controller',
        'cmd.copy.directive',

        /* Shared modules*/
        'cmd.core',
        'cmd.gist',
        'cmd.keybinding',
        'cmd.keyname',
        'cmd.account',

        /* Feature modules */
        'cmd.main.router',
        'cmd.main.controller',
        'cmd.auth.router',
        'cmd.auth.controller',
        'cmd.user.gist.result.controller',
        'cmd.user.gist.search.controller',

        /* Service modules */
        'cmd.auth.service',
        'cmd.base64.service',
        'cmd.config.service',
        'cmd.keysequence.service',
        'cmd.gist.service'

    ]);

    angular.module('cmd.core', [
        /* Shared modules */
        'cmd.gist',

        /* Angular modules */
        'ngRoute',
        'ngAnimate',
        'ngResource',
        'ngMessages',
        'ngMaterial'

    ]);

})();
