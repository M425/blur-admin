/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pbseye.monitor', [])
    .config(routeConfig)
    .run(loader);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('monitor', {
          url: '/monitor',
          template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
          abstract: true,
          controller: 'MonitorCtrl',
          title: 'Monitor',
          sidebarMeta: {
            icon: 'ion-grid',
            order: 1,
          },
        }).state('monitor.jobs', {
          url: '/jobs',
          templateUrl: 'app/pbseye/monitor/jobs/jobs.html',
          title: 'Jobs',
          controller: 'MonitorPageCtrl',
          sidebarMeta: {
            order: 0,
          },
        }).state('monitor.jobdetail', {
          url: '/job/{job_id}',
          title: 'Job detail',
          templateUrl: 'app/pbseye/monitor/jobs/jobDetail.html',
          controller: 'JobDetailCtrl as vm',
        });
    $urlRouterProvider.when('/monitor','/monitor/jobs');
  }

  function loader($rootScope, $timeout, toastrConfig) {
      $rootScope.myloading = 0;
      $rootScope.myloading_start = new Date();
      $rootScope.endLoading = function () {
          if($rootScope.myloading == 1) {
              var elapsed = (new Date()) - $rootScope.myloading_start;
              if ( elapsed < 500) {
                  $timeout(function(){$rootScope.myloading --;}, 500 - elapsed);
              } else {
                  $rootScope.myloading --;
              }
          } else {
              $rootScope.myloading --;
          }
      };
      $rootScope.startLoading = function () {
          if($rootScope.myloading == 0) {
              $rootScope.myloading_start = new Date();
          }
          $rootScope.myloading ++;
      };
      angular.extend(toastrConfig, {
            "autoDismiss": false,
            "positionClass": "toast-bottom-right",
            "type": "info",
            "timeOut": "5000",
            "extendedTimeOut": "2000",
            "allowHtml": false,
            "closeButton": false,
            "tapToDismiss": true,
            "progressBar": true,
            "newestOnTop": true,
            "maxOpened": 0,
            "preventDuplicates": false,
            "preventOpenDuplicates": false
      });
  }
})();
