/**
 * @ngdoc directive
 * @name powertip
 * @scope
 * @restrict A
 * @description
 * A directive using https://github.com/stevenbenner/jquery-powertip for showing tooltips.
 * Supports placement of tooltips via `placement` Attribute.
 */

angular.module('tpl.powertip', []).directive('powertip', [
  '$compile',
  '$document',
  function powertip(
    $compile,
    $document) {
    'use strict';

    return {
      template: '',
      restrict: 'A',
      scope: {
        placement: '@powertipPlacement',
        title: '=powertipTitle',
        color: '=powertipColor',
        config: '='
      },
      link: function(scope, element, attrs) {

        var styleElems = [];

        // initially set title attribute on element
        if (attrs.powertip) {
          element[0].title = attrs.title;
        }

        // build options
        var options = {};

        if (!scope.config) {
          options.smartPlacement = true;

          // config via attributes
          if (scope.placement) {
            options.placement = scope.placement;
          }

        } else {
          // config via config-object
          if (scope.config.placement) {
            options.placement = scope.config.placement;
          }

          options.title = scope.config.title;
        }

        // init powertip
        element.powerTip(options);

        // add powertip class to tooltip-element to apply a generic tooltip style
        element.on('powerTipRender', function() {
          $('#powerTip').addClass('powertip');
        });

        scope.$watch('config', function(newVal) {
          if (newVal && scope.config) {
            element.data('powertip', scope.config.title);
            // TODO: also update placement
          }
        });

        scope.$watch('color', function(newVal) {
          if (newVal) {

            angular.forEach(styleElems, function(elem) {
              elem.remove();
            });

            scope.color = newVal;

            styleElems.push($compile('<style>' +
              '.powertip' +
              '{  border-bottom: 4px solid ' + newVal + ';}</style>')(scope));

            styleElems.push($compile('<style>' +
              '.powertip.n:before, .powertip.ne:before, .powertip.nw:before, ' +
              '.powertip.ne-alt:before, .powertip.nw-alt:before' +
              '{border-top: 10px solid' + newVal + ';}</style>')(scope));

            styleElems.push($compile('<style>' +
              '.powertip.s, .powertip.se, .powertip.sw, .powertip.se-alt, .powertip.sw-alt' +
              '{border-top: 4px solid' + newVal + ';}</style>')(scope));

            styleElems.push($compile('<style>' +
              '.powertip.s:before, .powertip.se:before, .powertip.sw:before, ' +
              '.powertip.se-alt:before, .powertip.sw-alt:before' +
              '{border-bottom: 10px solid ' + newVal + ';}</style>')(scope));

            angular.forEach(styleElems, function(elem) {
              $document.find('head').append(elem);
            });
          }
        });

        // watch title for changes
        scope.$watch('title', function(newVal) {
          // powertip tooltip
          element.data('powertip', newVal);
        });

        // cleanup
        element.on('$destroy', function() {
          element.powerTip('destroy');
        });
      }
    };
  }
]);
