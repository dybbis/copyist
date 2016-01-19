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

    authenticate.$inject = ['$rootScope', '$window', 'Keysequence', 'Auth', '$location'];
    function authenticate($rootScope, $window, Keysequence, Auth, $location) {

        $rootScope.activeKeybindings = 'search';

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            next.resolve = angular.extend(next.resolve || {}, {
                currentUser: function() {
                    if ($rootScope.currentUser) {
                        return $rootScope.currentUser;
                    }

                    Auth.currentUser(function(res) {
                        console.log(res);
                    }, function() {
                        $location.path('/login');
                    });
                }
            });
        });

        angular.element($window).on('keydown', function(e) {
            Keysequence.generate(e, function(keysequence) {
                Keysequence.action(keysequence).$promise.then(function(keybinding) {
                    $rootScope.$broadcast(keybinding.action);
                });
            });

        });
    }

})();
