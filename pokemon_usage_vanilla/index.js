// JavaScript source code
(function () {
    var cors_api_host = 'cors-anywhere.herokuapp.com';
    var cors_api_url = 'https://' + cors_api_host + '/';
    var slice = [].slice;
    var origin = window.location.protocol + '//' + window.location.host;
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        var args = slice.call(arguments);
        var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
        if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
            targetOrigin[1] !== cors_api_host) {
            args[1] = cors_api_url + args[1];
        }
        console.log(args)
        return open.apply(this, args);
    };
})();
var smogon=require("smogon-usage-fetch");
var CanvasJS=require("canvasjs.min.js")
const client = new smogon.SmogonApiClient()
/*
 * Timeframes
 
client
    .fetchTimeframes()
    .then((timeframes) => console.log("TIMEFRAMES", timeframes))
    .catch(console.error);
*/
/*
 * Formats

client
    .fetchFormats({ year: "2019", month: "01" })
    .then((formats) => console.log("FORMATS", formats))
    .catch(console.error);

client
    .fetchFormats({ year: "2019", month: "01" }, true)
    .then((formats) => console.log("FORMATS MONO", formats))
    .catch(console.error);
 */
/*
 * Usage

client
    .fetchUsages({ year: "2019", month: "01" }, { name: "gen7ou" })
    .then((usage) => console.log("USAGE", usage))
    .catch(console.error);

client
    .fetchUsages(
        { year: "2019", month: "01" },
        { name: "gen7monotype", rank: "0", monotype: "monowater" }
    )
    .then((usage) => console.log("USAGE MONOTYPE", usage))
    .catch(console.error);
     */
/*
 * Moveset / Chaos (contain the same data)
 */
