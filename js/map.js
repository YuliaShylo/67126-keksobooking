'use strict';

var ESC_KEY_CODE = 27;

var CHECKIN_CHECKOUT = [
  '12:00',
  '13:00',
  '14:00',
];

var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner',
];

var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
];

var COORDINATES = {
  left: 300,
  right: 900,
  top: 150,
  bottom: 500,
};

var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде',
];

var FAKE_DATA_NUMBER = 8;

var PIN_SIZE = 40;

var PIN_TAIL_SHIFT_X = (PIN_SIZE / 2);

var  PIN_TAIL_SHIFT_Y = (PIN_SIZE + 10);

var placeTypes = [
  'palace',
  'flat',
  'house',
  'bungalo',
];

var placeNames = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало',
};

var markupTemplate = document.querySelector('template').content;
var pinMarkupTemplate = markupTemplate.querySelector('.map__pin');
var cardMarkupTemplate = markupTemplate.querySelector('.map__card');
var mapPins = document.querySelector('.map__pins');
var map = document.querySelector('.map');
var mapFilters = document.querySelector('.map__filters-container');

var getRandomNumberFromInterval = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var getRandomArrayItem = function (array) {
  var index = getRandomNumberFromInterval(0, array.length - 1);
  return array[index];
};

var getRandomLenghtArray = function (array) {
  var firstArrayElement = getRandomNumberFromInterval(0, array.length - 1);
  var lastArrayElement = getRandomNumberFromInterval(0, array.length - 1);
  var arrayRandomLength = array.slice(firstArrayElement, lastArrayElement);
  return arrayRandomLength;
};

var getMixedArray = function () {
  return Math.floor(Math.random() - 0.5);
};

var generateData = function () {
  var array = [];
  for (var i = 0; i < FAKE_DATA_NUMBER; i++) {
    var x = getRandomNumberFromInterval(COORDINATES.left, COORDINATES.right);
    var y = getRandomNumberFromInterval(COORDINATES.top, COORDINATES.bottom);
    var obj = {
      author: {
        avatar: 'img/avatars/user' +
                ((i + 1 < 10) ? '0' : '') +
                (i + 1) +
                '.png',
      },
      offer: {
        title: getRandomArrayItem(TITLES),
        address: x + ', ' + y,
        price: getRandomNumberFromInterval(1000, 1000000),
        type: getRandomArrayItem(placeTypes),
        rooms: getRandomNumberFromInterval(1, 5),
        guests: getRandomNumberFromInterval(1, 3),
        checkin: getRandomArrayItem(CHECKIN_CHECKOUT),
        checkout: getRandomArrayItem(CHECKIN_CHECKOUT),
        features: getRandomLenghtArray(FEATURES),
        description: '',
        photos: PHOTOS.slice().sort(getMixedArray),
      },
      location: {
        x: x,
        y: y,
      },
    };
    array.push(obj);
  }
  return array;
};

var closeCard = function () {
  var openCard = document.querySelector('.map__card');
  if (openCard) {
    openCard.remove();
  }
};

var popupCloseKeydownHandler = function (evt) {
  if (evt.keyCode === ESC_KEY_CODE) {
    closeCard();
    document.removeEventListener('keydown', popupCloseKeydownHandler);
  }
};

var popupCloseClickHandler = function () {
  closeCard();
  document.removeEventListener('keydown', popupCloseKeydownHandler);
};

var createCardMarkup = function (dataObj) {
  var card = cardMarkupTemplate.cloneNode(true);

  card.querySelector('.popup__title').textContent = dataObj.offer.title;
  card.querySelector('.popup__text--address').textContent = dataObj.offer.address;
  card.querySelector('.popup__text--price').textContent = dataObj.offer.price + ' ₽/ночь';
  card.querySelector('.popup__type').textContent = placeNames[dataObj.offer.type];
  card.querySelector('.popup__text--capacity').textContent = dataObj.offer.rooms + ' комнаты для ' + dataObj.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + dataObj.offer.checkin + ', выезд до ' + dataObj.offer.checkout;

  var features = card.querySelector('.popup__features');
  var featuresItems = features.querySelectorAll('.popup__feature');

  for (var i = 0; i < featuresItems.length; i++) {
    for (var j = 0; j < dataObj.offer.features.length; j++) {
      var hasClass = featuresItems[i].classList.contains('popup__feature--' + dataObj.offer.features[i]
      );
      if (!hasClass) {
        featuresItems[i].remove();
      }
    }
  }

  card.querySelector('.popup__description').textContent = dataObj.offer.description;

  var photos = card.querySelector('.popup__photos');
  var photoTemplate = card.querySelector('.popup__photo');
  var fragmentForPhotos = document.createDocumentFragment();

  for (var k = 0; k < dataObj.offer.photos.length; k++) {
    var photo = photoTemplate.cloneNode(true);
    photo.src = dataObj.offer.photos[k];
    fragmentForPhotos.appendChild(photo);
  }

  photoTemplate.remove();
  photos.appendChild(fragmentForPhotos);
  card.querySelector('.popup__avatar').src = dataObj.author.avatar;

  document.addEventListener('keydown', popupCloseKeydownHandler);
  card.querySelector('.popup__close').addEventListener('click', popupCloseClickHandler);

  return card;
};

