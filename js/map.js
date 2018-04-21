// Константы

var PIN_SIZE = 40;

var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var placeTypes = [
  'palace',
  'flat',
  'house',
  'bungalo'
];
var placeNames = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

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

var COORDINATE_LEFT1 = 300;
var COORDINATE_LEFT2 = 900;
var COORDINATE_TOP1 = 150;
var COORDINATE_TOP2 = 500;


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

// получаем координаты
var xCoordinate = getRandomNumberFromInterval(COORDINATE_LEFT1, COORDINATE_LEFT2);
var yCoordinate = getRandomNumberFromInterval(COORDINATE_TOP1, COORDINATE_TOP2);

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

var generateObj = function() {
  var array = [];
  for (var i = 0; i < ARRAY_LENGTH; i++) {
    var obj = {};
    obj.author.avatar = 'img/avatars/user' + '0' + (i + 1) + '.png';
    // Да, забыла. Когда i будет двузначным?
    // В интернете не нашла кроме моего варината
    obj.offer.title = getRandomArrayItem(TITLES);
    obj.offer.address = xCoordinate + ', ' + yCoordinate;
    obj.offer.price = getRandomNumberFromInterval(1000, 1000000);
    obj.offer.type = getRandomArrayItem(getPlaseName(plaseTypes, placeNames));
    obj.offer.rooms = getRandomNumberFromInterval(1, 5);
    obj.offer.guests = getRandomNumberFromInterval(1, 3);
    obj.offer.checkin = getRandomArrayItem(CHECKIN_CHECKOUT);
    obj.offer.checkout = getRandomArrayItem(CHECKIN_CHECKOUT);
    obj.offer.features = getRandomLenghtArray(FEATURES);
    //планируется, что в качестве значения будут элементы массива. Я права?
    obj.offer.description = '';

    // Здесь в offer.photos на каждой итерации будет что?
    // весь отсортированный массив?
    var photosCopyArray = PHOTOS.slice();
    obj.offer.photos = photosCopyArray.sort();
  /*
    Мне нужен один случайный элемент этого массива, а на этапе отрисовки я буду добавлять полученный адрес в блок.

    Думаю, должно быть вот так
    obj.offer.photos = getRandomArrayItem(PHOTOS);

    Вобщем, я слегка запуталась, права я или нет.
    Плюс смотри ниже этап отрисовки.
  */

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
  markupElement.querySelector('.popup__text--address').textContent = array.offer.address;
  // Задание: Выведите адрес offer.address в блок .popup__text--address
  // "address": строка, адрес предложения, представляет собой запись вида "{{location.x}}, {{location.y}}", например, "600, 350"
  // Что, адрес это просто два числа вместо блока текста?

  markupElement.querySelector('.popup__text--price').textContent = array.offer.price + '₽/ночь';
  markupElement.querySelector('.popup__type').textContent = array.offer.type;
  markupElement.querySelector('.popup__text--capacity').textContent = array.offer.rooms + ' комнаты для ' + array.offer.guests + ' гостей';
  markupElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + array.offer.checkin + ', выезд до ' + array.offer.checkout;
  markupElement.querySelector('.popup__features').textContent = array.offer.features;
  markupElement.querySelector('.popup__description').textContent = array.offer.description;

  // В этом случае программма на каждой итерации цикла будет менять адрес фото,
  // насколько я понимаю, а вовсе не добавлять новое.
  markupElement.querySelector('.popup__photos').children.src = array.offer.photos;
  // Значит нужен appendChild
  /*
   Вариант решения.

  задаем переменную. в которую будем отрисовывать пустой блок с фото на каждой итерации.
  С учетом того что фото только три, надо задать цикл

  for (var i = 0; i < PHOTOS.length; i++) {
    var markupPhoto = document.querySelector('.popup__photo')
    записываем в переменную разметку фотографии

    var markupPhotoAll = document.querySelector('.popup__photos').appendChild(markupPhoto)
    теперь у нас есть переменная, которая содержит в себе разметку всех трех(в данном случае)
    фотографий, уже лежащих в нужном блоке
  }

  Вот теперь можем добавить в src данные, полученные из объекта

  markupPhotoAll.children.src = array.offer.photos;

  Что будет происходить на каждой итерации большого цикла?
  На каждой итерации программа будет создавать блок, у которого внутри три блока с фото.
  И адреса фото будут рандомно выбираться из массива. Итого будет 8(в данном случае) блоков по три в каждом.
*/

  markupElement.querySelector('.popup__avatar').src= array.author.avatar;
  markupElement.querySelector('.map__pin').style.left = (xCoordinate - (PIN_SIZE / 2)); top: (yCoordinate - PIN_SIZE);
  markupElement.querySelector('.map__pin').style.top = left: (xCoordinate - (PIN_SIZE / 2)); top: (yCoordinate - PIN_SIZE);
  /*
  Здесь должно быть так, я думаю
  markupElement.querySelector('.map__pin').style.left = xCoordinate - (PIN_SIZE / 2);
  markupElement.querySelector('.map__pin').style.top = yCoordinate - PIN_SIZE;
  но стоит мне убрать подсвеченное двоеточие в строке 175, как линтер обводит вообще весь код красным
  что это значит?
  */
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
