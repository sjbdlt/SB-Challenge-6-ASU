var srch = document.getElementById("btnsearch");
var forecastdiv = document.getElementById("forecastdiv");
var forecastdivrow = document.getElementById("forecastdivrow")
var histDiv = document.getElementById("citylist")
var lat = '';
var long = '';
var ctemp = '';
var cwind = '';
var chumd = '';
var imga = ''
var qrytext = '';
var tracker = 1

function search(){

    
    qrytext = $('#txtseachval').val();

    if (qrytext == ''){
        alert('Fill out what city you like weather on');
    }else{
        citysearchinfo('https://api.openweathermap.org/data/2.5/forecast?q=' + qrytext + '&appid=00ac68203f3c16735eccfc6f635f48c7&units=imperial');
    }

    
  
}

function citysearchinfo(requestUrl){


    fetch(requestUrl,{
        method: 'get',
        mode: 'cors'
    })
    .then(function (response) {
      console.log(response.status);
      if (response.status !== 200) {
        alert(response.status);
      } 
      return response.json();  
    })
    .then(function (data) {
        console.log(data);
        
        today = dayjs().format("MM/DD/YYYY")
        ctemp = data.list[0].main.temp + " \xB0F"
        cwind = data.list[0].wind.speed + " MPH"
        chumd = data.list[0].main.humidity + " %"
        var newimage = new Image(40,40)
        newimage.src = 'https://openweathermap.org/img/wn/' + data.list[0].weather[0].icon + '.png';
        newimage.crossOrigin = "anonymous"
        newimage.alt = ''

        $('#CityName').text(qrytext + "  (" + today + ")");
        document.getElementById('CityName').appendChild(newimage)
        $('#CityTemp').text(ctemp);
        $('#Citywind').text(cwind);
        $('#CityHumidity').text(chumd);
      
      
        lat = data.city.coord.lat;
        long = data.city.coord.lon;
        
        cityforecast('https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + long +'&appid=00ac68203f3c16735eccfc6f635f48c7&units=imperial');
   
      });

}

function cityforecast(requestUrl){
    fetch(requestUrl,{
        method: 'get',
        mode: 'cors'
    })
    .then(function (response) {
      console.log(response.status)
      if (response.status !== 200) {
        alert(response.status)
      } 
      return response.json();  
    })
    .then(function (data) {
        console.log(data)
        forecastdivrow.innerHTML = ""
        for (var i = 1; i < data.list.length; i++) {
            
            var carddiv1 = document.createElement('div');
            carddiv1.classList.add("col-lg-2");
            carddiv1.classList.add("col-md-6");
            carddiv1.classList.add("col-sm-12");
            carddiv1.id = "Col" + i
            carddiv1.style.backgroundColor = "lightslategray"
            carddiv1.style.padding = "2px"
            carddiv1.style.margin = "2px"
            carddiv1.style.border = "2px Solid"
            carddiv1.style.height = "200px"

            var tabl = document.createElement('table')
            tabl.style.width = "100%"
            tabl.style.height = "100%"
            var trdiv1 = document.createElement('tr')  
            trdiv1.style.color = "white"        
            var trdiv1a = document.createElement('tr')  
            trdiv1a.style.color = "white"      
            var trdiv2 = document.createElement('tr')
            trdiv2.style.color = "whitesmoke"
            var trdiv3 = document.createElement('tr')
            trdiv3.style.color = "whitesmoke"
            var trdiv4 = document.createElement('tr')
            trdiv4.style.color = "whitesmoke"

            var tddiv1 = document.createElement('td')
            var tddiv1a = document.createElement('td')
            var tddiv2 = document.createElement('td')
            var tddiv3 = document.createElement('td')
            var tddiv4 = document.createElement('td')
            var newimage = new Image(40,40)
            newimage.src = 'https://openweathermap.org/img/wn/' + data.list[i].weather[0].icon + '.png';
            newimage.crossOrigin = "anonymous"
            newimage.alt = ''

            today = dayjs(data.list[i].dt_txt).format("MM/DD/YYYY");
            
            ctemp = "Temp:" + data.list[i].main.temp + " \xB0F";
            cwind = "Wind:" + data.list[i].wind.speed + " MPH";
            chumd = "Humidity:" + data.list[i].main.humidity + " %";

            tddiv1.textContent =  today;
            tddiv1a.appendChild(newimage);
            tddiv2.textContent = ctemp;
            tddiv3.textContent = cwind;
            tddiv4.textContent = chumd;

            trdiv1.appendChild(tddiv1);
            trdiv1a.appendChild(tddiv1a);
            trdiv2.appendChild(tddiv2);
            trdiv3.appendChild(tddiv3);
            trdiv4.appendChild(tddiv4);
            
            tabl.appendChild(trdiv1);
            tabl.appendChild(trdiv1a);
            tabl.appendChild(trdiv2);
            tabl.appendChild(trdiv3);
            tabl.appendChild(trdiv4);

            carddiv1.appendChild(tabl);
            forecastdivrow.appendChild(carddiv1);             
            forecastdiv.appendChild(forecastdivrow);

            i = i + 8;
        }
        
          if (tracker == 1){
            savelookups();
          }
          
          tracker = 1;
    });
}

function savelookups(event){


    qrytext = $('#txtseachval').val();

    var search = { citysearched: qrytext}

    var currentsearch = localStorage.getItem('currentsearch');

    if (currentsearch) {
        currentsearch = JSON.parse(currentsearch);
    } else {
        currentsearch = [];
    }

    currentsearch.push(search);

    localStorage.setItem("currentsearch",  JSON.stringify(currentsearch));

    $('#txtseachval').val('');

    getsearches();


}

function getsearches(){
    histDiv.innerHTML = ""
   
    var currentsearch = localStorage.getItem('currentsearch');

    if (currentsearch) {
        currentsearch = JSON.parse(currentsearch);
    } else {
        currentsearch = [];
        return;
    }

    for (var i = 0; i < currentsearch.length; i+= 1){
    
        var btnlook = document.createElement('button'); 
        btnlook.style.width = "100%"
        btnlook.style.height = "30px"
        btnlook.style.backgroundColor = "grey"
        btnlook.innerText =  currentsearch[i].citysearched;
        btnlook.style.marginBottom = "5px"
        btnlook.classList = "Btn_look"
        btnlook.id = currentsearch[i].citysearched
        btnlook.addEventListener('click', searchhistory)
        histDiv.appendChild(btnlook);

    }
}

function init(){
    getsearches();
}

function searchhistory(){
    var city = $(this)[0].innerHTML;
    tracker = 0;
    $('#txtseachval').val(city);

    search();

}

init();

srch.addEventListener('click', search);