var generatePinMarkup = function (dataObj) {
  var pin = pinMarkupTemplate.cloneNode(true);
  var img = pin.querySelector('img');

  pin.style.left = dataObj.location.x + 'px';
  pin.style.top = dataObj.location.y + 'px';
  img.src = dataObj.author.avatar;
  img.alt = dataObj.offer.title;

  pin.addEventListener('click', function () {
    var card = createCardMarkup(dataObj);
    closeCard();
    map.insertBefore(card, mapFilters);
  });

  return pin;
};

// Код программы

var data = generateData();

var fragment = document.createDocumentFragment();

for (var i = 0; i < data.length; i++) {
  var pinMarkup = generatePinMarkup(data[i]);
  fragment.appendChild(pinMarkup);
}

// Добавим атрибут disabled инпутам в форме
var form = document.querySelector('.ad-form');

var fieldsets = form.querySelectorAll('fieldset');

for (var f = 0; f < fieldsets.length; f++) {
  fieldsets[f].disabled = true;
}

// найдем в форме инпут с адресом
var addressInput = document.getElementById('address');

// Рассчитаем положение метки
var addressCoords = {
  x: COORDINATES.left + PIN_TAIL_SHIFT_X,
  y: COORDINATES.top + PIN_TAIL_SHIFT_Y
};

// запишем значение атрибута в переменную
var addressInputValue = addressCoords.x + ', ' + addressCoords.y;

// Зададим полю адрес значения еще до обработчика mouseup
addressInput.value = addressInputValue;

// Добавим обработчик события mouseup

var mapPin = document.querySelector('.map__pin--main');

mapPin.addEventListener('mouseup', function () {
  map.classList.remove('map--faded');
  form.classList.remove('ad-form--disabled');
  mapPins.appendChild(fragment);
  for (var v = 0; v < fieldsets.length; v++) {
    fieldsets[v].disabled = false;
  }
  addressInput.value = addressInputValue;
});


// Модуль4, задание2

// найдем в форме заголовок и установим мин и макс длину, и обязательное поле

var title = document.getElementById('name');
// как проще найти нужный инпут?

title.required = true;
// валидатор ругается. Что не так?
title.min = 30;
//  как задать мин количество символов?
title.maxlength = 100;

// найдем в форме цену за ночь и установим необходимые атрибуты

var pricePerNight = document.getElementById('price');

pricePerNight.required = true;
pricePerNight.max = 1000000;

// установим для типа жилья минимальное значение цены
var minPrices = [
  '0',
  '1000',
  '5000',
  '10000',
];

// найдем в форме типы жилья
var types = document.getElementById('type');

// поменяем местами опции в разметке
form.insertBefore(types[2], types[1]);

// ограничим мин цену при вводе
for (var t = 0; t > types.length; t++) {
  for (var p = 0; p > minPrices.length; p++) {
    if (types[t]) {
      pricePerNight.min = minPrices[p];
      pricePerNight.placeholder = minPrices[p];

    }
  }
}
// что-то слишком горомоздко... и не работает

// запретим редактирование позиции метки
addressInput.readonly = true;
// не сработало

// синхронизируем время заезда и выезда

var timeIn = document.getElementById('timein');

var timeOut = document.getElementById('timeout');

for (var n = 0; n < timeIn.length; n++) {
  if (timeIn[n]) {
    timeOut[n].selected = true;
  }
}
// не сработало

// синхронизацию количества комнат и реализацию отправки формы еще не делала, хочу разробраться с ошибками что выше
