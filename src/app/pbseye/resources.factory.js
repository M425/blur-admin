/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin')
      .factory('res', ResourcesFactory);

    /** @ngInject */
    function ResourcesFactory($q, $http, $log, $rootScope, api) {

        var vm = this;
        return {
            loadPromise: {},
            loadStatus: {},
            resources: {},

            reslist: {
              jobs: {
                target: '/jobs',
                onRetrieve: function (data) {
                  for (var i=0; i<data.length; i++){
                    data[i].id = data[i].job_id.split('.')[0];
                    if(data[i].status == 'C') {
                      if(data[i].exit_status != '0') {
                        data[i].status = 'X';
                      }
                    }
                  }
                  return data;
                }
              },
              job: {
                target: '/job/$jobId$',
                onRetrieve: function (data) {
                  data.Output_Path = data.Output_Path.split(':')[1];
                  data.Error_Path = data.Error_Path.split(':')[1];
                  return data;
                }
              },
              stdstream: {
                target: '/stdstream/$type$/$jobId$',
                onRetrieve: function (data) {
                  return data;
                }
              }
            },

            getResUrl: function (res, params) {
              var vm = this;
              if (angular.isUndefined(vm.reslist[res])) {
                $log.error('Resources -> undefined key: ' + res);
                return;
              }
              var mapped = angular.copy(vm.reslist[res].target);
              for (var k in params) {
                if (Object.prototype.hasOwnProperty.call(params, k)) {
                  mapped = mapped.replace('$' + k + '$', params[k]);
                }
              }
              return mapped;
            },

            hash: function (res, params) {
              var vm = this;
              var string = '';
              string += res ? res : 'nores';
              if (params) {
                for (var key in params) {
                  if (Object.prototype.hasOwnProperty.call(params, key)) {
                    string += '?' + key + '=' + params[key];
                  }
                }
              }
              return string;
            },

            load: function (res, params, extraargs) {
              var vm = this;
              var _extraargs = extraargs || {};

              var deferred = $q.defer();
              var hash = vm.hash(res, params);
              $log.debug('[----RES-----] <' + hash + '> load - fire');
              vm.loadPromise[hash] = deferred;
              vm.loadStatus[hash] = 1;
              if (vm.reslist[res].targetIsResouce) {
                $log.debug('[----RES-----] <' + hash + '> load - target is resource (' + vm.reslist[res].target + ')');
                vm.get(vm.reslist[res].target).then(function (data) {
                  if (vm.reslist[res].onRetrieve) {
                    data = vm.reslist[res].onRetrieve(data, params);
                  }
                  $log.debug('[----RES-----] <' + hash + '> load - success', data);
                  vm.resources[hash] = data;
                  vm.loadStatus[hash] = 2;
                  deferred.resolve(data);
                });
              } else {
                api.request(Object.assign(_extraargs, {
                  method: 'GET',
                  url: vm.getResUrl(res, params),
                  params: params
                })).then(function (data) {
                  data = data.data;
                  if (vm.reslist[res].onRetrieve) {
                    data = vm.reslist[res].onRetrieve(data, params);
                  }
                  $log.debug('[----RES-----] <' + hash + '> load - success', data);
                  vm.resources[hash] = data;
                  vm.loadStatus[hash] = 2;
                  deferred.resolve(data);
                }, function (data) {
                  $log.debug('[----RES-----] <' + hash + '> load - error', data);
                  vm.loadStatus[hash] = -1;
                  deferred.reject();
                });
              }
              return deferred.promise;
            },

            reset: function (res, params) {
              var vm = this;
              var hash = vm.hash(res, params);
              vm.loadStatus[hash] = 0;
              vm.loadPromise[hash] = null;
              vm.resources[hash] = null;
            },

            resetAll: function () {
              var vm = this;
              vm.loadStatus = {};
              vm.loadPromise = {};
              vm.resources = {};
            },

            get: function (res, params, extraargs) {
              var vm = this;
              var deferred = $q.defer();

              var hash = vm.hash(res, params);

              if (angular.isUndefined(vm.loadStatus[hash])) {
                vm.loadStatus[hash] = 0;
                vm.loadPromise[hash] = null;
                vm.resources[hash] = null;
              }

              if (vm.loadStatus[hash] === 2) {
                $log.debug('[----RES-----] <' + hash + '> get - READY');
                deferred.resolve(vm.resources[hash]);
              }

              if (vm.loadStatus[hash] === 1) {
                $log.debug('[----RES-----] <' + hash + '> get - LOADING');
                vm.loadPromise[hash].promise.then(function () {
                  deferred.resolve(vm.resources[hash]);
                }, function () {
                  deferred.resolve([]);
                });
              }

              if (vm.loadStatus[hash] === 0 || vm.loadStatus[hash] === -1) {
                $log.debug('[----RES-----] <' + hash + '> get - TO BE LOADED');
                vm.load(res, params, extraargs).then(function () {
                  deferred.resolve(vm.resources[hash]);
                }, function () {
                  deferred.reject();
                });
              }

              return deferred.promise;
            }
        }
    }
})();
