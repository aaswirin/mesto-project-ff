/*
 Главная, отсюда всё и начинается
 */

// Импорт главного файла стилей
import '../pages/index.css';
// Настройки проекта
import {settings} from '../components/settings.js';
// Функция для создания карт при инициализации
import {initPlaces, likeCard, removeCard, initialLike} from '../components/card.js';
// Обработка окон
import {showPopup, closePopup, verifyEventMouseUp, verifyEventKeyDown, setModalWindowEventListeners} from '../components/modal.js';
// Валидация
import {enableValidation, clearValidation, buttonSetState} from '../components/validation.js';
// API
import {getProfileAndCard, setProfile, setCard, deleteCard, setLike, deleteLike, updateAvatar} from '../components/api.js';

/** Заготовка */
const cardTemplate = document.querySelector(settings.idTemplate).content;

/** DOM узлы по потребности */
const placesContainer = document.querySelector(settings.classPlacesList);      // Место для укладки карт

const windowAvatar = document.querySelector(settings.classWindowEditAvatar);   // Окно "Редактировать аватар"
const formAvatar = windowAvatar.querySelector(settings.classForm);             // Форма "Редактировать аватар"
const buttonAvatar = formAvatar.querySelector(settings.classSubmitButton);     // Кнопка "Редактировать аватар"

const windowProfile = document.querySelector(settings.classWindowEditProfile);  // Окно "Редактировать профиль"
const formProfile = windowProfile.querySelector(settings.classForm);            // Форма "Редактировать профиль"
const buttonProfile = formProfile.querySelector(settings.classSubmitButton);    // Кнопка "Редактировать профиль"

const windowCard = document.querySelector(settings.classWindowAddCard);         // Окно "Добавить карту"
const formCard = windowCard.querySelector(settings.classForm);                  // Форма "Добавить карту"
const buttonCard = formCard.querySelector(settings.classSubmitButton);          // Кнопка "Добавить карту"

const windowImage = document.querySelector(settings.classWindowViewImage);      // Окно "Показать картинку"
const viewImage= windowImage.querySelector(settings.classViewImage);            // Изображение на форме "Показать картинку"

const windowMessage = document.querySelector(settings.classWindowMessage);       // Окно "Всякие сообщения"
const captionMessage= windowMessage.querySelector(settings.classCaptionMessage); // Заголовок окна "Всякие сообщения"
const textMessage= windowMessage.querySelector(settings.classTextMessage);       // Текст окна "Всякие сообщения"
const buttonMessage = windowMessage.querySelector(settings.classSubmitButton);   // Кнопка окна "Всякие сообщения"

// Редактировать аватар
document.querySelector(settings.classButtonEditAvatar).addEventListener('click', openEditAvatar);

// Редактировать профиль
document.querySelector(settings.classButtonEditProfile).addEventListener('click', openEditProfile);

// Добавление карту
document.querySelector(settings.classButtonAddCard).addEventListener('click', openAddCard);


/*
 * Работа с формами
 */

/**
 * Поиск формы внутри окна
 *
 * @param {HTMLElement} elementWindow Окно формы
 * @return {string} Имя формы
 */
function findForm(elementWindow) {
  const form = elementWindow.querySelector(settings.classForm);
  if (form === null) return '';

  return form.getAttribute('name');
}

/**
 * Инициализация формы
 *
 * @param {HTMLElement} elementWindow Окно формы
 * @param {Object[]} bindFields связки полей
 * @param {string} bindFields.classPage Класс элемента из которого нужно взять значение
 * @param {string} bindFields.nameForm Имя на форме, куда нужно записать значение
 */
function initPopup(elementWindow, bindFields) {
  const nameForm = findForm(elementWindow);
  if (nameForm === '') return;

  bindFields.forEach(function (element,) {
    if (element.nameForm === '') return;   // Этого поля нет на форме
    const textElement = document.querySelector(element.classPage);
    if (textElement === null) return;

    document.forms[nameForm].elements[element.nameForm].value = textElement.textContent;
  });
}

