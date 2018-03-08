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
      $scope.smartTableData = data;
      toastr.info('There are ' + data.length + ' jobs.', 'Jobs loaded');
      res.get('jobsdetailed', {}, {noLoading: true}).then(function(data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].id == $scope.smartTableData[i].id) {
            $scope.smartTableData[i].start_time = data[i].start_time;
            $scope.smartTableData[i].exit_status = data[i].exit_status;
            $scope.smartTableData[i].status = data[i].status;
          }
        }
      });
    });

    $scope.smartTablePageSize = 10;

    // $scope.editableTableData = $scope.smartTableData.slice(0, 36);

    $scope.refreshJobs = function () {
        console.log('refreshing...');
        res.reset('jobs');
        res.reset('jobsdetailed');

        res.get('jobs').then(function(data) {
          $scope.smartTableData = data;
          toastr.info('There are ' + data.length + ' jobs.', 'Jobs loaded');
          res.get('jobsdetailed', {}, {noLoading: true}).then(function(data) {
            for (var i = 0; i < data.length; i++) {
              if (data[i].id == $scope.smartTableData[i].id) {
                $scope.smartTableData[i].start_time = data[i].start_time;
                $scope.smartTableData[i].exit_status = data[i].exit_status;
                $scope.smartTableData[i].status = data[i].status;
              }
            }
          });
        });
    }
  }

})();
