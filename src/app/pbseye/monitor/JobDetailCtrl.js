/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pbseye.monitor')
      .controller('JobDetailCtrl', JobDetailCtrl);

  /** @ngInject */
  function JobDetailCtrl($scope, $filter, $stateParams, editableOptions, editableThemes, res, $uibModal) {
    var vm = this;
    vm.job = null;
    vm.jobDetail = null;
    vm.notfound = true;

    res.get('jobs').then(function(data) {
      for (var i=0; i<data.length; i++) {
        if (data[i].job_id.split('.')[0] == $stateParams.job_id) {
          vm.job = data[i];
        }
      }
      vm.notfound = vm.job == null;

      if(!vm.notfound) {
        res.get('job', {jobId: vm.job.id}).then(function(data) {
          vm.jobd = data;
        });
      }
    })

    vm.openFile = function (type) {
        vm.modalmsg = '';
        vm.modaltype = type;
        res.reset('stdstream', {type: type, jobId: vm.job.id});
        res.get('stdstream', {type: type, jobId: vm.job.id}).then(function (data) {
            vm.modalmsg = data;
            $uibModal.open({
                animation: true,
                templateUrl: 'app/pbseye/monitor/widgets/Modal.html',
                size: 'lg',
                controller: function ($scope, modalmsg, modaltype) {
                  $scope.modalmsg = modalmsg;
                  $scope.modaltype = modaltype;
                },
                resolve: {
                  modalmsg: function () {return vm.modalmsg;},
                  modaltype: function () {return vm.modaltype;},
                }
            });
        });
    }
  }

})();
