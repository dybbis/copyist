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

    authenticate.$inject = ['$rootScope', '$window', 'Keysequence', 'Auth', '$location'];
    function authenticate($rootScope, $window, Keysequence, Auth, $location) {

        $rootScope.activeKeybindings = 'search';

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            next.resolve = angular.extend(next.resolve || {}, {
                currentUser: function() {
                    if ($rootScope.currentUser) {
                        return $rootScope.currentUser;
                    }

                    Auth.currentUser(function(res) {
                        console.log(res);
                    }, function() {
                        $location.path('/login');
                    });
                }
            });
        });

        angular.element($window).on('keydown', function(e) {
            Keysequence.generate(e, function(keysequence) {
                Keysequence.action(keysequence).$promise.then(function(keybinding) {
                    $rootScope.$broadcast(keybinding.action);
                });
            });

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
        'cmd.keybinding',
        'cmd.keyname',
        'cmd.account',

        /* Feature modules */
        'cmd.main.router',
        'cmd.main.controller',
        'cmd.auth.router',
        'cmd.auth.controller',
        'cmd.user.gist.result.controller',
        'cmd.user.gist.search.controller',

        /* Service modules */
        'cmd.auth.service',
        'cmd.base64.service',
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
        'ngMaterial'

    ]);

})();

},{}],3:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('cmd.auth.controller', ['cmd.core'])
        .controller('Auth', Auth);

    Auth.$inject = ['$scope', '$rootScope', '$location', 'Auth', 'Account'];
    function Auth($scope, $rootScope, $location, Auth, Account) {
        var vm = this;

        vm.authenticate = function () {
            if (vm.credentials.email && vm.credentials.password) {

                Auth.login(vm.credentials.email, vm.credentials.password, function() {
                    if (vm.credentials.save) {
                        console.log($rootScope.currentUser);
                        Account.save($rootScope.currentUser).$promise.then(function() {
                            $location.path('/');
                        }, function() {
                            console.log("could not save account");
                        });
                    } else {
                        $location.path('/');
                    }
                }, function() {
                    console.log(res, "@todo: DIsplay auth failure message");
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('cmd.auth.service', [])
        .factory('Auth', Auth);

    Auth.$inject = ['$http', 'Base64', '$rootScope'];
    function Auth($http, Base64, $rootScope) {
        var auth = {
            login: function(username, password, success, error) {
                var authdata = Base64.encode(username + ':' + password);
                $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;

                $http.get('https://api.github.com/user').then(function(res) {
                    $http.post('http://localhost:13765/user', res).then(function(user) {
                        $rootScope.currentUser = user.data;
                        $http.defaults.headers.common.Authorization = $rootScope.currentUser.token;
                        success();
                    }, function() {
                        console.log('could not set current user');
                        error();
                    });
                }, function(res) {
                    $http.defaults.headers.common.Authorization = 'Basic ';
                    console.log(res, "could not authenticate user");
                    error();
                });
            },
            currentUser: function(success, error) {
                console.log($rootScope.currentUser);
                error();
            }
        }

        return auth;
    };

})();

},{}],14:[function(require,module,exports){
(function() {
    'use strict';

    angular
        .module('cmd.base64.service', [])
        .factory('Base64', Base64);

    Base64.$inject = [];
    function Base64() {

        var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        return {
            encode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);

                return output;
            },

            decode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    window.alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";

                } while (i < input.length);

                return output;
            }
        };
    };
})();

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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

},{}]},{},[2,1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]);
