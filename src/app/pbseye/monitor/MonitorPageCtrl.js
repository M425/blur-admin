/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pbseye.monitor')
      .controller('MonitorPageCtrl', MonitorPageCtrl);

  /** @ngInject */
  function MonitorPageCtrl($scope, $filter, editableOptions, editableThemes, res, toastr) {

    res.get('jobs').then(function(data) {
      console.log('data in ctrl', data);
      $scope.smartTableData = data;
      toastr.info('There are ' + data.length + ' jobs.', 'Jobs loaded', {
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
    })

    $scope.smartTablePageSize = 10;

    // $scope.editableTableData = $scope.smartTableData.slice(0, 36);

    $scope.refreshJobs = function () {
        console.log('refreshing...');
        res.reset('jobs');
        res.get('jobs').then(function(data) {
          console.log('data in ctrl', data);
          $scope.smartTableData = data;
          toastr.info('There are ' + data.length + ' jobs.', 'Jobs loaded');
        });
    }
  }

})();
