(function() {
    'use strict';

    angular
        .module('cmd.auth.service', [])
        .factory('Auth', Auth);

    Auth.$inject = ['$http', 'Base64', '$rootScope'];
    function Auth($http, Base64, $rootScope) {
        var auth = {
            login: function(username, password, success, error) {
                var authdata = Base64.encode(username + ':' + password);
                $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;

                $http.get('https://api.github.com/user').then(function(res) {
                    $http.post('http://localhost:13765/user', res).then(function(user) {
                        $rootScope.currentUser = user.data;
                        $http.defaults.headers.common.Authorization = $rootScope.currentUser.token;
                        success();
                    }, function() {
                        console.log('could not set current user');
                        error();
                    });
                }, function(res) {
                    $http.defaults.headers.common.Authorization = 'Basic ';
                    console.log(res, "could not authenticate user");
                    error();
                });
            },
            currentUser: function(success, error) {
                console.log($rootScope.currentUser);
                error();
            }
        }

        return auth;
    };

})();
