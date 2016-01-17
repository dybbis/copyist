(function() {
    'use strict';

    angular
        .module('cmd.user.gist.result.controller', ['cmd.core', 'cmd.user.gist.property.service', 'cmd.copy.directive'])
        .controller('UserGistResult', UserGistResult);

    UserGistResult.$inject = ['$scope', 'UserGistProperties'];
    function UserGistResult($scope, UserGistProperties) {
        var resultVm = this;

        resultVm.result = UserGistProperties.getResult();

        angular.forEach(resultVm.result, function(res) {
            res.selected = false;
        });

        resultVm.focused = 0;

        if (resultVm.result[resultVm.focused]) {
            resultVm.result[resultVm.focused].selected = true;
        }

        $scope.$on('navigateDown', function() {

            if (resultVm.focused === resultVm.result.length -1) {
                return;
            }

            $scope.$apply(function() {
                resultVm.result[resultVm.focused].selected = false;
                resultVm.focused++;
                resultVm.result[resultVm.focused].selected = true;
            });
        });

        $scope.$on('navigateUp', function() {

            if (resultVm.focused === 0) {
                return;
            }

            $scope.$apply(function() {
                resultVm.result[resultVm.focused].selected = false;
                resultVm.focused--;
                resultVm.result[resultVm.focused].selected = true;
            });
        });
    };

})();