/**
 * Инициализация показа картинки
 *
 * @param {HTMLElement} elementWindow Окно формы
 * @param {HTMLElement} elementImages Картинка на странице
 */
function initImage(elementWindow, elementImages) {
  // Напихать в окно всё из карты
  viewImage.setAttribute('src', elementImages.getAttribute('src'));
  viewImage.setAttribute('alt', elementImages.getAttribute('alt'));

  // Поискать карту выше и выше, вдруг враги разметку поменяли
  const placeCurrent = elementImages.closest(settings.classListItem);
  if (placeCurrent === null) return;

  elementWindow.querySelector(settings.classViewCaption).textContent = placeCurrent.querySelector(settings.classCardTitle).textContent
}

/**
 * Очистка формы
 *
 * @param {HTMLElement} elementWindow Окно формы
 */
function clearForm(elementWindow) {
  const nameForm = findForm(elementWindow);
  if (nameForm === '') return;

  // Теперь можно и прибраться
  document.forms[nameForm].reset();
}

/**
 * Результат формы для добавления профиля на страницу
 *
 * @param {Object} data Данные из API, если это после запроса, иначе {}
 * @param {Boolean} result Результат запроса в API
 * @param {Object[]} bindFields связки полей
 * @param {string} bindFields.classPage Класс элемента из которого нужно взять значение
 * @param {string} bindFields.nameAPI Имя в объекте из API
 * @param {string} bindFields.typeElement Тип элемента: 'text' или 'image'
 */
function editProfile(data, result, bindFields) {
  // Из объекта на страницу по настройке
  bindFields.forEach(function (element) {
    const htmlElement = document.querySelector(element.classPage);
    if (htmlElement === null) return;

    const value = data[element.nameAPI]

    if (element.typeElement === 'text') htmlElement.textContent = value;
    else if (element.typeElement === 'image') {
      htmlElement.setAttribute('style', `background-image: url(${value});`);
    }
  });
}

/**
 * Результат формы для добавления карты на страницу
 *
 * @param {Object[]} data Данные из API, если это после запроса
 * @param {String} data.link URL картинки
 * @param {String} data.name URL картинки
 * @param {Boolean} result Результат запроса в API
 */
function createNewCard(data, result) {
  // Обработка
  if (!result) return;  // В API произошла ошибка
  const nameForm = findForm(windowCard);
  if (nameForm === '') return;

  initPlaces(data, settings, true, objParam);
}

/**
 *  Закончил работу с формами
 */

/**
 * Закрывашка для всех окон
 *
 * @param {HTMLElement} elementWindow Окно формы
 * @param {function} functionCloseKey Функция для закрытия окна по клавише
 */
function closeWindow(elementWindow, functionCloseKey) {
  closePopup(elementWindow, settings, functionCloseKey);

  if (elementWindow === windowMessage) buttonMessage.classList.remove(settings.classMarkerCall);

  // ... и почистить форму
  clearForm(elementWindow);
}

/**
 * Закрывашка для всех окон клику вне окна
 *
 * @param {Event} event Событие 'mouseup'
 * @param {HTMLElement} elementWindow Окно формы
 * @param {function} functionCloseKey Функция для закрытия окна по клавише
 */
function closeWindowMouseUp(event, elementWindow, functionCloseKey) {
  if (verifyEventMouseUp(event, settings)) closeWindow(elementWindow, functionCloseKey);
}

/**
 * Закрывашка для всех окон по клавише
 *
 * @param {Event} event Событие 'mouseup'
 */
function closeWindowKey(event) {
  if (!verifyEventKeyDown(event, settings)) return;

  // Найти окно
  const elementWindow = document.querySelector(settings.classWindowOpen);
  if (elementWindow !== null) closeWindow(elementWindow, closeWindowKey);
}

