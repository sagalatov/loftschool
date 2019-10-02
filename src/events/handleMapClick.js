export default (map) => (e) => {
  map.events.add('click', function (e) {

    var coordinates = e.get('coords');
    getAddress(coordinates);
    function getAddress(coordinates) {
      ymaps.geocode(coordinates).then(function (res) {
        var firstGeoObject = res.geoObjects.get(0);
        addressString = firstGeoObject.properties._data.text;
      });
    }
  
  
    var placemark = new ymaps.Placemark(coordinates, {
  
      address: 123,
    }, {
      balloonContentLayout: BalloonContentLayout,
      balloonPanelMaxMapArea: 0,
      balloonLayout: "default#imageWithContent",
      balloonImageHref: '',
      balloonAutoPan: true,
      balloonAutoPanMargin: [0, 1500, 1000, 1000],
    });
  
  
    map.geoObjects.add(placemark);
  
    myClusterer.add(placemark);
  
    placemark.balloon.open();
  
    if (placemark.balloon.open()) {
      console.log(addressString);
    }
  
  });
}