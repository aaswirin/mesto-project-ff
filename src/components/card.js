/*
 Карточки
 */


/**
 * Создание карточки.
 *
 * @param {Object} objectPlace Место для создания
 * @param {string} objectPlace.name Наименование Места
 * @param {string} objectPlace.link URL картинки
 * @param {string} objectPlace[_id] Id картинки в URL
 * @param {onDeleteCard} onDeleteCard Функция удаления карты
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
  const elementCardDeleteButton = newPlace.querySelector(settings.classCardDeleteButton);
  if (objectPlace.owner['_id'] === settings.apiIdUser) {  // Моя карта, могу и удалить
    elementCardDeleteButton.addEventListener('click', () => onDeleteCard(newPlace, objectPlace['_id']));
  } else {                                                // Чужая карта, удалять ни-ни
    elementCardDeleteButton.remove();
  }
  // Лайк карточки
  newPlace.querySelector(settings.classLikeButton)
    .addEventListener('click', event => onLikeCard(event, settings));
  // Количество лайков
  console.log(objectPlace)
  newPlace.querySelector(settings.classLikesCount).textContent = objectPlace.likes.length;
  return newPlace;
}

/**
 * Удаление карточки
 *
 * @param {HTMLElement} cardDelete Карта для удаления
 */
export function removeCard(cardDelete) {
  if (cardDelete === null) return;

  cardDelete.remove();                 // Можно удалять!
}

/**
 * Поставить/снять лайк картинки
 * @param {HTMLElement} elementLike Кнопка лайка
 * @param {Object} settings Настройки
 */
export function likeCard (elementLike, settings) {
  elementLike.classList.toggle(settings.classLikeYesNotDot);
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
 * @param {onOpenPreview} onOpenPreview Функция для просмотра изображения
 * @param {onDeleteCard} onDeleteCard Функция для удаления карты
 * @param {onLikeCard} onLikeCard Функция для постановки/снятия лайка
 */
export function initPlaces(initCards, settings, addToBegin,
                           {cardTemplate,
                            placesContainer,
                            onOpenPreview,
                            onDeleteCard,
                            onLikeCard,
                           } = {}) {
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