/**
 * Запуск окна "Редактировать аватар"
 */
function openEditAvatar() {
  clearValidation(formAvatar, buttonAvatar, settings);

  buttonSetState(buttonAvatar, true, settings);

  showPopup(windowAvatar, settings, closeWindowKey);
}

/**
 * Обработка формы "Редактировать аватар"
 *
 * @param {Event} event Событие 'submit'
 */
function submitAvatar(event) {
  event.preventDefault();

  // Отправить в API
  const nameForm = findForm(windowAvatar);
  if (nameForm === '') return;

  // Из формы в API по настройке
  const data = {};
  settings.bindAvatar.forEach(function (element) {
    data[element.name] = document.forms[nameForm].elements[element.nameForm].value
  });
  data.buttonSubmit = buttonAvatar;
  updateAvatar(onEditAvatarAPI, data, settings);

  closePopup(windowAvatar, settings, closeWindowKey);
  // ... и почистить форму
  clearForm(windowAvatar);
}

/**
 * Запуск окна "Редактировать профиль"
 */
function openEditProfile() {
  // Инициализировать поля
  initPopup(windowProfile, settings.bindProfile);

  clearValidation(windowProfile, buttonProfile, settings);
  buttonSetState(buttonProfile, false, settings);

  showPopup(windowProfile, settings, closeWindowKey);
}

/**
 * Обработка формы "Редактировать профиль"
 *
 * @param {Event} event Событие 'submit'
 */
function submitProfile(event) {
  event.preventDefault();

  // Отправить в API
  const nameForm = findForm(windowProfile);
  if (nameForm === '') return;

  // Из формы в API по настройке
  const data = {};
  settings.bindProfile.forEach(function (element) {
    // Этот элемент в API не отправляется или его нет на форме
    if ((element.nameAPI === '') || (element.nameForm === '')) return;
    data[element.nameAPI] = document.forms[nameForm].elements[element.nameForm].value
  });
  data.buttonSubmit = buttonProfile;
  setProfile(onLoadAndSetProfileAPI, data, settings);

  closePopup(windowProfile, settings, closeWindowKey);
  // ... и почистить форму
  clearForm(windowProfile);
}

/**
 * Запуск окна "Добавить карту"
 *
 */
function openAddCard() {
  clearValidation(formCard, buttonCard, settings);

  buttonSetState(buttonCard, true, settings);

  showPopup(windowCard, settings, closeWindowKey);
}

/**
 * Обработка формы "Добавить карту"
 *
 * @param {Event} event Событие 'submit'
 */
function submitCard(event) {
  event.preventDefault();

  // Отправить в API
  const nameForm = findForm(windowCard);
  if (nameForm === '') return;

  // Из формы в API по настройке
  const data = {};
  settings.bindCard.forEach(function (element) {
    data[element.name] = document.forms[nameForm].elements[element.nameForm].value
  });
  data.buttonSubmit = buttonCard;
  setCard(onAddCardAPI, data, settings);

  closePopup(windowCard, settings, closeWindowKey);
  // ... и почистить форму
  clearForm(windowCard);
}

/**
 *
 * @type {Object} Данные для дополнительных действий после закрытия окна с сообщением
 */
const dataToMessage = {
  functionCall: null,
  callback: null,
  data: {},
};

/**
 * Обработка удаления Карты
 *
 * @callback onDeleteCard
 * @param {HTMLElement} elementPlace Карта
 * @param {String} idCard Id карты
 */
function onDeleteCard(elementPlace, idCard) {
  // Что запустить, после нажатия на кнопку
  dataToMessage.functionCall = deleteCard;
  dataToMessage.callback = onDeleteCardAPI;
  dataToMessage.data.id = idCard;
  dataToMessage.data.elementPlace = elementPlace;
  buttonMessage.classList.add(settings.classMarkerCall);

  // Сначала спросить
  showMessage('Вы уверены?', '', 'Да');
}

