(function() {
    'use strict';

    angular
        .module('cmd')
        .config(config)
        .run(authenticate);

    function config($interpolateProvider, $httpProvider) {
        $interpolateProvider.startSymbol('<%');
        $interpolateProvider.endSymbol('%>');
    }

    authenticate.$inject = ['$rootScope'];
    function authenticate($rootScope) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            if (!next.anonymousAccess) {
                next.resolve = angular.extend(next.resolve || {}, {
                    currentUser: function() {
                        return true;
                    }
                });
            }
        });
    }

})();
