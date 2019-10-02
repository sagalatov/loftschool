import ymaps from 'ymaps';

import handleMapClick from './events/handleMapClick'

ymaps
  .load()
  .then(maps => {
    const map = new maps.Map('your-map-container', {
      center: [-8.369326, 115.166023],
      zoom: 7
    });
    map.events.add('click', handleMapClick(map));
  }),
  counter = 0,
  BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
    '<div class="mainContainer" id="form"><div class="headOfContainer"><button id="close"></button><p class="address">{{address}}</p></div><div class="bodyContainer"><div class="feedback"><p class="name">{{name}}<p><p class="namePlace">{{namePlase}}</p><p class="date">{{date}}</p><p class="textMessage">{{textMessage}}</p></div></div><div class="line"></div><div class="inputBlock"><p class="yourFeedback">Вашe имя</p><form name="test" method="post" action=""><input type="text" id="inputName" value="Ваше имя"><input type="text" id="inputPlace" value="Укажите место"><textarea name="comment" id="textareaMessage" placeholder="Поделитесь впечатлениями"></textarea></form></div><button id="submitButton">Добавить</button></div>', {
    build: function () {
      BalloonContentLayout.superclass.build.call(this);
      $('#close').bind('click', this.onCounterClick);
      $('#submitButton').bind('click', this.onSubmitClick);
    },
    clear: function () {
      $('#close').unbind('click', this.onCounterClick);
      BalloonContentLayout.superclass.clear.call(this);
    },
    onCounterClick: function () {
      map.balloon.close();
    },
    onSubmitClick: function () {
      let name = $('#inputName').val();
      let zone = $('#inputPlace').val();
      let message = $('#textareaMessage').val();

      $('p.name').text(name);
      $('p.namePlace').text(zone);
      $('p.textMessage').text(message);

      let date = new Date();
      let hours = date.getHours();
      let min = date.getMinutes();
      let seconds = date.getSeconds();

      let year = date.getFullYear();
      let mounth = date.getMonth();
      let day = date.getDay();

      let dateString = `${year}:${mounth}:${day} ${hours}:${min}:${seconds}`;

      $('p.date').text(dateString);

      $('p.address').text(addressString);
    }
  }).catch(error => console.log('Failed to load Yandex Maps', error));

var myClusterer = new ymaps.Clusterer({
  preset: 'twirl#invertedVioletClusterIcons'
});

map.geoObjects.add(myClusterer);

var addressString = " ";



