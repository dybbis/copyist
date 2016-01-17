(function() {
    'use strict';

    angular
        .module('cmd.auth.router', ['cmd.auth.controller', 'cmd.core'])
        .config(config);

    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'app/auth/template.html',
                controller: 'Auth',
                controllerAs: 'vm',
                anonymousAccess: true
            });
    }

})();