/**
 * Поставить/снять лайк картинки
 * @callback onLikeCard
 * @param {Event} event Событие 'click' на кнопке
 * @param {String} idCard Id карты
 * @param {Object} settings Настройки
 */
function onLikeCard(event, idCard, settings) {
  if (event.target === null) return;

  const data = {
    id: idCard,
    elementCard: event.target.closest(settings.classPlacesItem),
    elementLike: event.target,
  };
  // Если лайк есть, то его надо снять, иначе поставить
  if (event.target.classList.contains(settings.classLikeYesNotDot)) {
    deleteLike(onLikeAPI, data, settings);
  } else {
    setLike(onLikeAPI, data, settings);
  }
}

/**
 * Показ картинки в отдельном окне
 *
 * @callback onOpenPreview
 * @param {Event} event Событие 'click'
 */
function onOpenPreview(event) {
  // Инициализировать картинку
  initImage(windowImage, event.target);

  showPopup(windowImage, settings, closeWindowKey);
}

/**
 * Показать окно "Всякие сообщения"
 *
 * @param {String} titleMessage Заголовок
 * @param {String} textLabel Текст сообщения
 * @param {String} textButton Текст на кнопке
 */
function showMessage(titleMessage, textLabel, textButton) {
  captionMessage.textContent = titleMessage;
  textMessage.textContent = textLabel;
  buttonMessage.textContent = textButton;

  showPopup(windowMessage, settings, closeWindowKey);
}

/**
 * Нажата кнопка в окне "Всякие сообщения"
 *
 */
function clickMessageButton() {
  // Что-то исполнить?
  if (buttonMessage.classList.contains(settings.classMarkerCall)) {
    dataToMessage.functionCall(dataToMessage.callback, dataToMessage.data, settings);
  }

  closeWindow(windowMessage, closeWindowKey);
}

/**
 * Работа с API. Загрузки...
 */
/**
 * Обработка загрузки или обновления Профиля через API
 *
 * @callback onLoadAndSetProfileAPI
 * @param {Boolean} result результат запроса
 * @param {Object} data Данные запроса
 * @param {String} data.error Ошибка при result = false
 * @param {String} data.name Имя профиля
 * @param {String} data.about Описание профиля
 * @param {String} data.avatar URL картинки профиля
 * @param {String} data._id Id пользователя
 * @param {Object} extraData Дополнительные данные
 * @param settings
 */
function onLoadAndSetProfileAPI(result, data, extraData, settings) {
  if (result) {
    settings.apiIdUser = data['_id'];
    editProfile(data, result, settings.bindProfile);
  }
  else showMessage('Ошибка при загрузке', data['error'], 'Понятно'); // Ошибка при загрузке
}

/**
 * Обработка загрузки Карт через API
 *
 * @callback onLoadCardsAPI
 * @param {Boolean} result результат запроса
 * @param {Object} data Данные запроса
 * @param {String} data.error Ошибка при result = false
 * @param {String} data.name Имя профиля
 * @param {String} data.about Описание профиля
 * @param {String} data.avatar URL картинки профиля
 * @param {Object} extraData Дополнительные данные
 * @param settings
 */
function onLoadCardsAPI(result, data, extraData, settings) {
  if (result) initPlaces(data, settings, false, objParam);
  else showMessage('Ошибка при загрузке', data['error'], 'Понятно'); // Ошибка при загрузке
}

/**
 * Обработка добавления Карты через API
 *
 * @callback onAddCardAPI
 * @param {Boolean} result результат запроса
 * @param {Object} data Данные запроса
 * @param {String} data.error Ошибка при result = false
 * @param {String} data.name Имя карты
 * @param {String} data.link URL картинки карты
 */
function onAddCardAPI(result, data) {
  if (result) {
    const arrayData = [data];
    createNewCard(arrayData, result);
  }
  else showMessage('Ошибка при загрузке', data['error'], 'Понятно'); // Ошибка при загрузке
}

