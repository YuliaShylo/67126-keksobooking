// Константы

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
}

var PIN_SIZE = 40;

var OBJECTS_QUANTITY = 8;

var plaseTypes = [
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

var x = getRandomNumberFromInterval(COORDINATES.left, COORDINATES.right);
var y = getRandomNumberFromInterval(COORDINATES.top, COORDINATES.bottom);

var getRandomNumberFromInterval = function(min, max) {
  var randomNumber = min + Math.random() * (max + 1 - min);
    randomNumber = Math.floor(randomNumber);
    return randomNumber;
};

var getRandomArrayItem = function(array) {
    var index = getRandomNumberFromInterval(0, array.length - 1);
    return array[index];
};

// функция сортировки элементов массива в случайном порядке
var getMixedArray = function (a, b, array) {
  var a = array[i];
  var b = array[i + 1];
  return Math.floor(Math.random() - 0.5);
}

// получаем случайную длину массива, для features
var getRandomLenghtArray = function(array) {
  var firstArrayElement = getRandomNumberFromInterval(0, array.length - 1)
  var lastArrayElement = getRandomNumberFromInterval(0, array.length - 1)
  var arrayRandomLength = array.slice(firstArrayElement, lastArrayElement);
  return arrayRandomLength;
};

// получаем наименование жилья по типу, для type
var getPlaseName = function(array1, array2) {
  var type = getRandomArrayItem(array1);
  var name = array2[type];
  return name;
}

var generateData = function() {
  var array = [];
  for (var i = 0; i < OBJECTS_QUANTITY; i++) {
    var obj = {};
    obj.author.avatar =
      'img/avatars/user' +
      (i + 1 < 10) ? '0' : '' +
      (i + 1) +
      '.png';
    obj.offer.title = getRandomArrayItem(TITLES);
    obj.offer.address = x + ', ' + y;
    obj.offer.price = getRandomNumberFromInterval(1000, 1000000);
    obj.offer.type = getRandomArrayItem(getPlaseName(plaseTypes, placeNames));
    obj.offer.rooms = getRandomNumberFromInterval(1, 5);
    obj.offer.guests = getRandomNumberFromInterval(1, 3);
    obj.offer.checkin = getRandomArrayItem(CHECKIN_CHECKOUT);
    obj.offer.checkout = getRandomArrayItem(CHECKIN_CHECKOUT);
    obj.offer.features = getRandomLenghtArray(FEATURES);
    obj.offer.description = '';
    obj.offer.photos = PHOTOS.slice().sort(getMixedArray);
    obj.location.x = x;
    obj.location.y = y;
    array.push(obj);
  }
  return array;
};

var markupTemplate = document.querySelector('template').content.querySelector('.map__card')

var createCardMarkup = function(obj) {
  var markupElement = markupTemplate.cloneNode(true);
  markupElement.querySelector('.popup__title').textContent = obj.offer.title;
  markupElement.querySelector('.popup__text--address').textContent = obj.offer.address;
  markupElement.querySelector('.popup__text--price').textContent = obj.offer.price + ' ₽/ночь';
  markupElement.querySelector('.popup__type').textContent = obj.offer.type;
  markupElement.querySelector('.popup__text--capacity').textContent = obj.offer.rooms + ' комнаты для ' + obj.offer.guests + ' гостей';
  markupElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + obj.offer.checkin + ', выезд до ' + obj.offer.checkout;
  markupElement.querySelector('.popup__features').textContent = obj.offer.features;
  markupElement.querySelector('.popup__description').textContent = obj.offer.description;

  var img = document.querySelector('.popup__photo');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < obj.offer.photos.length; i++) {
    img.src = obj.offer.photos[i];
    fragment.appendChild(img);
  };
  markupElement.querySelector('.popup__photos').appendChild = fragment;

  markupElement.querySelector('.popup__avatar').src= obj.author.avatar;
  return markupElement;
};

// отрисовка карточки
var renderCardMarkup = function(markup) {
  var data = generateData();
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < obj.author.avatar.length; i++) {
    var markup = generateMarkup(data[i]);
    var cardMarkup = fragment.appendChild(cardMarkup);
  }
  return cardMarkup;
};

// функция создания метки
var createPinMarkup = function(obj) {
  var pin = document.querySelector('map__pin');
  pin.style.left = obj.location.x - (PIN_SIZE / 2);
  pin.style.top = obj.location.y - PIN_SIZE;
  pin.img.src = obj.author.avatar;
  pin.alt.textContent = obj.offer.title;

  var onClick = function() {
        var card = createCardMarkup(obj);
        renderCardMarkup(card);
    };
    pin.addEventListener("click", onClick);
    return pin;
};


// Подготовка страницы

var data = generateData();

for (var i = 0; i < data.length; i++) {
    var pin = createPinMarkup(data[i]);
    fragment.appendChild(pin);
}

map.appendChild(fragment)

document.querySelector('.map').classList.remove('map--faded');

var blockWithAdvert = blockForAdvert.appendChild(fragment);

var blockAfterAdvert = document.querySelector('.map__filters-container');

document.querySelector('.map').insertBefore(blockWithAdvert, blockAfterAdvert);
