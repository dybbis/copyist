(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('cmd')
        .config(config)
        .run(authenticate);

    function config($interpolateProvider, $httpProvider) {
        $interpolateProvider.startSymbol('<%');
        $interpolateProvider.endSymbol('%>');
    }

    authenticate.$inject = ['$rootScope'];
    function authenticate($rootScope) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            if (!next.anonymousAccess) {
                next.resolve = angular.extend(next.resolve || {}, {
                    currentUser: function() {
                        return true;
                    }
                });
            }
        });
    }

})();

},{}],2:[function(require,module,exports){
(function() {
    'use strict';

    angular.module('cmd', [

        /* Shared modules*/
        'cmd.core',
        'cmd.header',

        /* Feature modules */
        'cmd.front',

    ]);

    angular.module('cmd.core', [
        /* Shared modules */

        /* Angular modules */
        'ngRoute',
        'ngAnimate',
        'ngProgress',
        'ngResource',
        'ngMessages',
        'ngMaterial',

    ]);

})();

},{}],3:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('cmd.front', [])
        .controller('Frontpage', Frontpage);

    function Frontpage() {
        var vm = this;

    };

})();

},{}],4:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('cmd.front')
        .config(config);

    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'app/front/front.html',
                controller: 'Frontpage',
                controllerAs: 'vm',
                anonymousAccess: true
            });
    }

})();

},{}],5:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('cmd.header', [])
        .controller('Header', Header);

    function Header() {

    };

})();

},{}]},{},[2,1,3,4,5]);
