(function () {
	'use strict';
	var selectedBenchmark;
	var charts = {};
	var cache = {};

	var sizeSortedType = 'Size';
	var fpsSortedType = 'FPS';

	function sortFunction(sortType) {
		return function (a, b) {
			return b[selectedBenchmark + sortType] - a[selectedBenchmark + sortType];
		};
	}

	function getSortedData(sortType) {
		var sortFunc = sortFunction(sortType);
		return data.sort(sortFunc);
	}

	function getCategories(sortType) {
		var key = sortType + 'Categories' + selectedBenchmark;
		if (!(key in cache)) {
			var sortedData = getSortedData(sortType);
			var categories = [];
			var i, length = sortedData.length;
			for (i = 0; i < length; i++) {
				categories.push(sortedData[i].Title);
			}
			cache[key] = categories;
		}
		return cache[key];
	}

	function getValues(sortType) {
		var key = sortType + 'Points' + selectedBenchmark;
		if (!(key in cache)) {
			var sortedData = getSortedData(sortType);
			var result = [];
			var i, length = sortedData.length, key2 = selectedBenchmark + sortType;
			for (i = 0; i < length; i++) {
				result.push([i, sortedData[i][key2]]);
			}
			cache[key] = result;
		}
		return cache[key];
	}

	function updateBenchmark() {
		selectedBenchmark = $('#benchmark').val();
		$('#resolution').text(benchmarks[selectedBenchmark].Resolution);
		$('#duration').text(benchmarks[selectedBenchmark].Length);
		$('#fps').text(benchmarks[selectedBenchmark].FPS);
		$('#uncompressed').text(Math.round(benchmarks[selectedBenchmark].RawSize / 1024 * 100) / 100);
		$('#sampleImage').attr('src', 'img/samples/' + selectedBenchmark + '.jpg');
		$('ul#frameLinks > li > a').each(function () {
			$(this).attr('href', 'img/frames/' + selectedBenchmark + '/' + this.title + '.png');
		});
	}

	function onMouseOver(e) {
		var codecName = e.currentTarget.category;
		var i;
		for (i = 2; i; i--) {
			var chart = charts['chart' + i];
			var j, jLength = chart.series.length;
			for (j = 0; j < jLength; j++) {
				var series = chart.series[j].data;
				var k, kLength = series.length;
				for (k = 0; k < kLength; k++) {
					var point = series[k];
					var element = point.graphic.element;
					if (point.category !== codecName && element.getAttribute('fill')) {
						element.setAttribute('fill', '#C8C8C8');
					}
				}
			}
		}
	}

	function onMouseOut() {
		var i;
		for (i = 2; i; i--) {
			var chart = charts['chart' + i];
			var j, jLength = chart.series.length;
			for (j = 0; j < jLength; j++) {
				var series = chart.series[j];
				var seriesData = series.data;
				var k, kLength = seriesData.length;
				for (k = 0; k < kLength; k++) {
					var element = seriesData[k].graphic.element;
					if (element.getAttribute('fill')) {
						element.setAttribute('fill', series.color);
					}
				}
			}
		}
	}

	function benchmarkChanged() {
		//TODO: have the charts update themselves
		var tmp1 = getSortedData(fpsSortedType).slice();
		var tmp2 = getSortedData(sizeSortedType).slice();
		updateBenchmark();

		var fpsSortedData = getSortedData(fpsSortedType);
		var i, iLength = fpsSortedData.length;
		var seriesData = charts.chart1.series[0].data;
		var key = selectedBenchmark + fpsSortedType;
		for (i = 0; i < iLength; i++) {
			var item = fpsSortedData[i];
			var value = item[key];
			var j, jLength = tmp1.length;
			for (j = 0; j < jLength; j++) {
				if (tmp1[j].Title === item.Title) {
					seriesData[j].update([i, value], false, true);
					break;
				}
			}
		}
		charts.chart1.xAxis[0].setCategories(getCategories(fpsSortedType), true);

		var sizeSortedData = getSortedData(sizeSortedType);
		iLength = sizeSortedData.length;
		seriesData = charts.chart2.series[0].data;
		key = selectedBenchmark + sizeSortedType;
		for (i = 0; i < iLength; i++) {
			item = sizeSortedData[i];
			value = item[key];
			jLength = tmp2.length;
			for (j = 0; j < jLength; j++) {
				if (tmp2[j].Title === item.Title) {
					seriesData[j].update([i, value], false, true);
					break;
				}
			}
		}
		charts.chart2.xAxis[0].setCategories(getCategories(sizeSortedType), true);

		var series1Data = charts.chart3.series[0].data;
		var series2Data = charts.chart3.series[1].data;
		fpsSortedData = getSortedData(fpsSortedType); //TODO: remove the need to call this again.
		var rawSize = parseInt(benchmarks[selectedBenchmark].RawSize, 10);
		var key1 = selectedBenchmark + fpsSortedType;
		var key2 = selectedBenchmark + sizeSortedType;
		for (i = 0; i < iLength; i++) {
			jLength = tmp1.length;
			item = fpsSortedData[i];
			var value1 = item[key1];
			var value2 = item[key2];
			for (j = 0; j < jLength; j++) {
				if (tmp1[j].Title === item.Title) {
					series1Data[j].update([i, value1], false, true);
					series2Data[j].update([i, Math.round(rawSize / value2 * 10) / 10], false, true);
					break;
				}
			}
		}
		charts.chart3.xAxis[0].setCategories(getCategories(fpsSortedType), true);
	}

	function getRatio(sortType) {
		var sortedData = getSortedData(sortType);
		var result = [];
		var rawSize = parseInt(benchmarks[selectedBenchmark].RawSize, 10);
		var i, length = sortedData.length;
		for (i = 0; i < length; i++) {
			result.push([i, Math.round(rawSize / sortedData[i][selectedBenchmark + sizeSortedType] * 10) / 10]);
		}
		return result;
	}

	function getInternetExplorerVersion() {
		var rv = -1;
		if (navigator.appName === 'Microsoft Internet Explorer') {
			var ua = navigator.userAgent;
			var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) !== null) {
				rv = parseFloat(RegExp.$1);
			}
		}
		return rv;
	}

	function checkVersion() {
		var ver = getInternetExplorerVersion();
		if (ver > -1 && ver <= 8.0) {
			alert('Please upgrade to IE 9 or use a different browser (firefox, chrome, safari)');
		}
	}

	$(function () {
		$('#benchmark').change(benchmarkChanged);
		updateBenchmark();
		checkVersion() ;
		$('#infoButton').fancybox({
			'transitionIn': 'elastic',
			'transitionOut': 'none',
			'hideOnOverlayClick': true,
			'overlayShow': true,
			'overlayOpacity': 0.01
		});
		charts.chart1 = new Highcharts.Chart({
			chart: {
				renderTo: 'container1',
				defaultSeriesType: 'bar',
				backgroundColor: 'rgba(238, 238, 238, 0)',
				borderRadius: 0
			},
			title: {
				text: 'Video Encoding Speed'
			},
			subtitle: {
				text: '(Higher is better)'
			},
			xAxis: {
				categories: getCategories(fpsSortedType)
			},
			yAxis: {
				title: {
					text: 'Average frames per second'
				},
				gridLineColor: '#DDD'
			},
			tooltip: {
				enabled: false
			},
			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true
					}
				},
				series: {
					borderWidth: 0,
					point: {
						events: {
							mouseOver: onMouseOver,
							mouseOut: onMouseOut
						}
					}
				}
			},
			credits: {
				enabled: false
			},
			series: [{
				data: getValues(fpsSortedType),
				showInLegend: false
			}]
		});
		charts.chart2 = new Highcharts.Chart({
			chart: {
				renderTo: 'container2',
				defaultSeriesType: 'bar',
				backgroundColor: 'rgba(238, 238, 238, 0)',
				borderRadius: 0
			},
			title: {
				text: 'Encoded Video Size'
			},
			subtitle: {
				text: '(Lower is better)'
			},
			xAxis: {
				categories: getCategories(sizeSortedType)
			},
			yAxis: {
				title: {
					text: 'File size in MB'
				},
				gridLineColor: '#DDD'
			},
			tooltip: {
				enabled: false
			},
			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true
					}
				},
				series: {
					borderWidth: 0,
					color: '#AA4643',
					point: {
						events: {
							mouseOver: onMouseOver,
							mouseOut: onMouseOut
						}
					}
				}
			},
			credits: {
				enabled: false
			},
			series: [{
				data: getValues(sizeSortedType),
				showInLegend: false
			}]
		});
		charts.chart3 = new Highcharts.Chart({
			chart: {
				renderTo: 'container3',
				defaultSeriesType: 'column',
				backgroundColor: 'rgba(238, 238, 238, 0)',
				borderRadius: 0
			},
			title: {
				text: 'Speed vs. Compression Ratio'
			},
			subtitle: {
				text: '(Higher is better)'
			},
			xAxis: {
				categories: getCategories(fpsSortedType)
			},
			yAxis: [
			{
				title: {
					text: 'Frames per Second'
				},
				gridLineColor: "#DDD"
			},
			{
				title: {
					text: 'Compression Ratio'
				},
				opposite: true,
				gridLineColor: "#DDD"
			}],
			legend: {
				borderWidth: 0
			},
			tooltip: {
				enabled: false
			},
			plotOptions: {
				column: {
					dataLabels: {
						enabled: true
					}
				},
				series: {
					borderWidth: 0
				}
			},
			credits: {
				enabled: false
			},
			series: [{
				name: 'Frames per second',
				data: getValues(fpsSortedType),
				yAxis: 0
				},
				{
					name: 'Compression ratio',
					data: getRatio(fpsSortedType),
					yAxis: 1
				}]
		});
	});
}());
