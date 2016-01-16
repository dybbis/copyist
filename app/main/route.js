(function() {
    'use strict';

    angular
        .module('cmd.main.router', ['cmd.main.controller', 'cmd.core', 'cmd.gist'])
        .config(config);

    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'app/main/template.html',
                controller: 'Main',
                controllerAs: 'vm',
                anonymousAccess: true
            });
    }

})();
