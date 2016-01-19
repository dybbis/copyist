(function() {
    'use strict';

    angular
        .module('cmd.keysequence.service', [])
        .factory('Keysequence', Keysequence);

    Keysequence.$inject = ['$rootScope', 'Keybinding', 'Keyname'];
    function Keysequence($rootScope, Keybinding, Keyname) {

        var keysequence = {
            generate: function(Event, success) {
                if ([16,17,18,91,93, 224].indexOf(Event.keyCode) === -1) {
                    Keyname.get({id: Event.keyCode}).$promise.then(function(name) {
                        var sequence = (Event.ctrlKey ? 'ctrl+' : '')
                            + (Event.shiftKey ? 'shift+' : '')
                            + (Event.altKey ? 'alt+' : '')
                            + (Event.metaKey ? 'meta+' : '')
                            + name.text;
                        success(sequence);
                    });
                }
            },
            action: function(sequence) {
                return Keybinding.get({
                    section: $rootScope.activeKeybindings,
                    id: sequence
                });
            }
        }

        return keysequence;
    };

})();
