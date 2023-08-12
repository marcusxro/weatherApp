const apiKey = 'c40063e5acce0c711af35da046cf11c9'
const inputs = document.querySelector('input')
var map = L.map('map')
let marker; 

const wordSearch = (word) => fetch(`https://api.openweathermap.org/data/2.5/weather?q=${word}&appid=${apiKey}`)
.then(response => {
    if(!response.ok) throw new Error ('cannot access')
    return response.json()
}).then(data => {
    ///location variables
    const latitude = data.coord.lat
    const longitude = data.coord.lon
    const cityName = data.name
    const country = data.sys.country
    //temp variables
    const temp = data.main.temp
    const tempMax = data.main.temp_max
    const tempMin = data.main.temp_min
    const pressure = data.main.pressure

    const humid = data.main.humidity
    const weather = data.weather[0].main
    const weatherDesc = data.weather[0].description
    const windDeg = data.wind.deg
    const windSpeed = data.wind.speed


    /////tempMax & min convertion
        ////kelvin converted to celcius
        function toMax(temps) {
            const temperature = temps - 273.15;
             return temperature
         }
         const finalizedTempMax = toMax(tempMax).toFixed(2) + "°"
         function toMin(temps) {
            const temperature = temps - 273.15;
            return temperature
         }
         function toinHg(press) {
            const pressure = press / 33.8639
            return pressure
         }
         const finalizedPress = toinHg(pressure).toFixed(0)


         console.log(finalizedPress)
         const finalizedTempMin = toMin(tempMin).toFixed(2) + "°"

    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ["Element", "temperature", { role: "style" } ],
        ["currentTemp", parseFloat(finalizedTemp), "#91C8E4"],
        ["pressure (inHg)", parseFloat(finalizedPress), "#91C8E4"],
        ["temp_max", parseFloat(finalizedTempMax), "#91C8E4"],
        ["temp_min", parseFloat(finalizedTempMin), "#91C8E4"]
    ]);



    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
                    { calc: "stringify",
                        sourceColumn: 1,
                        type: "string",
                        role: "annotation" },
                    2]);

    var options = {
        title: "more weather info in " + cityName,
        width: "100%",
        height: "100%",
        bar: {groupWidth: "85%", strokeWidth: "100px"},
        legend: { position: "block" },
    };
    
    var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
    chart.draw(view, options);
    }

    ////kelvin converted to celcius
    function toCel(temps) {
       const temperature = temps - 273.15;
        return temperature
    }
    const finalizedTemp = toCel(temp).toFixed(0) + "°"


    /////meter/sec to mph
    function toMph(winds) {
        const speedPerHour = winds * 2.23694;
        return speedPerHour
    }
    const convertedMph = toMph(windSpeed)
    const finalizedMph = convertedMph.toFixed(2) + " mph"
    const finalizedHumid = humid + "%"

    if (humid >= 0 && humid <= 30) {
        document.querySelector('.humidity').innerHTML = `Humidity: ${finalizedHumid}: (dry)`
    } else if (humid >= 31 && humid <= 60) {
        document.querySelector('.humidity').innerHTML = `Humidity: ${finalizedHumid}: (comfortable)`
    } else if (humid >= 61 && humid <= 80) {
        document.querySelector('.humidity').innerHTML = `Humidity: ${finalizedHumid}: (humid)`
    } else if (humid >= 81 && humid <= 100) {
        document.querySelector('.humidity').innerHTML = `Humidity: ${finalizedHumid}: (vey humid)`
    } else {
        console.log("Invalid humidity value");
    }
    
    ////DOM
    document.querySelector('.advice').innerHTML = weatherDesc
    document.querySelector('.temp').innerHTML = finalizedTemp
    document.querySelector('.place-info').innerHTML = `${cityName}, ${country}`
    document.querySelector('.weather-desc').innerHTML = weather 
    document.querySelector('.lat').innerHTML = `latitude: ${latitude}` 
    document.querySelector('.long').innerHTML = `longitude: ${longitude}` 
    document.querySelector('.windDeg').innerHTML = `wind Deg: ${windDeg}`
    document.querySelector('.windSpeed').innerHTML = `wind Speed: ${finalizedMph}`

    function toWhite() {
        gsap.to('.temp-col')
    }

    const backGround = document.querySelector('img')

    ////weather type img input
    if(weather === "Clouds") {
        console.log("cloudy")
        backGround.src = "/weather-type/cloudy.jpg"
    }else if (weather === "Drizzle"){
        console.log("drizzle")
        backGround.src = "/weather-type/drizzle.jpg"
    }else if (weather === "Rain"){
        console.log("rain")
        backGround.src = "/weather-type/rain.jpg"
    }else if (weather === "Thunderstorm"){
        console.log("Thunderstorm")
        backGround.src = "/weather-type/thunderstorm.jpg"
    }else if (weather === "Snow") {
        console.log("snow")
        backGround.src = "/weather-type/snow.jpg"
    }else if (weather === "Mist") {
        console.log("Mist")
        backGround.src = "/weather-type/mist.jpg"
    }else if (weather === "Clear") {
        console.log("Clear")
        backGround.src = "/weather-type/clear.jpg"
    }


    //////map

    function mapSet(lat, long) {
        if(marker) {
            map.removeLayer(marker)
        }
        map.setView([lat, long], 13);
        marker = L.marker([lat,long]).addTo(map)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map)
    }


    mapSet(latitude, longitude)


const sunriseTimestamp = data.sys.sunrise;
const sunsetTimestamp = data.sys.sunset;

// Convert sunrise timestamp to a Date object
const sunriseDate = new Date(sunriseTimestamp * 1000);
document.querySelector('.sunrise').innerHTML = `'Sunrise:', ${sunriseDate}`

// Convert sunset timestamp to a Date object
const sunsetDate = new Date(sunsetTimestamp * 1000);
document.querySelector('.sunset').innerHTML = `'sunset:', ${sunsetDate}`


}).catch(err =>{
    console.log(err)
})

wordSearch("london")

function searchWord(word) {
wordSearch(word)
}

document.querySelector('form').onsubmit = (e) => {
    e.preventDefault()
    if(inputs.value) {
        searchWord(inputs.value) 
        statistics(inputs.value, apiKeyz);
        inputs.placeholder = "search a place"
     }else {
        return inputs.placeholder = "please enter something"
     }
    inputs.value = ''

}

