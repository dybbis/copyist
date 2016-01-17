(function() {
    'use strict';

    angular
        .module('cmd.user.gist.search.controller', ['cmd.core', 'cmd.user.gist.property.service'])
        .controller('UserGistSearch', UserGistSearch);

    UserGistSearch.$inject = ['$scope', 'Gist', 'UserGistProperties'];
    function UserGistSearch($scope, Gist, UserGistProperties) {
        var searchVm = this;

        searchVm.gists = Gist.list();
        searchVm.searching = false;

        $scope.$watch('searchVm.search', function(searchText) {
            var result = [];
            if (typeof searchText !== 'undefined' && searchText.length > 0) {
                searchVm.searching = true;

                angular.forEach(searchVm.gists, function(gist) {
                    if (gist.description.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
                        result.push(gist);
                    }
                });

                UserGistProperties.setResult(result);

            } else {
                searchVm.searching = false;
            }
        });
    };

})();
