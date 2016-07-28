var apiKey="c27e706a6fe348070d5fae30b1cb6fdff01a5fe2";

$(function(){
    var city=$("#city");
    
    

var request=$.ajax({url : "https://api.jcdecaux.com/vls/v1/contracts?apiKey="+apiKey},
                   {method : "GET" },
                   {accepts : 'application/json' });
//lorsque la requete est executée, ca execute .done

 request.done(function(result){
     //On cree un tableau contenant juste les noms des contrats
     var tableauContracts=new Array();
     var TableauVilles=new Array();
     //console.dir(result);
     for(var i in result)
     {
         //On filtre les resultats en fonction du country code
        if( result[i].country_code === 'FR')
        {
            tableauContracts.push(result[i].name);
        }
        tableauContracts.sort();
     }
     city.append('<option selected>Choisissez une ville</option>');
     //console.log(tableauContracts);
     for(var j in tableauContracts)
     {
         city.append('<option value="'+tableauContracts[j]+'">'+tableauContracts[j]+'</option>');
     
     }
 });
request.fail(function(fail){
        //console.dir(fail);
    });
});



$(function(){
    
var cities=$('#city');

var div=$('#data');

//console.log(request);

cities.on('change',function(){
    $('#info>p,#info>br').detach();
    var request=$.ajax({url : "https://api.jcdecaux.com/vls/v1/stations?contract="+cities[0].value+"&apiKey="+apiKey},
                   {method : "GET" },
                   {accepts : 'application/json' });

    var tabStation=new Array();
    
    request.done(function(data){
    //console.dir(cities);    
    for(var i in data)
    {
        tabStation.push(data[i]);
    }
    //console.dir(tabStation);
    div.append('<h1>Stations pour la ville: '+cities[0].value+'</h1>');
    for(var j in tabStation)
    {
        div.append('<p>Statut: '+(tabStation[j].status==="OPEN"? "Ouvert" : "Fermé")+'</p>');
        div.append('<p>Numero de la station: '+tabStation[j].number+'</p>');
        div.append('<p>Nom de la station: '+tabStation[j].name+'</p>');
        div.append('<p>Adresse: '+tabStation[j].address+'</p>');
        div.append('<p>Location par carte: '+(tabStation[j].banking? "Oui" : "Non")+'</p>');
        div.append('<p>Nombre de vélos dispos: '+tabStation[j].available_bikes+'</p>');
        div.append('<p>Nombre de points d\'attaches dispos: '+tabStation[j].available_bike_stands+'</p>');
        div.append('<p>Nombre total de points d\'attaches: '+tabStation[j].bike_stands+'</p>');
        div.append('<br/>');
        
        }
        initMap(tabStation);
    });
});
});
var map;
function initMap(tabStation) {
console.dir(tabStation);
    var googleKey="AIzaSyAh9i4u08CVKJTe72g7RR0-smW4CPmEohw";
    document.getElementById('map').style.display="block";

// Create a map object and specify the DOM element for display.
map = new google.maps.Map(document.getElementById('map'), {
center: {lat: tabStation[0].position.lat, lng: tabStation[0].position.lng},
scrollwheel: false,
zoom: 13
});
//////////////////////////////////////////////////////////////////////
/////////////////Geoloc but messing with centering the map on the city

/*var infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Vous êtes ici');
      
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
//////////////////////////////////////////////////////////////////////
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}
*/
/////////////////////////////////////////////////////////////////////
for(var i in tabStation)
{
    //console.dir(tabStation);
    var pos={lat: tabStation[i].position.lat, lng: tabStation[i].position.lng};
    
    var marker = new google.maps.Marker({
        position: pos,
        map: map,
         title: 'Nom de la station: '+tabStation[i].name+'\nNombre de stands: '+tabStation[i].bike_stands+'\nNombre de velos restants: '+
                 tabStation[i].available_bikes
    });
    var info=$('#info');
    //on passe a bind l'objet tabStation afin de pouvoir réecrire ses attributs
    //dans la fonction click
    marker.addListener('click', click.bind(null,tabStation[i])
    );
    var contenuInfoBulle='<p>Statut: '+(tabStation[i].status==="OPEN"? "Ouvert" : "Fermé")+'</p>\
                          <p>Nom de la station: '+tabStation[i].name+'</p>\
                          <p>Location par carte: '+(tabStation[i].banking? "Oui" : "Non")+'</p>\
                          <p>Nombre de vélos dispos: '+tabStation[i].available_bikes+'</p>\
                          <p>Nombre de points d\'attaches dispos: '+tabStation[i].available_bike_stands+'</p>\
                          <p>Nombre total de points d\'attaches: '+tabStation[i].bike_stands+'</p>\
                          <p>Adresse: '+tabStation[i].address+'</p>\
                          <p>Numero de la station: '+tabStation[i].number+'</p>';
    
    var infoBulle = new google.maps.InfoWindow({
	content: contenuInfoBulle
});
    
    google.maps.event.addListener(marker, 'click', function() {
	infoBulle.open(map, this);
});
}
}

function click(marker) {
       $('#info>p,#info>br').remove();
       var info=$('#info');
        info.append('<p>Statut: '+(marker.status==="OPEN"? "Ouvert" : "Fermé")+'</p>');
        info.append('<p>Numero de la station: '+marker.number+'</p>');
        info.append('<p>Nom de la station: '+marker.name+'</p>');
        info.append('<p>Adresse: '+marker.address+'</p>');
        info.append('<p>Location par carte: '+(marker.banking? "Oui" : "Non")+'</p>');
        info.append('<p>Nombre de vélos dispos: '+marker.available_bikes+'</p>');
        info.append('<p>Nombre de points d\'attaches dispos: '+marker.available_bike_stands+'</p>');
        info.append('<p>Nombre total de points d\'attaches: '+marker.bike_stands+'</p>');
        info.append('<br/>');
        
        ;
  }

