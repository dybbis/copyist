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
