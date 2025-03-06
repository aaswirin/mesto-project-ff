/**
 * Создание карточки.
 *
 * @param {Object} objectPlace Место для создания
 * @param {string} objectPlace.name Наименование Места
 * @param {string} objectPlace.link URL картинки
 * @param {onDeleteCard} onDeleteCard Функция удаления картинки
 * @param {function} onOpenPreview Функция показа картинки
 * @param {onLikeCard} onLikeCard Функция лайка
 * @param {DocumentFragment} cardTemplate Заготовка
 * @param {Object} settings Настройки
 * @returns {HTMLElement} Карточка для размещения на странице
 */
function createCard(objectPlace, cardTemplate, settings,
                    {onDeleteCard, onOpenPreview, onLikeCard} = {}) {
  const newPlace = cardTemplate.querySelector(settings.classPlacesItem).cloneNode(true);

  // Изображение
  const cardImage = newPlace.querySelector(settings.classCardImage);
  cardImage.setAttribute('src', objectPlace.link);
  cardImage.setAttribute('alt', 'Место на картинке: ' + objectPlace.name);
  // Показ картинки "во всей красе"
  cardImage.addEventListener('click', event => onOpenPreview(event));
  // Подпись
  newPlace.querySelector(settings.classCardTitle).textContent = objectPlace.name;
  // Кнопка Удалить
  newPlace.querySelector(settings.classCardDeleteButton)
          .addEventListener('click', event => onDeleteCard(event, newPlace));
  // Лайк карточки
  newPlace.querySelector(settings.classLikeButton)
          .addEventListener('click', event => onLikeCard(event, settings));

  return newPlace;
}

/**
 * Удаление карточки
 *
 * @callback onDeleteCard
 * @param {Event} event Событие 'click' на кнопке
 * @param {HTMLElement} cardDelete Настройки
 */
const onDeleteCard = function (event, cardDelete) {
  if (cardDelete === null) return;

  cardDelete.remove();                 // Можно удалять!
}

/**
 * Поставить/снять лайк картинки
 * @callback onLikeCard
 * @param {Event} event Событие 'click' на кнопке
 * @param {Object} settings Настройки
 */
const onLikeCard = function (event, settings) {
  if (event.target === null) return;

  event.target.classList.toggle(settings.classLikeYesNotDot);
}

/**
 * Вывести карточки на страницу
 *
 * @param {Object[]} initCards Массив описаний карточек
 * @param {string} initCards.name Наименование Места
 * @param {string} initCards.link URL картинки
 * @param {Object} settings Настройки
 * @param {boolean} addToBegin Создавать карты в начале
 * @param {DocumentFragment} cardTemplate Заготовка
 * @param {Element} placesContainer Место для укладки карт
 * @param {onOpenPreview} onOpenPreview
 *
 */
export function initPlaces(initCards, settings, addToBegin,
                           {cardTemplate, placesContainer, onOpenPreview} = {}) {
  const objFunction = {
    onDeleteCard,
    onOpenPreview,
    onLikeCard
  };
  initCards.forEach(function (item) {
    let newPlace = createCard(item, cardTemplate, settings, objFunction);
    if (addToBegin) placesContainer.prepend(newPlace)
    else placesContainer.append(newPlace);
  });
}
