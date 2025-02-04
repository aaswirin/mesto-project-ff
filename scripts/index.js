// Заготовка
const cardTemplate = document.querySelector('#card-template').content;

// DOM узлы по потребности
const placesContainer=document.querySelector('.places__list');     // Место для укладки карт

// Создание карточки
// -> objectPlace {  Место для создания
//       name: <Наименование Места>,
//       link: <URL картинки>,
//    }
// -> functionDelete - функция для удаления карточки
function addPlace(objectPlace, functionDelete) {
  const newPlace = cardTemplate.querySelector('.places__item').cloneNode(true);

  // Изображение
  const cardImage = newPlace.querySelector('.card__image');
  cardImage.setAttribute('src', objectPlace.link);
  cardImage.setAttribute('alt', 'Место на картинке: ' + objectPlace.name);
  // Подпись
  newPlace.querySelector('.card__title').textContent = objectPlace.name;
  // Кнопка Удалить
  newPlace.querySelector('.card__delete-button').addEventListener('click', functionDelete);

  return newPlace;
}

// Удаление карточки
const deletePlace = function (event) {
  let placeDelete;
  let element = event.target;

  // Поискать карточку выше и выше, вдруг враги разметку поменяли
  while (typeof placeDelete === "undefined" && element.parentElement !== null) {
    if (element.parentElement.classList.contains('places__item')) {
      // Нашёл карточку!
      placeDelete = element.parentElement;
      placeDelete.remove();                 // Можно удалять!
    } else {
      // Буду искать дальше...
      element = element.parentElement;
    }
  }
}

// Вывести карточки на страницу
// -> initCards - массив карточек для создания
function initPlaces(initCards) {
  let newPlace;
  initCards.forEach(function (item) {
    newPlace = addPlace(item, deletePlace);
    placesContainer.append(newPlace);
  });
}

// Стартуем
// 1. Вывести карточки на страницу
initPlaces(initialCards);
