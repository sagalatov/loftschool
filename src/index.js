ymaps.ready(init);

function init() {
  var map = new ymaps.Map('map', {
    center: [55.650625, 37.62708],
    zoom: 10
  }, {
    searchControlProvider: 'yandex#search'
  }),

    BalloonContentLayout = ymaps.templateLayoutFactory.createClass('<div class="mainContainer" id="form"><div class="headOfContainer"><button id="close"></button><p class="address">{{properties.address}}</p></div><div class="bodyContainer"></div><div class="line"></div><div class="inputBlock"><p class="yourFeedback">Вашe имя</p><form name="test" method="post" action=""><input type="text" id="inputName" value="Ваше имя"><input type="text" id="inputPlace" value="Укажите место"><textarea name="comment" id="textareaMessage" placeholder="Поделитесь впечатлениями"></textarea></form></div><button id="submitButton">Добавить</button></div>', {
      build: function () {
        BalloonContentLayout.superclass.build.call(this);
        $('#close').bind('click', this.onCounterClick);
        $('#submitButton').bind('click', this.onSubmitClick);
        checkIdInLocalStorage();
      },
      clear: function () {
        $('#close').unbind('click', this.onCounterClick);
        BalloonContentLayout.superclass.clear.call(this);

      },
      onCounterClick: function () {
        map.balloon.close();
      },
      onSubmitClick: function () {
        createMessage(idString)
      },

    });

  var count = 1;
  var idString;

  function checkIdInLocalStorage() {
    for (var i = 0, len = localStorage.length; i < len; ++i) {
      let returnObj = JSON.parse((localStorage.getItem(localStorage.key(i))));
      if (returnObj.id === idString) {
        let newNodes = createDomNodes(returnObj.value)
        newNodes.appendTo('.bodyContainer');
      }
    }
  }

  function createMessage() {

    if ($('#inputName').val() === "Ваше имя") {
      name = 'Аноним'
    } else {
      name = $('#inputName').val()
    }

    let zone = $('#inputPlace').val();

    if ($('#inputPlace').val() === "Укажите место") {
      zone = '';
    } else {
      zone = $('#inputPlace').val()
    }

    let message = $('#textareaMessage').val();
    let dateString = getDateString();

    let newComment = {};
    let htmlMessage = $('<div>', {
      "class": 'feedback',

      append: ($('<p>',
        {
          "class": 'name',
          text: name,
        }))
        .add($('<p>',
          {
            "class": 'namePlaсe',
            text: zone,
          }))
        .add($('<p>',
          {
            "class": 'date',
            text: dateString,
          }))
        .add($('<p>',
          {
            "class": 'textMessage',
            text: message,
          }))
    })




    htmlMessage.appendTo('.bodyContainer');

    let stringHtml = htmlMessage[0];
    newComment.value = stringHtml.outerHTML;
    newComment.id = idString;

    addToLocalStorage(count, newComment);

    count++

  }

  function getDateString() {
    let date = new Date();
    let hours = date.getHours();
    let min = date.getMinutes();
    let seconds = date.getSeconds();
    let year = date.getFullYear();
    let mounth = date.getMonth();
    let day = date.getDay();
    let dateString = `${year}:${mounth}:${day} ${hours}:${min}:${seconds}`;
    return dateString;
  }

  function getCoordinatePlacemark(coordinates) {
    stringCoordinates = coordinates;

    var stringCoordinates = stringCoordinates[0] + " " + stringCoordinates[1];

    stringCoordinates = stringCoordinates.replace(/[.\s]/g, '');

    idString = stringCoordinates;
  }

  function addToLocalStorage(key, value) {
    var serialObj = JSON.stringify(value)
    localStorage.setItem(key, serialObj);
  }

  function createDomNodes(htmlValue) {
    var domNodes = $($.parseHTML(htmlValue));
    return domNodes;
  }

  var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
    '<h2>{{properties.place|raw }}</h2>' +
    '<a>{{ properties.address|raw }}</a>' +
    '<p>{{ properties.message|raw }}</p>' +
    '<div class=ballon_footer>{{properties.date|raw }}</div>'
    , {
      build: function () {
        customItemContentLayout.superclass.build.call(this);
      }
    })

  var clusterer = new ymaps.Clusterer({
    preset: 'islands#invertedVioletClusterIcons',
    clusterDisableClickZoom: true,
    clusterOpenBalloonOnClick: true,
    clusterBalloonPanelMaxMapArea: 0,
    clusterBalloonContentLayout: 'cluster#balloonCarousel',
    clusterBalloonItemContentLayout: customItemContentLayout,
  })

  collection = new ymaps.GeoObjectCollection();

  map.events.add('click', function (e) {
    var coordinates = e.get('coords')
    var addressString;

    getCoordinatePlacemark(coordinates)

    var myGeocoder = ymaps.geocode(coordinates)
    myGeocoder.then(function (res) {
      var firstGeoObject = res.geoObjects.get(0);
      addressString = firstGeoObject.properties._data.text;
      return addressString
    }).then(function (addressString) {
      newPlaceMark(addressString)
    })


    function newPlaceMark() {

      var placemark = new ymaps.Placemark(coordinates, {
        place: "placeNsme",
        address: addressString,
        message: "messageString",
        date: getDateString(),


      }, {
        preset: 'islands#violetDotIcon',
        balloonContentLayout: BalloonContentLayout,
        balloonPanelMaxMapArea: 0,
        balloonLayout: "default#imageWithContent",
        balloonImageHref: '',
        balloonAutoPan: true,
        balloonAutoPanMargin: [0, 1500, 1000, 1000],
      });

      collection.add(placemark);
      map.geoObjects.add(clusterer)
      map.geoObjects.add(placemark);
      clusterer.add(placemark);
      placemark.balloon.open();

      placemark.events.add('click', function (e) {
        var coordinates = placemark.geometry._coordinates;
        getCoordinatePlacemark(coordinates);
      })

    }

  });

}