(function() {
    'use strict';

    angular
        .module('cmd.gist', [])
        .factory("Gist", Gist);

    Gist.$inject = ['$resource'];
    function Gist($resource) {
        return $resource('https://api.github.com/api/v3/gists/:id', {id: '@id'}, {
            get: {
                method: 'GET'
            },
            list: {
                url: 'https://api.github.com/users/jodybdal/gists',
                //url: 'https://api.github.com/api/v3/users/'+$currentUser.username+'/gists',
                method: 'GET',
                isArray: true
            },
            remove: {
                method: 'DELETE'
            },
            update: {
                method: 'PATCH'
            },
            save: {
                method: 'POST'
            }
        });
    }

})();
