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

    authenticate.$inject = ['$rootScope', '$window', 'Config', 'Keysequence'];
    function authenticate($rootScope, $window, Config, Keysequence) {

        $rootScope.activeKeybindings = 'search';

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            next.resolve = angular.extend(next.resolve || {}, {
                currentUser: function() {
                    return true;
                },
                keybindings: function() {
                    Config.keybindings();
                },
                keynames: function() {
                    Config.keynames();
                }
            });
        });

        angular.element($window).on('keydown', function(e) {
            var keysequence = Keysequence.generate(e)
              , action = null;

            if (keysequence) {
                if (action = Keysequence.action(keysequence)) {
                    $rootScope.$broadcast(action);
                }
            }

        });
    }

})();
