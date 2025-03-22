/*
 Главная, отсюда всё и начинается
 */

import '../pages/index.css';                                                  // Импорт главного файла стилей

import {settings} from '../components/settings.js';                           // Настройки проекта
import {initPlaces, likeCard, removeCard} from '../components/card.js';                             // Функция для создания карточек при инициализации
// Обработка окон
import {showPopup, closePopup, verifyEventMouseUp, verifyEventKeyDown, setModalWindowEventListeners} from '../components/modal.js';
// Валидация
import {enableValidation, clearValidation, buttonSetState} from '../components/validation.js';
// API
import {getProfileAndCard, setProfile, setCard, deleteCard} from '../components/api.js';


/** Заготовка */
const cardTemplate = document.querySelector(settings.idTemplate).content;

/** DOM узлы по потребности */
const placesContainer = document.querySelector(settings.classPlacesList);       // Место для укладки карт

const windowProfile = document.querySelector(settings.classWindowEditProfile);  // Окно "Редактировать профиль"
const formProfile = windowProfile.querySelector(settings.classForm);            // Форма "Редактировать профиль"
const buttonProfile = formProfile.querySelector(settings.classSubmitButton);    // Кнопка "Редактировать профиль"

const windowCard = document.querySelector(settings.classWindowAddCard);         // Окно "Добавить карточку"
const formCard = windowCard.querySelector(settings.classForm);                  // Форма "Добавить карточку"
const buttonCard = formCard.querySelector(settings.classSubmitButton);          // Кнопка "Добавить карточку"

const windowImage = document.querySelector(settings.classWindowViewImage);      // Окно "Показать картинку"
const viewImage= windowImage.querySelector(settings.classViewImage);            // Изображение на форме "Показать картинку"

// Редактировать профиль
document.querySelector(settings.classButtonEditProfile).addEventListener('click', openProfile);

// Добавление карточки
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
  // Напихать в окно всё из карточки
  viewImage.setAttribute('src', elementImages.getAttribute('src'));
  viewImage.setAttribute('alt', elementImages.getAttribute('alt'));

  // Поискать карточку выше и выше, вдруг враги разметку поменяли
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
 * @param {string} bindFields.nameForm Имя на форме, куда нужно записать значение
 * @param {string} bindFields.nameAPI Имя в объекте из API
 */
function editProfile(data, result, bindFields) {
  // Из объекта на страницу по настройке
  bindFields.forEach(function (element) {
    const htmlElement = document.querySelector(element.classPage);
    if (htmlElement === null) return;

    let value;
    if (result) value = data[element.nameAPI]
    else value = data['error'];           // Ошибка при загрузке

    if (element.typeElement === 'text') htmlElement.textContent = value;
    else if (element.typeElement === 'image') htmlElement.setAttribute('src', value);
  });
}

/**
 * Результат формы для добавления карточки на страницу
 *
 * @param {Object} data Данные из API, если это после запроса
 * @param {Boolean} result Результат запроса в API
 * */
function createNewCard(data, result) {
  // Обработка
  if (!result) return;
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
 * Запуск окна "Редактировать профиль"
 */
function openProfile() {
  // Инициализировать поля
  initPopup(windowProfile, settings.bindProfile);

  clearValidation(windowProfile, buttonProfile, settings);
  buttonSetState(buttonProfile, false, settings);

  showPopup(windowProfile, settings, closeProfileKey);
}

/**
 * Закрыть окно "Редактировать профиль" по клавише
 *
 * @param {Event} event Событие 'keydown'
 */
function closeProfileKey(event) {
  if (verifyEventKeyDown(event, settings)) closeWindow(windowProfile, closeProfileKey);
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
  setProfile(onLoadAndSetProfileAPI, data, settings);

  closePopup(windowProfile, settings, closeProfileKey);
  // ... и почистить форму
  clearForm(windowProfile);
}

/**
 * Запуск окна "Добавить карточку"
 *
 */
function openAddCard() {
  clearValidation(formCard, buttonCard, settings);

  buttonSetState(buttonCard, true, settings);

  showPopup(windowCard, settings, closeAddCardKey);
}

/**
 * Закрыть окно "Добавить карточку" по клавише
 *
 * @param {Event} event Событие 'keydown' на кнопке 'Лайк'
 */
function closeAddCardKey(event) {
  if (verifyEventKeyDown(event, settings)) closeWindow(windowCard, closeAddCardKey);
}

/**
 * Обработка формы "Добавить карточку"
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
  setCard(onAddCardAPI, data, settings);

  closePopup(windowCard, settings, closeAddCardKey);
  // ... и почистить форму
  clearForm(windowCard);
}

/**
 * Обработка удаления Карты
 *
 * @callback onDeleteCard
 * @param {HTMLElement} elementPlace Карточка
 * @param {String} idCard Id карты
 */
function onDeleteCard(elementPlace, idCard) {
  const data = {
    id: idCard,
    elementPlace: elementPlace,
  };
  deleteCard(onDeleteCardAPI, data, settings)
}

/**
 * Поставить/снять лайк картинки
 * @callback onLikeCard
 * @param {Event} event Событие 'click' на кнопке
 * @param {Object} settings Настройки
 */
const onLikeCard = function (event, settings) {
  if (event.target === null) return;
  likeCard (event.target, settings)
}

/**
 * Показ картинки в отдельном окне
 *
 * @callback onOpenPreview
 * @param {Event} event Событие 'click'
 */
const  onOpenPreview = function(event) {
  // Инициализировать картинку
  initImage(windowImage, event.target);

  showPopup(windowImage, settings, closeOpenPreviewKey);
}

/**
 * Закрыть окно "Добавить карточку" по клавише
 *
 * @param {Event} event Событие 'keydown'
 */
function closeOpenPreviewKey(event) {
  if (verifyEventKeyDown(event, settings)) closeWindow(windowImage, closeOpenPreviewKey);
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
  settings.apiIdUser = data['_id'];
  editProfile(data, result, settings.bindProfile)
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
  initPlaces(data, settings, false, objParam);
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
  const arrayData = [data];
  createNewCard(arrayData, result);
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
  removeCard(extraData.elementPlace);
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

// 2. Инициализация модального окна
//    а. Окно "Редактировать профиль"
// Обработка результатов формы
formProfile.addEventListener("submit", submitProfile);

objListener.closeKey = closeProfileKey;
setModalWindowEventListeners(windowProfile, settings, objListener);

//    б. Окно "Добавить карточку"
// Обработка результатов формы
formCard.addEventListener("submit", submitCard);

objListener.closeKey = closeAddCardKey;
setModalWindowEventListeners(windowCard, settings, objListener);

//    в. Окно "Показ картинки"
objListener.closeKey =  closeOpenPreviewKey;
setModalWindowEventListeners(windowImage, settings, objListener);

// 3. Инициализация валидации
enableValidation(settings);
