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

    authenticate.$inject = ['$rootScope', '$window', 'Config', 'Keysequence'];
    function authenticate($rootScope, $window, Config, Keysequence) {

        $rootScope.activeKeybindings = 'search';

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            next.resolve = angular.extend(next.resolve || {}, {
                currentUser: function() {
                    return true;
                },
                keybindings: function() {
                    Config.keybindings();
                },
                keynames: function() {
                    Config.keynames();
                }
            });
        });

        angular.element($window).on('keydown', function(e) {
            var keysequence = Keysequence.generate(e)
              , action = null;

            if (keysequence) {
                if (action = Keysequence.action(keysequence)) {
                    $rootScope.$broadcast(action);
                }
            }

        });
    }

})();

},{}],2:[function(require,module,exports){
(function() {
    'use strict';

    angular.module('cmd', [
        /* Components modules */
        'cmd.mode.controller',

        /* Shared modules*/
        'cmd.core',
        'cmd.gist',

        /* Feature modules */
        'cmd.main.router',
        'cmd.main.controller',
        'cmd.user.gist.result.controller',
        'cmd.user.gist.search.controller',

        /* Service modules */
        'cmd.config.service',
        'cmd.keysequence.service'

    ]);

    angular.module('cmd.core', [
        /* Shared modules */
        'cmd.gist',

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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('cmd.main.router', ['cmd.main.controller', 'cmd.core', 'cmd.gist'])
        .config(config);

    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'app/main/template.html',
                controller: 'Main',
                controllerAs: 'vm',
                anonymousAccess: true
            });
    }

})();

},{}],6:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('cmd.mode.controller', ['cmd.core'])
        .controller('Mode', Mode);

    Mode.$inject = ['$scope'];
    function Mode($scope) {
        var vm = this;

    };

})();

},{}],7:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('cmd.config.service', [])
        .factory('Config', Config);

    Config.$inject = ['$http', '$rootScope'];
    function Config($http, $rootScope) {
        var config = {
            keybindings: function() {

                if ($rootScope.keybindings) {
                    return;
                }

                $http.get('http://localhost:13765/keybindings').success(function(res) {
                    $rootScope.keybindings = res;
                }).error(function() {
                    console.log("could not load keybindings");
                });
            },
            keynames: function() {

                if ($rootScope.keynames) {
                    return;
                }

                $http.get('http://localhost:13765/keynames').success(function(res) {
                    $rootScope.keynames = res;
                }).error(function() {
                    console.log("could not load keynames");
                });
            }
        }

        return config;
    };

})();

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('cmd.user.gist.result.controller', ['cmd.core'])
        .controller('UserGistResult', UserGistResult);

    UserGistResult.$inject = ['$scope'];
    function UserGistResult($scope) {
        var resultVm = this;

        console.log($scope.$parent.$parent.$parent.searchVm.result);

        //vm.result[0].selected = true;
    };

})();

},{}],10:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('cmd.user.gist.search.controller', ['cmd.core'])
        .controller('UserGistSearch', UserGistSearch);

    UserGistSearch.$inject = ['$scope', 'Gist'];
    function UserGistSearch($scope, Gist) {
        var searchVm = this;

        $scope.gists = Gist.list();

        $scope.$watch('searchVm.search', function(searchText) {
            searchVm.result = [];
            if (typeof searchText !== 'undefined' && searchText.length > 0) {
                angular.forEach($scope.gists, function(gist) {
                    if (gist.description.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
                        searchVm.result.push(gist);
                    }
                });
            }
        });
    };

})();

},{}]},{},[2,1,3,4,5,6,7,8,9,10]);
