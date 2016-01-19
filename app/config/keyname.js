(function() {
    'use strict';

    angular
        .module('cmd.keyname', [])
        .factory('Keyname', Keyname);

    Keyname.$inject = ['$resource'];
    function Keyname($resource) {
        return $resource('http://localhost:13765/keyname/:id', {id: '@id'}, {
            get: {
                method: 'GET'
            }
        });
    }

})();
