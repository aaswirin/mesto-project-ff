/** @module index */

/** Заготовка */
const cardTemplate = document.querySelector('#card-template').content;

/** DOM узлы по потребности */
const placesContainer=document.querySelector('.places__list');     // Место для укладки карт

/**
 * Создание карточки.
 *
 * @param {object} objectPlace Место для создания
 * @param {string} objectPlace.name Наименование Места
 * @param {string} objectPlace.link URL картинки
 * @param {function} functionDelete Функция удаления картинки
 * @returns {HTMLElement} карточка для размещения на странице
 */
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

/**
 * Удаление карточки
 *
 * @param {Event} event Событие 'click' на кнопке
 */
const deletePlace = function (event) {
  if (event.target === null) return;

  // Поискать карточку выше и выше, вдруг враги разметку поменяли
  const placeDelete = event.target.closest('li.places__item');

  if (placeDelete === null) return;

  placeDelete.remove();                 // Можно удалять!
}

/**
 * Вывести карточки на страницу
 *
 * @param {object[]} initCards Массив описаний карточек
 * @param {string} initCards.name Наименование Места
 * @param {string} initCards.link URL картинки
*/
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
