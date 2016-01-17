(function() {
    'use strict';

    angular
        .module('cmd')
        .config(config)
        .run(authenticate);

    function config($interpolateProvider, $httpProvider, $authProvider) {
        $interpolateProvider.startSymbol('<%');
        $interpolateProvider.endSymbol('%>');

        $authProvider.configure({
            apiUrl: 'https://api.github.com',
            emailSignInPath: '/'
        });
    }

    authenticate.$inject = ['$rootScope', '$window', 'Config', 'Keysequence', '$auth', '$location'];
    function authenticate($rootScope, $window, Config, Keysequence, $auth, $location) {

        $rootScope.activeKeybindings = 'search';

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            console.log($location.path());
            next.resolve = angular.extend(next.resolve || {}, {
                currentUser: function() {
                    if ($rootScope.currentUser) {
                        return $rootScope.currentUser;
                    }

                    $auth.authenticate('github').then(function(res) {
                        console.log(res);
                    }).catch(function(res) {
                        $location.path('/login');
                    });
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
