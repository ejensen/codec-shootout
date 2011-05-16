//TODO: refactor how data is updated/sorted/cached
var selectedBenchmark;
var charts = {};
var cache = {};

var fpsSortFunction = function (a, b) {
	return (b[selectedBenchmark + 'FPS'] - a[selectedBenchmark + 'FPS']);
};

var sizeSortFunction = function (a, b) {
	return (a[selectedBenchmark + 'Size'] - b[selectedBenchmark + 'Size']);
};

function getSortedData(sortFunction) {
	var result = (sortFunction === sizeSortFunction) ? cache['sizeSorted' + selectedBenchmark] : cache['fpsSorted' + selectedBenchmark]; //TODO: change
	if (!result) {
		var tmp = data.sort(sortFunction);
		result = tmp;
	}
	return result;
}

function getCategories(sortFunction) {
	var result = (sortFunction === sizeSortFunction) ? cache['sizeSortedCategories' + selectedBenchmark] : cache['fpsSortedCategories' + selectedBenchmark]; //TODO: change
	if (!result) {
		var sortedData = getSortedData(sortFunction);
		var tmp = [];
		var i, length = sortedData.length;
		for (i = 0; i < length; i++) {
			tmp.push(sortedData[i].Title);
		}
		result = tmp;
	}
	return result;
}

function getFPSValues(sortFunction) {
	var result = cache['fpsSortedPoints' + selectedBenchmark];
	if (!result) {
		var sortedData = getSortedData(sortFunction);
		result = [];
		var i, length = sortedData.length;
		for (i = 0; i < length; i++) {
			result.push([i, sortedData[i][selectedBenchmark + 'FPS']]);
		}
		cache['fpsSortedPoints' + selectedBenchmark] = result;
	}
	return result;
}

function getSizeValues(sortFunction) {
	var sortedData = getSortedData(sortFunction);
	var result = [];
	var i, length = sortedData.length;
	for (i = 0; i < length; i++) {
		result.push([i, sortedData[i][selectedBenchmark + 'Size']]);
	}
	return result;
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

var onMouseOver = function (e) {
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
};

var onMouseOut = function (e) {
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
				if(element.getAttribute('fill')){
					element.setAttribute('fill', series.color);
				}
			}
		}
	}
};

var benchmarkChanged = function () {
	//TODO: have the charts update themselves
	var tmp1 = getSortedData(fpsSortFunction).slice();
	var tmp2 = getSortedData(sizeSortFunction).slice();
	updateBenchmark();

	var fpsSortedData = getSortedData(fpsSortFunction);
	var i, iLength = fpsSortedData.length;
	var seriesData = charts.chart1.series[0].data;
	for (i = 0; i < iLength; i++) {
		var item = fpsSortedData[i];
		var j, jLength = tmp1.length;
		for (j = 0; j < jLength; j++) {
			if (tmp1[j].Title === item.Title) {
				seriesData[j].update([i, item[selectedBenchmark + 'FPS']], false, true);
				break;
			}
		}
	}
	charts.chart1.xAxis[0].setCategories(getCategories(fpsSortFunction), true);

	var sizeSortedData = getSortedData(sizeSortFunction);
	iLength = sizeSortedData.length;
	seriesData = charts.chart2.series[0].data;
	for (i = 0; i < iLength; i++) {
		var item = sizeSortedData[i];
		var j, jLength = tmp2.length;
		for (j = 0; j < jLength; j++) {
			if (tmp2[j].Title === item.Title) {
				seriesData[j].update([i, item[selectedBenchmark + 'Size']], false, true);
				break;
			}
		}
	}
	charts.chart2.xAxis[0].setCategories(getCategories(sizeSortFunction), true);

	var series1Data = charts.chart3.series[0].data;
	var series2Data = charts.chart3.series[1].data;
	var i;
	fpsSortedData = getSortedData(fpsSortFunction);
	var rawSize = parseInt(benchmarks[selectedBenchmark].RawSize, 10);
	for (i = 0; i < iLength; i++) {
		var j, jLength = tmp1.length;
		var item = fpsSortedData[i];
		for (j = 0; j < jLength; j++) {
			if (tmp1[j].Title === item.Title) {
				series1Data[j].update([i, item[selectedBenchmark + 'FPS']], false, true);
				series2Data[j].update([i, Math.round(rawSize / item[selectedBenchmark + 'Size'] * 10) / 10], false, true);
				break;
			}
		}
	}
	charts.chart3.xAxis[0].setCategories(getCategories(fpsSortFunction), true);
};

function getRatio(sortFunction) { //TODO: remove this
	var sortedData = getSortedData(sortFunction);
	var result = [];
	var rawSize = parseInt(benchmarks[selectedBenchmark].RawSize, 10);
	var i, length = sortedData.length;
	for (i = 0; i < length; i++) {
		result.push([i, Math.round(rawSize / sortedData[i][selectedBenchmark + 'Size'] * 10) / 10]);
	}
	return result;
}

function getInternetExplorerVersion() {
	var rv = -1; // Return value assumes failure.
	if (navigator.appName === 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null){
			rv = parseFloat(RegExp.$1);
		}
	 }
	 return rv;
}
function checkVersion() {
	var ver = getInternetExplorerVersion();
	if (ver > -1 && ver <= 8.0) {
		alert("You should upgrade to IE 9 or use a different browser (firefox, chrome, safari)");
	}
}

$(document).ready(function () {
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
			categories: getCategories(fpsSortFunction)
		},
		yAxis: {
			title: {
				text: "Average frames per second"
			},
			gridLineColor: "#DDD"
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
			data: getFPSValues(fpsSortFunction),
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
			categories: getCategories(sizeSortFunction)
		},
		yAxis: {
			title: {
				text: "File size in MB"
			},
			gridLineColor: "#DDD"
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
			data: getSizeValues(sizeSortFunction),
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
			categories: getCategories(fpsSortFunction)
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
			data: getFPSValues(fpsSortFunction),
			yAxis: 0
		},
			{
				name: 'Compression ratio',
				data: getRatio(fpsSortFunction),
				yAxis: 1
			}]
	});
});