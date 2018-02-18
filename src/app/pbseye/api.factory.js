/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.tables')
      .factory('api', ApiFactory);

    /** @ngInject */
    function ApiFactory($q, $http, $log, $rootScope, toastr) {
        var api = {};

        // Base Url
        api.baseUrl = 'http://atlas-pbseye.roma2.infn.it';

        api.request = function (args) {
          // Continue
          args = args || {};
          var deferred = $q.defer();

          var url = api.baseUrl + args.url;
          var method = args.method || 'GET';
          var params = args.params || {};
          var data = args.data || {};
          var noLoading = args.noLoading || false;
          var handleError = angular.isDefined(args.handleError) ? args.handleError : true;

          if(!noLoading) {
              $rootScope.startLoading();
              deferred.promise.then($rootScope.endLoading, $rootScope.endLoading);
          }
          if (angular.isUndefined(args.url)) {
            deferred.reject();
            return deferred.promise;
          }
          $log.debug('[----API-----] request (' + method + ') - fire... ' + args.url);

          var stringa = [];
          for(var p in data)
            stringa.push(encodeURIComponent(p) + "=" + encodeURIComponent(data[p]));
          stringa = stringa.join("&");

          // Fire the request, as configured.
          var http_args = {
            url: url,
            method: method.toUpperCase(),
            params: params,
            data: stringa
          };

          if(method.toUpperCase() == 'POST' || method.toUpperCase() == 'PUT') {
            http_args['headers'] = {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }

          $http(http_args)
          .then(function (response) {
              $log.debug('[----API-----] request (' + method + ') - success ' + args.url, response);
              deferred.resolve(response.data);
            }, function (response) {
              $log.debug('[----API-----] request (' + method + ') - error ' + args.url, response);
              if (response.status === 0 || response.status === -1) {
                if (!response.data || response.data == '') {
                  response.data = {};
                  response.data.status = -2;
                  response.data.msg = 'No internet connection or no server response';
                }
              }
              if (angular.isUndefined(response.data.msg)) {
                response.data.msg = 'Server Error';
              }
              if (handleError || response.data.status == -2) {
                console.error(response.data.msg);
                toastr.error(response.data.msg, 'Error', {
                  "autoDismiss": false,
                  "positionClass": "toast-bottom-right",
                  "type": "error",
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
                })
              }
              deferred.reject(response);
          });
          return deferred.promise;
        },

        api.sign = function (username, password) {
          var vm = this;
          var deferred = $q.defer();
          vm.request({
            method: 'POST',
            url: '/sign',
            data: {
              mail: username,
              password: password
            }
          }).then(function (data) {
            vm.request({
              method: 'GET',
              url: '/sign',
              handleError: false
            }).then(function (data) {
              $log.debug('[----API-----] sign - success');
              deferred.resolve(data.data);
            });
          }, function () {
            $log.debug('[----API-----] sign - error');
            deferred.reject();
          });

          return deferred.promise;
        }

        api.filterObj = function (obj, keys) {
          var newobj = {};
          for (var i = 0; i < keys.length; i ++) {
              if(angular.isDefined(obj[keys[i]])) {
                  newobj[keys[i]] = obj[keys[i]];
              }
          }
          return newobj;
        }

        return api;
    }
})();
