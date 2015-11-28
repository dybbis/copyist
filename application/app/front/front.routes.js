(function() {
    'use strict';

    angular
        .module('cmd.front')
        .config(config);

    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'app/front/front.html',
                controller: 'Frontpage',
                controllerAs: 'vm',
                anonymousAccess: true
            });
    }

})();
