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
 * @param {Object[]} objectPlace.likes Массив лайков
 * @param {DocumentFragment} cardTemplate Заготовка
 * @param {Object} settings Настройки
 * @param {Object} objectFunctions callback'и
 * @param {onDeleteCard} objectFunctions.onDeleteCard Функция удаления карты
 * @param {onOpenPreview} objectFunctions.onOpenPreview Функция показа картинки
 * @param {onLikeCard} objectFunctions.onLikeCard Функция лайка
 * @param {deleteLike} objectFunctions.deleteLike Удаление лайка в API
 * @param {setLike} objectFunctions.setLike Установка лайка в API
 * @param {showMessage} objectFunctions.showMessage Показ сообщения об ошибке
 * @returns {HTMLElement} Карточка для размещения на странице
 */

export function createCard(objectPlace, cardTemplate, settings,
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
    .addEventListener('click', event => objectFunctions.onLikeCard(event, objectPlace['_id'], objectFunctions, settings));

  // Обработать лайки
  initialLike(newPlace, objectPlace, settings);
  return newPlace;
}

/**
 * Работа с лайками
 *
 * @param {HTMLElement} elementPlace Карта для загрузки лайков
 * @param {Object} objectPlace Данные карты
 * @param {Object[]} objectPlace.likes Массив лайков
 * @param {Object} objectPlace.owner Владелец карты
 * @param {Object} settings Настройки
 */
function initialLike(elementPlace, objectPlace, settings) {
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

  // Владелец
  let listItem = document.createElement('li');
  listItem.classList.add(settings.classTitleTooltip);
  listItem.textContent = 'Владелец:';
  likesTooltip.append(listItem);
  listItem = document.createElement('li');
  listItem.classList.add(settings.classItemTooltip, settings.classMarginTooltip);
  // Аватар
  const imageAvatar = document.createElement('img');
  imageAvatar.classList.add(settings.classImageTooltip);
  imageAvatar.setAttribute('src', objectPlace.owner.avatar);
  imageAvatar.setAttribute('alt', `Владелец карты: ${objectPlace.owner.name}`);
  listItem.append(imageAvatar);
  // Имя
  const spanName = document.createElement('span');
  spanName.classList.add(settings.classTextTooltip);
  spanName.textContent = objectPlace.owner.name;
  listItem.setAttribute('margin-bottom', '10px');
  listItem.append(spanName);
  // Добавить в список Владельца
  likesTooltip.append(listItem);

  // Список лайков
  const listItemTitle = document.createElement('li');
  listItemTitle.classList.add(settings.classTitleTooltip);
  if (likesCount === 0) {
    listItemTitle.textContent = 'Увы, лайков нет...';
    // Добавить в список заголовок
    likesTooltip.append(listItemTitle);
  } else {
    listItemTitle.textContent = 'Лайки этого места:';
    // Добавить в список заголовок
    likesTooltip.append(listItemTitle);
    let addLike = 0;  // Сколько добавлено
    let overLike = 0; // Лишние лайки
    objectPlace.likes.forEach((like) => {
      addLike++;
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
        imageAvatar.setAttribute('alt', `Установил лайк: ${like.name}`);
        listItem.append(imageAvatar);
        // Имя
        const spanName = document.createElement('span');
        spanName.classList.add(settings.classTextTooltip);
        spanName.textContent = like.name;
        listItem.append(spanName);
        // Добавить в список лайкнувшего (обожаю русский язык!)
        likesTooltip.append(listItem);
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
}

/**
 * Поставить/снять лайк карты
 * @callback onLikeCard
 * @param {Event} event Событие 'click' на кнопке
 * @param {String} idCard Id карты
 * @param {Object} objectFunctions Функции
 * @param {deleteLike} objectFunctions.deleteLike Функция API для удаления лайка
 * @param {setLike} objectFunctions.setLike Функция API для установки лайка
 * @param {showMessage} objectFunctions.showMessage Функция для выдачи сообщения об ошибке
 * @param {Object} settings Настройки
 */
export function onLikeCard(event, idCard, objectFunctions, settings) {
  if (event.target === null) return;

  const elementCard = event.target.closest(settings.classPlacesItem);
  const elementLike = event.target;
  const data = {
    id: idCard,
    elementCard,
    elementLike,
  };
  // Если лайк есть, то его надо снять, иначе поставить
  let promiseLike, what;
  if (event.target.classList.contains(settings.classLikeYesNotDot)) {
    promiseLike = objectFunctions.deleteLike(data, settings);
    what = 'снятии';
  } else {
    promiseLike = objectFunctions.setLike(data, settings);
    what = 'установке';
  }

  promiseLike
    .then((response) =>{
      // Не всё так хорошо?
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(`Ошибка при ${what} лайка:  ${response.status}, ${response.statusText}`)
    })
    .then((resJSON) => {
      // Количество лайков
      elementLike.parentElement.querySelector(settings.classLikesCount)
        .textContent = resJSON['likes'].length.toString();
      likeCard (elementLike, settings);
      initialLike(elementCard, resJSON, settings);
    })
    .catch((error) => {
      objectFunctions.showMessage(`Ошибка при ${what} лайка`, error, 'Понятно');
    });
}


/**
 * Удаление карты
 *
 * @param {Object} data Общие данные
 * @param {HTMLElement} data.elementPlace Карта для удаления
 */
export function removeCard(data) {
  if (data.elementPlace === null) return;

  data.elementPlace.remove();                 // Можно удалять!
}

/**
 * Поставить/снять лайк картинки
 * @param {HTMLElement} elementLike Кнопка лайка
 * @param {Object} settings Настройки
 */
function likeCard (elementLike, settings) {
  elementLike.classList.toggle(settings.classLikeYesNotDot);
}
