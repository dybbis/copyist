(function() {
    'use strict';

    angular
        .module('cmd.keybinding', [])
        .factory('Keybinding', Keybinding);

    Keybinding.$inject = ['$resource'];
    function Keybinding($resource) {
        return $resource('http://localhost:13765/keybinding/:section/:id', {section: '@section', id: '@id'}, {
            get: {
                method: 'GET'
            },
            update: {
                method: 'PATCH'
            }
        });
    }

})();
