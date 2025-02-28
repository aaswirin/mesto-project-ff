import '../pages/index.css';                        // Импорт главного файла стилей

import { initialCards } from './cards.js';          // Импорт описания карточек

/*
 * Настройки для разметки
 * При изменении разметки править здесь
 */
const settings = {
  idTemplate: "#card-template",                     // Id template'а для карт
  classPlacesList: '.places__list',                 // Класс места для укладки карт
  classPlacesItem: '.places__item',                 // Класс для карты
  classCardImage: '.card__image',                   // Класс для картинки карты
  classCardTitle: '.card__title',                   // Класс для подписи карты
  classCardDeleteButton: '.card__delete-button',    // Класс для кнопки удаления карты
  classListItem: 'li.places__item',                 // Тэг и Класс места для укладки карт
}

/** Заготовка */
const cardTemplate = document.querySelector(settings.idTemplate).content;

/** DOM узлы по потребности */
const placesContainer=document.querySelector(settings.classPlacesList);     // Место для укладки карт

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
  const newPlace = cardTemplate.querySelector(settings.classPlacesItem).cloneNode(true);

  // Изображение
  const cardImage = newPlace.querySelector(settings.classCardImage);
  cardImage.setAttribute('src', objectPlace.link);
  cardImage.setAttribute('alt', 'Место на картинке: ' + objectPlace.name);
  // Подпись
  newPlace.querySelector(settings.classCardTitle).textContent = objectPlace.name;
  // Кнопка Удалить
  newPlace.querySelector(settings.classCardDeleteButton).addEventListener('click', functionDelete);

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
  const placeDelete = event.target.closest(settings.classListItem);

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
