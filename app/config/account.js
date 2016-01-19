(function() {
    'use strict';

    angular
        .module('cmd.account', [])
        .factory('Account', Account);

    Account.$inject = ['$resource'];
    function Account($resource) {
        return $resource('http://localhost:13765/account/:id', {id: '@id'}, {
            get: {
                method: 'GET'
            },
            update: {
                method: 'PATCH'
            },
            save: {
                method: 'POST'
            },
            remove: {
                method: 'DELETE'
            }
        });
    }

})();