window.addEventListener('load', () => {
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Pokemon usage rate"
        },
        axisX: {
            interval: 1,
            intervalType: "month",
            title:"Date"
        },
        axisY: {
            title: "Raw usage rate %",
            includeZero: true,
        },
        data: [{
            type: "line",
            indexLabelFontSize: 16,
            dataPoints: [
            ]
        }]
    });
    chart.render();
    var movesChart = new CanvasJS.Chart("movesChart", {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Pokemon moves usage rate"
        },
        axisX: {
            interval: 1,
            title: "Moves with >5% usage"
        },
        axisY: {
            title: "Raw usage rate %",
            includeZero: true,
        },
        data: [{
            type: "bar",
            indexLabelFontSize: 16,
            dataPoints: [
            ]
        }
        ]
    });
    movesChart.render()
    let dates = []
    let counter=0
    function fetchData() {
        counter += 1
        client
            .fetchMovesets({ year: "2021", month: `0${counter}` }, { name: "gen8ou" })
            .then((moveset) => {
                dates.push([counter, moveset])
                if (counter < 5) {
                    fetchData()
                }
                else {
                    console.log(dates)
                    document.getElementById("pokeball").style.display="none"
                    document.getElementById("pokemon").innerHTML=""
                    dates.slice(-1)[0][1].data.forEach((value, key) => {
                        if (dates.slice(-1)[0][1].data.get(key).usage > 0.02) {
                            let element = document.createElement('p')
                            element.id=key
                            element.innerHTML = `${key}`
                            element.style.border = "1px solid black"
                            element.style.margin = "0px"
                            element.className="pokemon"
                            element.onclick = () => {
                                document.getElementById("pokemonName").value=element.id
                            }
                            document.getElementById("pokemon").appendChild(element)
                        }
                    })
                }
            })
            .catch(console.error)
    }
    fetchData()
    function getPokemonData(pokemon, date) {
        let counter1=0
        dates.forEach((moveset_data) => {
            chart.data[0].addTo("dataPoints", { x: new Date(2021, moveset_data[0]-1), y: moveset_data[1].data.get(pokemon).usage * 100 })
            let moves = moveset_data[1].data.get(pokemon).moves
            if (date.getMonth() == counter1) {
                console.log("hello")
                moves.forEach((usage, move_name) => {
                    if (usage / moveset_data[1].data.get(pokemon).rawCount > 0.05) {
                        movesChart.data[0].addTo("dataPoints", { y: usage / moveset_data[1].data.get(pokemon).rawCount * 100, label: `${move_name}` })
                    }
                })
            }
            counter1 += 1
        })
    }
    function getPokemonMoveData(pokemon, date) {
        let counter2 = 0
        dates.forEach((moveset_data) => {
            let moves = moveset_data[1].data.get(pokemon).moves
            console.log(date.getMonth())
            console.log(counter2)
            if (date.getMonth()  == counter2) {
                console.log("hello")
                moves.forEach((usage, move_name) => {
                    console.log(`${move_name}: ${usage}`)
                    if (usage / moveset_data[1].data.get(pokemon).rawCount > 0.05) {
                        movesChart.data[0].addTo("dataPoints", { y: usage / moveset_data[1].data.get(pokemon).rawCount * 100, label: `${move_name}` })
                    }
                })
            }
            counter2 += 1
        })
    }
    document.getElementById("month").addEventListener("click", () => {
        if (dates[dates.length - 1][1].data.get(document.getElementById("pokemonName").value) != undefined) {
            let charts = document.getElementById("charts").children
            for (var i = 0; i < charts.length; i++) {
                if (charts[i].id != "pokeball") {
                    charts[i].style.display = "inline"
                }
            }
            movesChart = new CanvasJS.Chart("movesChart", {
                animationEnabled: true,
                theme: "light2",
                title: {
                    text: `${document.getElementById("pokemonName").value} moves usage rate (${ document.getElementById(document.getElementById("month").value).innerHTML })`
                },
                axisX: {
                    interval: 1,
                    title: "Moves with > 5 % usage"
                },
                axisY: {
                    title: "Raw usage rate %",
                    includeZero: true,
                },
                data: [{
                    type: "bar",
                    indexLabelFontSize: 16,
                    dataPoints: [
                    ]
                }
                ]
            });
            movesChart.render()
            getPokemonMoveData(document.getElementById("pokemonName").value, new Date("2021", `${document.getElementById("month").value}`))
        }
    })
    document.getElementById("getData").addEventListener("click", () => {
        if (dates[dates.length - 1][1].data.get(document.getElementById("pokemonName").value) != undefined) {
            let charts = document.getElementById("charts").children
            for (var i = 0; i < charts.length; i++) {
                if (charts[i].id != "pokeball") {
                    charts[i].style.display = "inline"
                }
            }
            chart = new CanvasJS.Chart("chartContainer", {
                animationEnabled: true,
                theme: "light2",
                title: {
                    text: `${document.getElementById("pokemonName").value} usage rate`
                },
                axisX: {
                    interval: 1,
                    intervalType: "month",
                    title: 'Date'
                },
                axisY: {
                    title: "Raw usage rate %",
                    includeZero: true,
                },
                data: [{
                    type: "line",
                    indexLabelFontSize: 16,
                    dataPoints: [
                    ]
                }]
            });
            chart.render();
            movesChart = new CanvasJS.Chart("movesChart", {
                animationEnabled: true,
                theme: "light2",
                title: {
                    text: `${document.getElementById("pokemonName").value} moves usage rate (${document.getElementById(document.getElementById("month").value).innerHTML})`
                },
                axisX: {
                    interval: 1,
                    title: "Moves with > 5 % usage"
                },
                axisY: {
                    title: "Raw usage rate %",
                    includeZero: true,
                },
                data: [{
                    type: "bar",
                    indexLabelFontSize: 16,
                    dataPoints: [
                    ]
                }
                ]
            });
            movesChart.render()
            getPokemonData(document.getElementById("pokemonName").value, new Date("2021", new Date().getMonth() - 1))
        }
    })
})
/*
 * Leads
 
client
    .fetchLeads({ year: "2019", month: "01" }, { name: "gen7ou" })
    .then((leads) => console.log("LEADS", leads))
    .catch(console.error);
*/
/*
 * Metagame
 
client
    .fetchMetagame({ year: "2019", month: "01" }, { name: "gen7ou" })
    .then((meta) => console.log("META", meta))
    .catch(console.error);
    */