var votingData = {
    alde: {
        name: "ALDE/ADLE",
        image: {
            src: "alde-adle.png",
            width: 26,
            height: 23
        },
        data: [14, 7, 43]
    },
    acr: {
        name: "ACR",
        image: {
            src: "acr.png",
            width: 22,
            height: 22
        },
        data: [31, 6, 31]
    },
    efdd: {
        name: "EFDD",
        image: {
            src: "efdd.png",
            width: 23,
            height: 22
        },
        data: [2, 4, 34]
    },
    enf: {
        name: "ENF",
        image: {
            src: "enf.png",
            width: 28,
            height: 12
        },
        data: [16, 0, 16]
    },
    epp: {
        name: "EPP",
        image: {
            src: "epp.png",
            width: 44,
            height: 21
        },
        data: [16, 3, 11]
    },
    greens: {
        name: "Greens/EFA",
        image: {
            src: "green-efa.png",
            width: 41,
            height: 24
        },
        data: [10, 0, 40]
    },
    gue: {
        name: "GUE/NGL",
        image: {
            src: "gue-ngl.png",
            width: 32,
            height: 23
        },
        data: [3, 8, 36]
    },
    sad: {
        name: "S&D",
        image: {
            src: "s_and_d.png",
            width: 25,
            height: 25
        },
        data: [93, 3, 78]
    }
};

var sliderNews;
var isSliderNewsAnimation;
var sliderTeam;

window.addEventListener("load", function(){
    window.cookieconsent.initialise({
        "palette": {
            "popup": {
                "background": "#edeff5",
                "text": "#838391"
            },
            "button": {
                "background": "#4b81e8"
            }
        },
        "content": {
            "message": "Webové stránky používají k poskytování služeb, personalizaci reklam a analýze návštěvnosti soubory cookie. Informace, jak tyto stránky používáte, sdílíme se svými partnery pro sociální média, inzerci a analýzy. Pro více informací o nastavení cookies najdete",
            "dismiss": "Rozumím",
            "link": "zde"
        }
    });
});

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;

}
function sumData(parties, row) {
    var total = 0;
    for (var d in parties) {
        total += parties[d].data[row];
    }
    return total;

}

function preloadImages(path) {
    var images = [];
    images["1x"] = new Image();
    images["2x"] = new Image();
    images["1x"].src = path;
    images["2x"].src = path.replace(/.png/gi, "@2x.png");
}

function renderPieChart() {
    var pieChartSumCanvas = $("#pieChartSum");
    var pieChartSumData = {
        labels: ["Pro", "Proti", "Zdržel se"],

        datasets: [{
            data: [sumData(votingData, 0), sumData(votingData, 2), sumData(votingData, 1)],
            backgroundColor: [
                "#000000",
                "#ffffff",
                "#676767",
            ],
            hoverBackgroundColor: [
                "#000000",
                "#ffffff",
                "#676767",
            ],
            borderWidth: [0, 0, 0],
            hoverBorderWidth: [0, 0, 0]
        }],
    };
    var pieChartSumOptions = {
        rotation: -0.44 * Math.PI,
        legend: {
            display: false
        },
        tooltips: {
            //enabled: false
        },
        responsive: true,
        plugins: {
            labels: {
                render: "percentage",
                fontSize: 23,
                showZero: true,
                fontStyle: "normal",
                fontFamily: "'Roboto', sans-serif",
                fontColor: function (data) {
                    var rgb = hexToRgb(data.dataset.backgroundColor[data.index]);
                    var threshold = 140;
                    var luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
                    return luminance > threshold ? "#000000" : "#ffffff";
                },
                position: "border",
            },
            datalabels: {
                display: false
            }
        }
    };
    pieChartSumCanvas.ready(function () {
        /* global Chart */
        /* jshint unused: false */
        var pieChartSum = new Chart(pieChartSumCanvas, {
            type: "pie",
            data: pieChartSumData,
            options: pieChartSumOptions
        });
    });
}

