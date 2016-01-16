(function() {
    'use strict';

    angular
        .module('cmd.main.controller', ['cmd.core'])
        .controller('Main', Main);

    Main.$inject = ['$scope'];
    function Main($scope) {
        var vm = this;
    };

})();
