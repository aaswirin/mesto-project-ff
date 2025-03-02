import {showPopup} from './modal.js';            // Функция для создания карточек
import {settings} from './settings.js';         // Настройки проекта

/**
 * Создание карточки.
 *
 * @param {Object} objectPlace Место для создания
 * @param {string} objectPlace.name Наименование Места
 * @param {string} objectPlace.link URL картинки
 * @param {deletePlace} functionDelete Функция удаления картинки
 * @param {showImage} functionShowImage Функция показа картинки
 * @param {likeImage} functionLike Функция лайка
 * @param {HTMLElement} cardTemplate Заготовка
 * @returns {HTMLElement} Карточка для размещения на странице
 */
function addPlace(objectPlace, functionDelete, functionShowImage,
                  functionLike, cardTemplate) {
  const newPlace = cardTemplate.querySelector(settings.classPlacesItem).cloneNode(true);

  // Изображение
  const cardImage = newPlace.querySelector(settings.classCardImage);
  cardImage.setAttribute('src', objectPlace.link);
  cardImage.setAttribute('alt', 'Место на картинке: ' + objectPlace.name);
  // Показ картинки "во всей красе"
  cardImage.addEventListener('click', functionShowImage);
  // Подпись
  newPlace.querySelector(settings.classCardTitle).textContent = objectPlace.name;
  // Кнопка Удалить
  newPlace.querySelector(settings.classCardDeleteButton)
          .addEventListener('click',functionDelete);
  // Лайк карточки
  newPlace.querySelector(settings.classLikeButton)
          .addEventListener('click', likeImage);

  return newPlace;
}

/**
 * Удаление карточки
 *
 * @callback deletePlace
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
 * Показ картинки в отдельном окне
 *
 * @callback showImage
 * @param {Event} event Событие 'click' на кнопке
 */
const showImage = function (event) {
  if (event.target === null) return;

  // Окно "Показать картинку"
  const windowImages = document.querySelector(settings.classWindowViewImage);

  showPopup(event, windowImages, null);
  // Напихать в окно всё из карточки
  const viewImage= windowImages.querySelector(settings.classViewImage);
  viewImage.setAttribute('src', event.target.getAttribute('src'));
  viewImage.setAttribute('alt', event.target.getAttribute('src'));

  // Поискать карточку выше и выше, вдруг враги разметку поменяли
  const placeCurrent = event.target.closest(settings.classListItem);
  if (placeCurrent === null) return;

  windowImages.querySelector(settings.classViewCaption).textContent = placeCurrent.querySelector(settings.classCardTitle).textContent
}

/**
 * Поставить/снять лайк картинки
 * @callback likeImage
 * @param {Event} event Событие 'click' на кнопке
 */
const likeImage = function (event) {
  if (event.target === null) return;

  event.target.classList.toggle(settings.classLikeYes.slice(1));
}

/**
 * Вывести карточки на страницу
 *
 * @param {Object[]} initCards Массив описаний карточек
 * @param {string} initCards.name Наименование Места
 * @param {string} initCards.link URL картинки
 * @param {HTMLElement} cardTemplate Заготовка
 * @param {HTMLElement} placesContainer Место для укладки карт
 * @param {boolean} addToBegin Создавать карты в начале
 */
export function initPlaces(initCards, cardTemplate, placesContainer,addToBegin) {
  let newPlace;
  initCards.forEach(function (item) {
    newPlace = addPlace(item, deletePlace, showImage, likeImage, cardTemplate);
    if (addToBegin) placesContainer.prepend(newPlace)
    else placesContainer.append(newPlace);
  });
}