function renderBarChart() {
    var barChartPartiesCanvas = $("#barChartParties");
    function getDataArrayByRow(parties, row) {
        var dataArray = [];
        for (var d in parties) {
            dataArray.push(votingData[d].data[row]);
        }
        return dataArray;
    }
    function getPartiesName(parties) {
        var names = [];
        for (var d in parties) {
            names.push(parties[d].name);
        }
        return names;
    }
    var barChartPartiesData = {
        labels: getPartiesName(votingData),
        datasets: [{
            label: "Pro",
            backgroundColor: "#000000",
            hoverBackgroundColor: "#000000",
            data: getDataArrayByRow(votingData, 0)
        }, {
            label: "Zdržel se",
            backgroundColor: "#676767",
            hoverBackgroundColor: "#676767",
            data: getDataArrayByRow(votingData, 1)
        }, {
            label: "Proti",
            backgroundColor: "#ffffff",
            hoverBackgroundColor: "#ffffff",
            data: getDataArrayByRow(votingData, 2)
        }]
    };
    var barChartPartiesOptions = {
        legend: {
            display: false
        },
        layout: {
            padding: 0,
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                stacked: true,
                display: false,
                barPercentage: 0
            }],
            yAxes: [{
                stacked: true,
                display: false,
                barThickness : 30,
                gridLines: {
                    offsetGridLines: false
                }
            }]
        },
        plugins: {
            labels: {
            },
            datalabels: {
                display: function(context) {
                    return context.dataset.data[context.dataIndex] > 3;
                },
                color: function(context) {
                    var rgb = hexToRgb(barChartPartiesData.datasets[context.datasetIndex].backgroundColor);
                    var threshold = 140;
                    var luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
                    return luminance > threshold ? "#000000" : "#ffffff";
                },
                anchor: function(context) {
                    if (context.datasetIndex === 0) {
                        return "start";
                    }
                    else if (context.datasetIndex === 2) {
                        return "end";
                    } else {
                        return "center";
                    }
                },
                align: function(context) {
                    if (context.datasetIndex === 0) {
                        return "right";
                    }
                    else if (context.datasetIndex === 2) {
                        return "left";
                    } else {
                        return "center";
                    }
                },
                font: {
                    family: "'Roboto', sans-serif",
                },
                formatter: Math.round
            }
        }
    };
    barChartPartiesCanvas.ready(function () {
        /* jshint unused: false */
        var barChartParties = new Chart(barChartPartiesCanvas, {
            type: "horizontalBar",
            data: barChartPartiesData,
            options: barChartPartiesOptions
        });
    });

    var barChartPartiesLegend = $("#barChartPartiesLegend");
    barChartPartiesLegend.ready(function () {
        var time = 0;
        var animation = function (time) {
            setTimeout( function () {
                barChartPartiesLegend.find(".barchart__legend__item").eq(time).addClass("barchart__legend__item--show");
            }, time * 50);
        };
        for (var d in votingData) {
            barChartPartiesLegend.append(
                '<div class="barchart__legend__item">' +
                '<span class="barchart__legend__item__name">' + votingData[d].name + '</span>' +
                '<img class="barchart__legend__item__image" src="./assets/images/app/parties/' + votingData[d].image.src + '" srcset="./assets/images/app/parties/' + votingData[d].image.src + ', ./assets/images/app/parties/' + votingData[d].image.src.replace(/.png/gi, "@2x.png 2x") + '" alt="' + votingData[d].name + '" style="width: ' + votingData[d].image.width + 'px; height: ' + votingData[d].image.height + 'px;" >' +
                '</div>'
            );
            animation(time);
            time++;
        }
    });
}

function getSliderNewsSetting(width, min, max) {
    return {
        auto: true,
        pager: false,
        caption: false,
        prevText: "",
        nextText: "",
        speed: 1000,
        pause: 10000,
        responsive: true,
        infiniteLoop: true,
        hideControlOnEnd: true,
        useCSS: false,
        onSlideAfter: function () {
            isSliderNewsAnimation = false;
        },
        minSlides: min,
        maxSlides: max,
        slideWidth: width
    };
}

