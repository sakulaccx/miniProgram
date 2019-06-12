var dataAxis = [1559664000, 1559750400, 1559836800, 1559923200, 1560009600, 1560096000, 1560182400, 1560268800, 1560355200, 1560441600, 1560528000];
var data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 313];
var yMax = 500;
var dataShadow = [];
var weekdays = ['周日','周一','周二','周三','周四','周五','周六']

for (var i = 0; i < data.length; i++) {
    dataShadow.push(yMax);
}

option = {
    xAxis: {
        data: dataAxis,
        axisLabel: {
            inside: false,
            textStyle: {
                color: '#42434D'
            },
            formatter: function(value, index){
                var currdate = new Date();
                var timestrip = new Date(currdate.getFullYear(), currdate.getMonth(), currdate.getDate()).getTime()/1000;
                var date = new Date(value*1000);
                var month = date.getMonth()+1;
                var day = date.getDate();
                var weekday = weekdays[date.getDay()];
                var dateStr = month+"月"+day+"日";
                if(timestrip == value){
                    return [
                        '{a|'+dateStr+'}',
                        '{b|'+weekday+'}'
                    ].join("\n");
                } else {
                    return [
                        '{c|'+dateStr+'}',
                        '{d|'+weekday+'}'
                    ].join("\n");
                }
                
            },
            rich: {
                a: {
                    fontSize: 11,
                    color: '#EC624C'
                },
                b: {
                    fontSize: 12,
                    lineHeight: 20,
                    color: '#EC624C'
                },
                c: {
                    fontSize: 11
                },
                d: {
                    fontSize: 12,
                    lineHeight: 20
                }
            }
        },
        axisTick: {
            show: false
        },
        axisLine: {
            show: false
        },
        z: 10
    },
    yAxis: {
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            textStyle: {
                color: '#999'
            }
        }
    },
    dataZoom: [
        {
            type: 'inside',
            xAxisIndex: [0],
            start: 25,
            end: 85        }
    ],
    series: [
        { // For shadow
            type: 'bar',
            itemStyle: {
                normal: {color: '#F8F9FC'}
            },
            barGap:'-100%',
            barCategoryGap:'40%',
            data: dataShadow,
            animation: false
        },
        {
            type: 'bar',
            label: {
                show: true,
                position: 'top',
                formatter: function(params){
                    var date = new Date();
                    var timestrip = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()/1000;
                    return (timestrip==dataAxis[params.dataIndex]) ? '{a|¥'+params.value+'}' : '{b|¥'+params.value+'}';
                },
                rich: {
                    a: {
                        color: "#EB5B3E"
                    },
                    b: {
                        color: "#42434D"
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: function (params){
                        var date = new Date();
                        var timestrip = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()/1000;
                        return (timestrip==dataAxis[params.dataIndex]) ? 'rgb(58, 111, 246)' : 'rgb(229, 239, 251)';
                    }
                }
            },
            emphasis: {
                label: {
                    show: true,
                    position: 'top',
                    formatter: '¥{c}',
                    color: "#42434D"
                },
                itemStyle: {
                    color: function (params){
                        var date = new Date();
                        var timestrip = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()/1000;
                        return (timestrip==dataAxis[params.dataIndex]) ? 'rgb(58, 111, 246)' : 'rgb(229, 239, 251)';
                    }
                }
            },
            data: data
        }
    ]
};

// Enable data zoom when user click bar.
var zoomSize = 6;
myChart.on('click', function (params) {
    console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
    // myChart.dispatchAction({
    //     type: 'dataZoom',
    //     startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
    //     endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
    // });
});