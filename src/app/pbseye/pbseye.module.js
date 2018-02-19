/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pbseye', [
    'ui.router',
    'toastr',
    'chart.js',
    'angular-chartist',
    'angular.morris-chart',
    'textAngular',

    'BlurAdmin.pbseye.monitor',
  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/monitor');
  }

})();
