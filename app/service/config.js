(function() {
    'use strict';

    angular
        .module('cmd.config.service', [])
        .factory('Config', Config);

    Config.$inject = ['$http', '$rootScope'];
    function Config($http, $rootScope) {
        var config = {
            keybindings: function() {

                if ($rootScope.keybindings) {
                    return;
                }

                $http.get('http://localhost:13765/keybindings').success(function(res) {
                    $rootScope.keybindings = res;
                }).error(function() {
                    console.log("could not load keybindings");
                });
            },
            keynames: function() {

                if ($rootScope.keynames) {
                    return;
                }

                $http.get('http://localhost:13765/keynames').success(function(res) {
                    $rootScope.keynames = res;
                }).error(function() {
                    console.log("could not load keynames");
                });
            }
        }

        return config;
    };

})();
