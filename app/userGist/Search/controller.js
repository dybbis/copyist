(function() {
    'use strict';

    angular
        .module('cmd.user.gist.search.controller', ['cmd.core'])
        .controller('UserGistSearch', UserGistSearch);

    UserGistSearch.$inject = ['$scope', 'Gist'];
    function UserGistSearch($scope, Gist) {
        var searchVm = this;

        $scope.gists = Gist.list();

        $scope.$watch('searchVm.search', function(searchText) {
            searchVm.result = [];
            if (typeof searchText !== 'undefined' && searchText.length > 0) {
                angular.forEach($scope.gists, function(gist) {
                    if (gist.description.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
                        searchVm.result.push(gist);
                    }
                });
            }
        });
    };

})();
