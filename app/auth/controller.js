(function() {
    'use strict';

    angular
        .module('cmd.auth.controller', ['cmd.core'])
        .controller('Auth', Auth);

    Auth.$inject = ['$scope', '$location', '$auth'];
    function Auth($scope, $location, $auth) {
        var vm = this;

        vm.authenticate = function () {
            if (vm.credentials.email && vm.credentials.password) {
                console.log(vm.credentials);
                 $auth.submitLogin(vm.credentials).then(function(res) {
                    console.log(res);
                }).catch(function(res) {
                    console.log(res);
                });
            }
        }
    };

})();
