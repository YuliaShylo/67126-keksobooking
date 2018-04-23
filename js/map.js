 eslint-disable no-use-before-define
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
var getMixedArray = function () {
  return Math.floor(Math.random() - 0.5);
}

// функция получения случайной длинны массива, для features
var getRandomLenghtArray = function(array) {
  var firstArrayElement = getRandomNumberFromInterval(0, array.length - 1)
  var lastArrayElement = getRandomNumberFromInterval(0, array.length - 1)
  var arrayRandomLength = array.slice(firstArrayElement, lastArrayElement);
  return arrayRandomLength;
};

// функция получения наименования по типу жилья, для type
var getPlaseName = function(array1, array2) {
  var type = getRandomArrayItem(array1);
  var name = array2[type];
  return name;
}


/*
Логика программы:
1) Нагенерировать данные путем создания массива из восьми объектов: каждый объект описывает пин, карточку и аватар.
2) Создать DOM-элемент - пин:
  - найти шаблон, результат записать в переменную
  - клонировать шаблон, результат записать в переменную
  - заполнить шаблон пина данными из объекта (написать функцию).
3) Отрисовать все пины в соответствующий блок на странице:
  - запустить функцию заполнения шаблона с пином данными,
  - результат записать во фрагмент,
  - вставить фрагмент в разметку.
4) Создать DOM-элемент - карточку:
  - найти шаблон карточки,
  - клонировать шаблон,
  - заполнить шаблон данными из объекта, написать функцию,
5) Отрисовать одну карточку на страницу:
  - запустить функцию,
  - вставить полученный шаблон в разметку
*/


// Выполнение

// Функция генерации данных.
var generateData = function() {
  var x = getRandomNumberFromInterval(COORDINATES.left, COORDINATES.right);
  var y = getRandomNumberFromInterval(COORDINATES.top, COORDINATES.bottom);
  var array = [];
  for (var i = 0; i < OBJECTS_QUANTITY; i++) {
    var obj = {
      author: {
        avatar: 'img/avatars/user' +
                (i + 1 < 10) ? '0' : '' +
                (i + 1) +
                '.png',
      },
      offer: {
        title: getRandomArrayItem(TITLES),
        address: x + ', ' + y,
        price: getRandomNumberFromInterval(1000, 1000000),
        type: getRandomArrayItem(getPlaseName(plaseTypes, placeNames)),
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


// Создаем пин

// найдем шаблон
var pinMarkupTemplate = document.querySelector('template').content.querySelector('.map__pin');

// найдем блок, в который будем добавлять новые пины
var blockForPins = document.querySelector('.map__pins');

// создадим функцию заполнения шаблона данными из объекта
var generatePinMarkup = function(obj) {

  // склонируем разметку шаблона в переменную
var pinMarkup = pinMarkupTemplate.cloneNode(true)
// заполним разметку данными
  pinMarkup.style.left = obj.location.x - (PIN_SIZE / 2);
  pinMarkup.style.top = obj.location.y - PIN_SIZE;
  var img = pinMarkup.querySelector('img');
  img.src = obj.author.avatar;
  img.alt.textContent = obj.offer.title;
  return pinMarkup;
}

// заполняем разметку данными
var renderPinMarkup = function() {

  // создадим переменную, в которую запишутся данные (объект)
  var pinData = generateData();

  // создадим переменную, в которую запишется разметка с данными из объекта
  var pin = generatePinMarkup(pinData[i])

  // создадим фрагмент, в который будем складывать разметку всех пинов
  var fragment = document.createDocumentFragment();

  // добавим полученную разметку в переменную через фрагмент
  return fragment.appendChild(pin);
}

// запишем в переменную результаты работы функции создания пинов
var pinFragment = renderPinMarkup();

// выведем полученный результат в разметку страницы
blockForPins.appendChild(pinFragment);




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
  var pin = document.querySelector('.map__pin');
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
