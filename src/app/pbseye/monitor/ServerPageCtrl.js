/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pbseye.monitor')
      .controller('ServerPageCtrl', ServerPageCtrl);

  /** @ngInject */
  function ServerPageCtrl($scope, $filter, $timeout, editableOptions, editableThemes, res, toastr, baUtil, baConfig) {

    res.get('serverinfo').then(function(data) {
        $scope.serverinfo = data;
        console.log(data);
        var pieColor = baUtil.hexToRGB(baConfig.colors.defaultText, 0.2);
        $scope.charts = [
            {
              color: pieColor,
              description: 'Localgroup',
              stats: data.localgroup.avail_t.toFixed(1) + ' / ' + data.localgroup.total_t.toFixed(0) + ' TB',
              icon: 'face',
              percent: (100.0 * data.localgroup.avail_t / data.localgroup.total_t).toFixed(0)
            },
            {
              color: pieColor,
              description: 'Worker Nodes',
              stats: data.workers.free + ' / ' + data.workers.total,
              icon: 'face',
              percent: (100.0 * parseFloat(data.workers.free) / parseFloat(data.workers.total)).toFixed(0)
            },
            {
              color: pieColor,
              description: 'Job Slots',
              stats: data.workers.freejobs + ' / ' + data.workers.totaljobs,
              icon: 'face',
              percent: (100.0 * parseFloat(data.workers.freejobs) / parseFloat(data.workers.totaljobs)).toFixed(0)
            },
            {
              color: pieColor,
              description: 'Running Jobs',
              stats: data.jobs.running,
              icon: 'face',
              percent: (100.0 * parseFloat(data.jobs.running) / parseFloat(data.workers.freejobs)).toFixed(0)
            },
            {
              color: pieColor,
              description: 'Queued Jobs',
              stats: data.jobs.queued,
              icon: 'face',
              percent: (100.0 * parseFloat(data.jobs.queued) / parseFloat(data.workers.freejobs)).toFixed(0)
            },
        ];
    })

    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    function loadPieCharts() {
      $('.chart').each(function () {
        var chart = $(this);
        chart.easyPieChart({
          easing: 'easeOutBounce',
          onStep: function (from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
          },
          barColor: chart.attr('rel'),
          trackColor: 'rgba(0,0,0,0)',
          size: 84,
          scaleLength: 0,
          animation: 2000,
          lineWidth: 9,
          lineCap: 'round',
        });
      });

      $('.refresh-data').on('click', function () {
        updatePieCharts();
      });
    }

    function updatePieCharts() {
      $('.pie-charts .chart').each(function(index, chart) {
        $(chart).data('easyPieChart').update(getRandomArbitrary(55, 90));
      });
    }

    $timeout(function () {
      loadPieCharts();
    }, 1000);
  }

})();