function getSliderTeamSetting(width) {
    return {
        auto: true,
        caption: false,
        prevText: "",
        nextText: "",
        speed: 500,
        pause: 15000,
        responsive: true,
        infiniteLoop: false,
        hideControlOnEnd: true,
        useCSS: false,
        minSlides: 1,
        maxSlides: 1,
        slideWidth: width,
        pagerCustom: "#pagerTeam",
    };
}

$(document).ready(function () {
    for (var i in votingData) {
        preloadImages("./assets/images/app/parties/" + votingData[i].image.src);
    }
    $("#votingResults").waypoint({
        handler: function () {
            renderPieChart();
            renderBarChart();
            this.destroy();
        },
        offset: "90%",
    });

    var elSliderNews = $("#sliderNews");
    isSliderNewsAnimation = false;
    if ($(window).width() <= 480) {
        elSliderNews.ready(function () {
            sliderNews = elSliderNews.bxSlider(getSliderNewsSetting(248, 1, 1));
        });
    }
    else if ($(window).width() <= 640) {
        elSliderNews.ready(function () {
            sliderNews = elSliderNews.bxSlider(getSliderNewsSetting(376, 1, 1));
        });
    }
    else if ($(window).width() <= 960) {
        elSliderNews.ready(function () {
            sliderNews = elSliderNews.bxSlider(getSliderNewsSetting(504, 1, 1));
        });
    }
    else if ($(window).width() <= 1050) {
        elSliderNews.ready(function () {
            sliderNews = elSliderNews.bxSlider(getSliderNewsSetting(380, 1, 2));
        });
    }
    else {
        elSliderNews.ready(function () {
            sliderNews = elSliderNews.bxSlider(getSliderNewsSetting(400, 1, 2));
        });
    }

    elSliderNews.ready(function () {
        $("#sliderNewsPrev").click(function () {
            if (!isSliderNewsAnimation) {
                isSliderNewsAnimation = true;
                sliderNews.goToPrevSlide();
                sliderNews.stopAuto();
                sliderNews.startAuto();
            }
        });

        $("#sliderNewsNext").click(function () {
            if (!isSliderNewsAnimation) {
                isSliderNewsAnimation = true;
                sliderNews.goToNextSlide();
                sliderNews.stopAuto();
                sliderNews.startAuto();
            }
        });
    });

    var elSliderTeam = $("#sliderTeam");
    elSliderTeam.ready(function () {
        sliderTeam = elSliderTeam.bxSlider(getSliderTeamSetting(1000));
        $(".team-pager__person").click(function () {
            sliderTeam.stopAuto();
        });
    });
});

$(window).on("load", function () {
});

$(window).on("orientationchange resize", function () {
    var elSliderNews = $("#sliderNews");
    if (elSliderNews.length && $(window).width() <= 480) {
        sliderNews.reloadSlider(getSliderNewsSetting(248, 1, 1));
        sliderTeam.reloadSlider(getSliderTeamSetting(310));
    }
    else if (elSliderNews.length && $(window).width() <= 640) {
        sliderNews.reloadSlider(getSliderNewsSetting(376, 1, 1));
        sliderTeam.reloadSlider(getSliderTeamSetting(470));
    }
    else if (elSliderNews.length && $(window).width() <= 960) {
        sliderNews.reloadSlider(getSliderNewsSetting(504, 1, 1));
        sliderTeam.reloadSlider(getSliderTeamSetting(630));
    }
    else if (elSliderNews.length && $(window).width() <= 1050) {
        sliderNews.reloadSlider(getSliderNewsSetting(380, 1, 2));
        sliderTeam.reloadSlider(getSliderTeamSetting(950));
    }
    else if (elSliderNews.length) {
        sliderNews.reloadSlider(getSliderNewsSetting(400, 1, 2));
        sliderTeam.reloadSlider(getSliderTeamSetting(1000));
    }
});