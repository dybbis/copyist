(function() {
    'use strict';

    angular
        .module('cmd.user.gist.result.controller', ['cmd.core'])
        .controller('UserGistResult', UserGistResult);

    UserGistResult.$inject = ['$scope'];
    function UserGistResult($scope) {
        var resultVm = this;

        console.log($scope.$parent.$parent.$parent.searchVm.result);

        //vm.result[0].selected = true;
    };

})();
