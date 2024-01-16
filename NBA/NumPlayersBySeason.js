const composedUri = "http://192.168.160.58/NBA/api/Statistics/NumPlayersBySeason";

$('document').ready(function () {
    const ctx = document.getElementById('myChart');

    ajaxHelper(composedUri, 'GET').done(function (stats) {
        // Interact with the data returned
        var myLabels = [];
        var myData = [];
        $.each(stats, function (index, item) {
            myLabels.push(item.SeasonType + '    ' + item.Season);
            myData.push(item.Players);
        })


        // Instantiate and draw our chart, passing in some options.
        new Chart(ctx, {
            type: 'bar',
            title: 'olá',
            data: {
                labels: myLabels,
                datasets: [{
                    label: 'Num of Players',
                    data: myData,
                    borderWidth: 1,
                    backgroundColor: ["rgb(252,3,3)", "rgb(3,15,252)"]
                }]
            },
            options: {
                responsive: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: { align: 'start', font: { family: 'Open Sans' } },
                        title: {
                            display: true, text: ['STATS', 'Number of Players By Season'], padding: { top: 10, bottom: 10 }, font: { size: 12, family: 'Open Sans' }
                        },
                    }
                },
                indexAxis: 'y',
                scales: {
                    x: {
                        ticks: {
                            font: { family: 'Open Sans', color: '#800' } ,
                        }
                    },
                    y: {
                        beginAtZero: true, 
                        ticks: {
                            font: { family: 'Open Sans', color: '#800', size: 8, width: 200 } ,
                        }
                    }
                }
            }
        });
    });
});

//--- Internal functions
function ajaxHelper(uri, method, data) {
    return $.ajax({
        type: method,
        url: uri,
        dataType: 'json',
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : null,
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("AJAX Call[" + uri + "] Fail...");
        }
    });
}