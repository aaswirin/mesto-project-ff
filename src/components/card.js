/*
 Карты
 */


/**
 * Создание карты
 *
 * @param {Object} objectPlace Место для создания
 * @param {string} objectPlace.name Наименование Места
 * @param {string} objectPlace.link URL картинки
 * @param {string} objectPlace[_id] Id картинки в URL
 * @param {Object} objectPlace.owner Id владельца карты
 * @param {DocumentFragment} cardTemplate Заготовка
 * @param {Object} settings Настройки
 * @param {Object} objectFunctions callback'и
 * @param {onDeleteCard} objectFunctions.onDeleteCard Функция удаления карты
 * @param {onOpenPreview} objectFunctions.onOpenPreview Функция показа картинки
 * @param {onLikeCard} objectFunctions.onLikeCard Функция лайка
 * @returns {HTMLElement} Карточка для размещения на странице
 */
function createCard(objectPlace, cardTemplate, settings,
                    objectFunctions) {
  const newPlace = cardTemplate.querySelector(settings.classPlacesItem).cloneNode(true);

  // Изображение
  const cardImage = newPlace.querySelector(settings.classCardImage);
  cardImage.setAttribute('src', objectPlace.link);
  cardImage.setAttribute('alt', 'Место на картинке: ' + objectPlace.name);
  // Показ картинки "во всей красе"
  cardImage.addEventListener('click', event => objectFunctions.onOpenPreview(event));
  // Подпись
  newPlace.querySelector(settings.classCardTitle).textContent = objectPlace.name;
  // Кнопка Удалить
  const elementCardDeleteButton = newPlace.querySelector(settings.classCardDeleteButton);
  if (objectPlace.owner['_id'] === settings.apiIdUser) {  // Моя карта, могу и удалить
    elementCardDeleteButton.addEventListener('click', () => objectFunctions.onDeleteCard(newPlace, objectPlace['_id']));
  } else {                                                // Чужая карта, удалять ни-ни
    elementCardDeleteButton.remove();
  }
  // Лайк карточки
  newPlace.querySelector(settings.classLikeButton)
    .addEventListener('click', event => objectFunctions.onLikeCard(event, objectPlace['_id'], settings));

  // Обработать лайки
  initialLike(newPlace, objectPlace, settings);
  return newPlace;
}

/**
 * Работа с лайками
 *
 * @param {HTMLElement} elementPlace Карта для загрузки лайков
 * @param {Object} objectPlace Данные карты
 * @param {Object} settings Настройки
 */
export function initialLike(elementPlace, objectPlace, settings) {
  // Количество лайков
  const likesCount = objectPlace.likes.length;
  elementPlace.querySelector(settings.classLikesCount).textContent = likesCount.toString();

  // Список тех, кто лайк поставил
  const likesTooltip = elementPlace.querySelector(settings.classLikesTooltip);
  // Зачистить предыдущий список
  let child = likesTooltip.lastElementChild;
  while (child) {
    likesTooltip.removeChild(child);
    child = likesTooltip.lastElementChild;
  }
  const listItem = document.createElement('li');
  listItem.classList.add(settings.classTitleTooltip);
  if (likesCount === 0) {
    listItem.textContent = 'Увы, лайков нет...';
  } else {
    listItem.textContent = 'Лайки этого места:';
    let addLike = 0;  // Сколько добавлено
    let overLike = 0; // Лишние лайки
    objectPlace.likes.forEach((like) => {
      // Свой лайк не потерять!
      if (like['_id'] === settings.apiIdUser) {
        elementPlace.querySelector(settings.classLikeButton).classList.add(settings.classLikeYesNotDot);
      }
      if (addLike <= settings.countLikeInTooltip) {  // Можно добавлять
        // Элемент списка
        const listItem = document.createElement('li');
        listItem.classList.add(settings.classItemTooltip);
        // Аватар
        const imageAvatar = document.createElement('img');
        imageAvatar.classList.add(settings.classImageTooltip);
        imageAvatar.setAttribute('src', like.avatar);
        imageAvatar.setAttribute('alt', 'Установил лайк: ' + like.name);
        listItem.append(imageAvatar);
        // Имя
        const spanName = document.createElement('span');
        spanName.classList.add(settings.classTextTooltip);
        spanName.textContent = like.name;
        listItem.append(spanName);
        // Добавить в список лайкнувшего (обожаю русский язык!)
        likesTooltip.append(listItem);
        addLike++;
      } else {  // Уже лишние
        overLike++;
      }
    })
    if (overLike !== 0) {
      const listItem = document.createElement('li');
      //listItem.classList.add(settings.classTitleTooltip);
      listItem.textContent = `...и ещё ${overLike}`;
      likesTooltip.append(listItem);
    }
  }
  // Добавить в список заголовок
  likesTooltip.prepend(listItem);
}

/**
 * Удаление карты
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
 * Вывести карты на страницу
 *
 * @param {Object[]} initCards Массив описаний карт
 * @param {string} initCards.name Наименование Места
 * @param {string} initCards.link URL картинки
 * @param {string} initCards.owner Владелец карты
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
