(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('cmd')
        .config(config)
        .run(authenticate);

    function config($interpolateProvider, $httpProvider, $authProvider) {
        $interpolateProvider.startSymbol('<%');
        $interpolateProvider.endSymbol('%>');

        $authProvider.configure({
            apiUrl: 'https://api.github.com',
            emailSignInPath: '/'
        });
    }

    authenticate.$inject = ['$rootScope', '$window', 'Config', 'Keysequence', '$auth', '$location'];
    function authenticate($rootScope, $window, Config, Keysequence, $auth, $location) {

        $rootScope.activeKeybindings = 'search';

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            console.log($location.path());
            next.resolve = angular.extend(next.resolve || {}, {
                currentUser: function() {
                    if ($rootScope.currentUser) {
                        return $rootScope.currentUser;
                    }

                    $auth.authenticate('github').then(function(res) {
                        console.log(res);
                    }).catch(function(res) {
                        $location.path('/login');
                    });
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
        'cmd.copy.directive',

        /* Shared modules*/
        'cmd.core',
        'cmd.gist',

        /* Feature modules */
        'cmd.main.router',
        'cmd.main.controller',
        'cmd.auth.router',
        'cmd.auth.controller',
        'cmd.user.gist.result.controller',
        'cmd.user.gist.search.controller',

        /* Service modules */
        'cmd.config.service',
        'cmd.keysequence.service',
        'cmd.gist.service'

    ]);

    angular.module('cmd.core', [
        /* Shared modules */
        'cmd.gist',

        /* Angular modules */
        'ngRoute',
        'ngAnimate',
        'ngResource',
        'ngMessages',
        'ngMaterial',
        'ng-token-auth'

    ]);

})();

},{}],3:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('cmd.auth.controller', ['cmd.core'])
        .controller('Auth', Auth);

    Auth.$inject = ['$scope', '$location', '$auth'];
    function Auth($scope, $location, $auth) {
        var vm = this;

        vm.authenticate = function () {
            if (vm.credentials.email && vm.credentials.password) {
                console.log(vm.credentials);
                 $auth.submitLogin(vm.credentials).then(function(res) {
                    console.log(res);
                }).catch(function(res) {
                    console.log(res);
                });
            }
        }
    };

})();

},{}],4:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('cmd.auth.router', ['cmd.auth.controller', 'cmd.core'])
        .config(config);

    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'app/auth/template.html',
                controller: 'Auth',
                controllerAs: 'vm',
                anonymousAccess: true
            });
    }

})();

},{}],5:[function(require,module,exports){
(function() {
    'use strict';

    Clipboard = window.Clipboard;

    angular
        .module('cmd.copy.directive', [])
        .directive('copyClip', CopyClip)

    CopyClip.$inject = ['GistService', '$timeout'];
    function CopyClip(GistService, $timeout) {
        return {
            restrict: 'AE',
            scope: {
                event: "@",
                gist: "="
            },
            link: function (scope, elem, attrs) {

                var gistFiles = [];

                GistService.content(scope.gist, function(res) {
                    gistFiles = res;
                });

                scope.$on(scope.event, function() {
                    if(elem.hasClass('selected') && gistFiles.length > 0) {
                        var copy = angular.element('<div class="copy-element" data-clipboard-text="'+gistFiles[0].content+'"></div>');
                        var clipboard = new Clipboard(copy[0]);

                        clipboard.on('success', function(e) {
                            copy[0].parentNode.removeChild(copy[0]);
                            e.clearSelection();
                        });

                        clipboard.on('error', function(e) {
                            copy[0].parentNode.removeChild(copy[0]);
                            e.clearSelection();
                        });

                        elem.append(copy);
                        copy[0].click();
                        clipboard.destroy();
                    }
                });
            }
        };
    };

})();

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('cmd.gist.service', [])
        .factory('GistService', GistService);

    GistService.$inject = ['$http'];
    function GistService($http) {
        var gistService = {
            content: function(gist, success, error) {
                var files = []
                  , numberOfFiles = Object.keys(gist.files).length
                  , count = 0;

                angular.forEach(gist.files, function(file) {
                    $http.get(file.raw_url).success(function(res) {
                        file.content =res;
                        files.push(file);

                        count++;
                        if (count === numberOfFiles) {
                            success(files);
                        }
                    }).error(function() {
                        error();
                    });
                });
            }
        }

        return gistService;
    };

})();

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('cmd.user.gist.result.controller', ['cmd.core', 'cmd.user.gist.property.service', 'cmd.copy.directive'])
        .controller('UserGistResult', UserGistResult);

    UserGistResult.$inject = ['$scope', 'UserGistProperties'];
    function UserGistResult($scope, UserGistProperties) {
        var resultVm = this;

        resultVm.result = UserGistProperties.getResult();

        angular.forEach(resultVm.result, function(res) {
            res.selected = false;
        });

        resultVm.focused = 0;

        if (resultVm.result[resultVm.focused]) {
            resultVm.result[resultVm.focused].selected = true;
        }

        $scope.$on('navigateDown', function() {

            if (resultVm.focused === resultVm.result.length -1) {
                return;
            }

            $scope.$apply(function() {
                resultVm.result[resultVm.focused].selected = false;
                resultVm.focused++;
                resultVm.result[resultVm.focused].selected = true;
            });
        });

        $scope.$on('navigateUp', function() {

            if (resultVm.focused === 0) {
                return;
            }

            $scope.$apply(function() {
                resultVm.result[resultVm.focused].selected = false;
                resultVm.focused--;
                resultVm.result[resultVm.focused].selected = true;
            });
        });
    };

})();

},{}],14:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('cmd.user.gist.search.controller', ['cmd.core', 'cmd.user.gist.property.service'])
        .controller('UserGistSearch', UserGistSearch);

    UserGistSearch.$inject = ['$scope', 'Gist', 'UserGistProperties'];
    function UserGistSearch($scope, Gist, UserGistProperties) {
        var searchVm = this;

        searchVm.gists = Gist.list();
        searchVm.searching = false;

        $scope.$watch('searchVm.search', function(searchText) {
            var result = [];
            if (typeof searchText !== 'undefined' && searchText.length > 0) {
                searchVm.searching = true;

                angular.forEach(searchVm.gists, function(gist) {
                    if (gist.description.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
                        result.push(gist);
                    }
                });

                UserGistProperties.setResult(result);

            } else {
                searchVm.searching = false;
            }
        });
    };

})();

},{}],15:[function(require,module,exports){
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

},{}]},{},[2,1,3,4,5,6,7,8,9,10,11,12,13,14,15]);
