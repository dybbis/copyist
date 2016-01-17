(function() {
    'use strict';

    angular
        .module('cmd.gist.service', [])
        .factory('GistService', GistService);

    GistService.$inject = ['$http'];
    function GistService($http) {
        var gistService = {
            content: function(gist, success, error) {
                var files = []
                  , numberOfFiles = Object.keys(gist.files).length
                  , count = 0;

                angular.forEach(gist.files, function(file) {
                    $http.get(file.raw_url).success(function(res) {
                        file.content =res;
                        files.push(file);

                        count++;
                        if (count === numberOfFiles) {
                            success(files);
                        }
                    }).error(function() {
                        error();
                    });
                });
            }
        }

        return gistService;
    };

})();
