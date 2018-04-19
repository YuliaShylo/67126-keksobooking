// Константы

var PIN_SIZE = 40;

var TITLE = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var TYPE = [
  {palace: 'Дворец'},
  {flat: 'Квартира'},
  {house: 'Дом'},
  {bungalo: 'Бунгало'}
];

var CHECKIN_CHECKOUT = [
  '12:00',
  '13:00',
  '14:00'
];

var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var ARRAY_LENGTH = 8;

// Функции и переменные

var getRandomNumberFromInterval = function(min, max) {
  var randomNumber = min + Math.random() * (max + 1 - min);
    randomNumber = Math.floor(randomNumber);
    return randomNumber;
};

var getRandomArrayItem = function(array) {
    var index = getRandomNumberFromInterval(0, array.length - 1);
    return array[index];
};

// получаем случайную длину массива, для features
var getRandomLenghtArray = function(array) {
  var firstArrayElement = getRandomNumberFromInterval(0, array.length - 1)
  var lastArrayElement = getRandomNumberFromInterval(0, array.length - 1)
  var arrayRandomLength = array slice(firstArrayElement, lastArrayElement);
  // ругается отладчик. Синтаксис проверила, что не так?
  return arrayRandomLength;
};

var generateObj = function() {
  var array = [];
  for (var i = 0; i < ARRAY_LENGTH; i++) {
    var obj = {};
    var imageNumber = getRandomNumberFromInterval(1, 8);
    obj.author.avatar = 'img/avatars/user' + '0' +imageNumber + '.png';
    // должно быть число с ведущим нулем, 01, 02 и т.д.
    // не знаю как иначе записать
    obj.offer.title = getRandomArrayItem(TITLE);
    var xCoordinate = getRandomNumberFromInterval(300, 900);
    var yCoordinate = getRandomNumberFromInterval(150, 500);
    obj.offer.address = xCoordinate + ', ' yCoordinate;
    obj.offer.price = getRandomNumberFromInterval(1000, 1000000);
    obj.offer.type = getRandomArrayItem(TYPE);
    obj.offer.rooms = getRandomNumberFromInterval(1, 5);
    obj.offer.guests = getRandomNumberFromInterval(1, 3);
    obj.offer.checkin = getRandomArrayItem(CHECKIN_CHECKOUT);
    obj.offer.checkout = getRandomArrayItem(CHECKIN_CHECKOUT);
    obj.offer.features = getRandomLenghtArray(FEATURES);
    //планируется, что в качестве значения будут элементы массива. Я права?
    obj.offer.description = '';
    var photosCopyArray = PHOTOS slice();
    obj.offer.photos = photosCopyArray sort();
    obj.location.x = xCoordinate;
    obj.location.y = yCoordinate;
    array.push(obj);
  }
  return array;
};

var advTemplate = document.querySelector('template').content.querySelector('.map__card')

var generateMarkup = function(array) {
  var markupElement = advTemplate.cloneNode(true);

  markupElement.querySelector('.popup__title').textContent = array.offer.title;
  markupElement.querySelector('.popup__text--address') = array.offer.address;
  markupElement.querySelector('.popup__text--price') = array.offer.price + '₽/ночь';
  markupElement.querySelector('.popup__type') = array.offer.type;
  // Как добраться до значения ключа? Задала var TYPE
  // В задании: В блок .popup__type выведите тип жилья offer.type: Квартира для flat, Бунгало для bungalo, Дом для house, Дворец для palace
  markupElement.querySelector('.popup__text--capacity') = array.offer.rooms + ' комнаты для ' + array.offer.guests + ' гостей';
  markupElement.querySelector('.popup__text--time') = 'Заезд после ' + array.offer.checkin + ', выезд до ' + array.offer.checkout;
  markupElement.querySelector('.popup__features') = array.offer.features;
  markupElement.querySelector('.popup__description') = array.offer.description;
  markupElement.querySelector('.popup__photos')querySelector('img').src = array.offer.photos;
  markupElement.querySelector('.popup__avatar').src= array.author.avatar;
  markupElement.querySelector('.map__pin').style = left: (xCoordinate - (PIN_SIZE / 2)); top: (yCoordinate - PIN_SIZE);
  markupElement.querySelector('.map__pin').src = array.author.avatar;
  markupElement.querySelector('.map__pin').alt = array.offer.title;
  return markupElement;
};


// Код программы
document.querySelector('.map').classList.remove('map--faded');

var adverts = generateObj();

var blockForAdvert = document.querySelector('.map__pins');

var fragment = document.createDocumentFragment();

for (var i = 0; i < ARRAY_LENGTH; i++) {
  var advertMarkup = generateMarkup(adverts[i]);
  fragment.appendChild(advertMarkup);
}

var blockWithAdvert = blockForAdvert.appendChild(fragment);

var blockAfterAdvert = document.querySelector('.map__filters-container');

document.querySelector('.map').insertBefore(blockWithAdvert, blockAfterAdvert);
