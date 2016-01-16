(function() {
    'use strict';

    angular
        .module('cmd.keysequence.service', [])
        .factory('Keysequence', Keysequence);

    Keysequence.$inject = ['$rootScope'];
    function Keysequence($rootScope) {

        var keysequence = {
            generate: function(Event) {
                if ([16,17,18,91,93, 224].indexOf(Event.keyCode) === -1) {
                    return (Event.ctrlKey ? 'ctrl+' : '')
                        + (Event.shiftKey ? 'shift+' : '')
                        + (Event.altKey ? 'alt+' : '')
                        + (Event.metaKey ? 'meta+' : '')
                        + $rootScope.keynames[Event.keyCode];
                }
                return false;
            },
            action: function(sequence) {
                var section = $rootScope.keybindings[$rootScope.activeKeybindings];
                return (section[sequence] && section[sequence].action) ? section[sequence].action : false;
            }
        }

        return keysequence;
    };

})();