/**
 * Обработка удаления Карты через API
 *
 * @callback onDeleteCardAPI
 * @param {Boolean} result результат запроса
 * @param {Object} data Данные запроса
 * @param {String} data.error Ошибка при result = false
 * @param {String} data.name Имя карты
 * @param {String} data.link URL картинки карты
 * @param {Object} extraData Дополнительные данные
 */
function onDeleteCardAPI(result, data, extraData) {
  if (result) removeCard(extraData.elementPlace);
  else showMessage('Ошибка при загрузке', data['error'], 'Понятно'); // Ошибка при загрузке
}

/**
 * Обработка установки/снятия лайка с Карты через API
 *
 * @callback onLikeAPI
 * @param {Boolean} result результат запроса
 * @param {Object} data Данные запроса
 * @param {String} data.error Ошибка при result = false
 * @param {String} data.name Имя карты
 * @param {String} data.link URL картинки карты
 * @param {Array} data.likes Лайки на карте
 * @param {Object} extraData Дополнительные данные
 * @param {HTMLElement} extraData.element Кнопка лайка
 * */
function onLikeAPI(result, data, extraData) {
  if (result) {
    // Количество лайков
    extraData.elementLike.parentElement.querySelector(settings.classLikesCount)
      .textContent = data['likes'].length.toString();
    likeCard (extraData.elementLike, settings);
    initialLike(extraData.elementCard, data, settings);
    //console.log(data, extraData);
  }
  else showMessage('Ошибка при загрузке', data['error'], 'Понятно'); // Ошибка при загрузке
}

/**
 * Обработка обновления аватара через API
 *
 * @callback onEditAvatarAPI
 * @param {Boolean} result результат запроса
 * @param {Object} data Данные запроса
 * @param {String} data.error Ошибка при result = false
 * @param {String} data.name Имя карты
 * @param {String} data.link URL картинки карты
 * @param {Array} data.likes Лайки на карте
 * */
function onEditAvatarAPI(result, data) {
  if (result) editProfile(data, result, settings.bindProfile);
  else showMessage('Ошибка при загрузке', data['error'], 'Понятно'); // Ошибка при загрузке
}

// Стартуем
/**
 * callback'и для окна "Редактировать профиль"
 *
 * @type {object} callback'и для окна "Редактировать профиль"
 */
const objListener = {
  close: closeWindow,
  closeUp: closeWindowMouseUp,
};
/**
 * Параметры для создания карт
 *
 * @type {object} callback'и для окна "Редактировать профиль"
 */
const objParam = {
  cardTemplate,
  placesContainer,
  onOpenPreview,
  onDeleteCard,
  onLikeCard,
};

// 1. Загрузки через API
//    а. Профиль и карты
getProfileAndCard(onLoadAndSetProfileAPI, onLoadCardsAPI, settings);

// 2. Инициализация модальных окон
//    а. Окно "Редактировать профиль"
// Обработка результатов формы
formProfile.addEventListener("submit", submitProfile);

setModalWindowEventListeners(windowProfile, settings, objListener);

//    б. Окно "Добавить карту"
// Обработка результатов формы
formCard.addEventListener("submit", submitCard);

setModalWindowEventListeners(windowCard, settings, objListener);

//    в. Окно "Показ картинки"
setModalWindowEventListeners(windowImage, settings, objListener);

//    г. Окно "Обновить аватар"
// Обработка результатов формы
formAvatar.addEventListener("submit", submitAvatar);

setModalWindowEventListeners(windowAvatar, settings, objListener);

//    д. Окно "Всякие сообщения"
// Обработка результатов формы
buttonMessage.addEventListener('click', clickMessageButton);

setModalWindowEventListeners(windowMessage, settings, objListener);

// 3. Инициализация валидации
enableValidation(settings);
