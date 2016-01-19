(function() {
    'use strict';

    angular
        .module('cmd.auth.controller', ['cmd.core'])
        .controller('Auth', Auth);

    Auth.$inject = ['$scope', '$rootScope', '$location', 'Auth', 'Account'];
    function Auth($scope, $rootScope, $location, Auth, Account) {
        var vm = this;

        vm.authenticate = function () {
            if (vm.credentials.email && vm.credentials.password) {

                Auth.login(vm.credentials.email, vm.credentials.password, function() {
                    if (vm.credentials.save) {
                        console.log($rootScope.currentUser);
                        Account.save($rootScope.currentUser).$promise.then(function() {
                            $location.path('/');
                        }, function() {
                            console.log("could not save account");
                        });
                    } else {
                        $location.path('/');
                    }
                }, function() {
                    console.log(res, "@todo: DIsplay auth failure message");
                });
            }
        }
    };

})();
