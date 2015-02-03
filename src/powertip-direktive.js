/**
 * @ngdoc directive
 * @name powertip
 * @scope
 * @restrict A
 * @description
 * A directive using https://github.com/stevenbenner/jquery-powertip for showing tooltips.
 * Supports placement of tooltips via `placement` Attribute.
 */

angular.module('tpl.powertip', []).directive('powertip', function powertip() {
  'use strict';

  return {
    template: '',
    restrict: 'A',
    scope: {
      placement: '@powertipPlacement',
      title: '=powertipTitle',
      config: '='
    },
    link: function(scope, element, attrs) {

      // initially set title attribute on element
      if (attrs.powertip) {
        element[0].title = attrs.title;
      }

      // build options
      var options = {};

      if (!scope.config) {
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
});
