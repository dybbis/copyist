(function() {
    'use strict';

    angular
        .module('cmd.user.gist.property.service', [])
        .service('UserGistProperties', UserGistProperties);

    UserGistProperties.$inject = [];
    function UserGistProperties() {
        var result = null;

        var properties = {
            setResult: function(res) {
                result = res;
            },
            getResult: function() {
                return result;
            }
        }

        return properties;
    };

})();
