import '../pages/index.css';                                                  // Импорт главного файла стилей

import {settings} from '../components/settings.js';                           // Настройки проекта
import {initialCards} from '../components/cards.js';                          // Импорт описания карточек
import {initPlaces} from '../components/card.js';                             // Функция для создания карточек при инициализации
// Обработка окон
import {showPopup, closePopup, verifyEventMouseUp, verifyEventKeyDown, setModalWindowEventListeners} from '../components/modal.js';

/** Заготовка */
const cardTemplate = document.querySelector(settings.idTemplate).content;

/** DOM узлы по потребности */
const placesContainer = document.querySelector(settings.classPlacesList);      // Место для укладки карт
const windowProfile = document.querySelector(settings.classWindowEditProfile); // Окно "Редактировать профиль"
const formProfile = windowProfile.querySelector(settings.classForm);           // Форма "Редактировать профиль"
const windowCard = document.querySelector(settings.classWindowAddCard);        // Окно "Добавить карточку"
const formCard = windowCard.querySelector(settings.classForm);                 // Форма "Добавить карточку"
const windowImage = document.querySelector(settings.classWindowViewImage);     // Окно "Показать картинку"
const viewImage= windowImage.querySelector(settings.classViewImage);           // Изображение на форме "Показать картинку"

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
 * Результат формы для добавления данных на страницу
 *
 * @param {HTMLElement} elementWindow Окно формы
 * @param {Object[]} bindFields связки полей
 * @param {string} bindFields.classPage Класс элемента из которого нужно взять значение
 * @param {string} bindFields.nameForm Имя на форме, куда нужно записать значение
 */
function editProfile(elementWindow, bindFields) {
  // Обработка
  const nameForm = findForm(elementWindow);
  if (nameForm === '') return;

  // Из формы на страницу по настройке
  bindFields.forEach(function (element) {
    const textElement = document.querySelector(element.classPage);
    if (textElement === null) return;

    textElement.textContent = document.forms[nameForm].elements[element.nameForm].value;
  });
}

/**
 * Результат формы для добавления карточки на страницу
 *
 * @param {Element} windowCard Окно формы
 * @param {Object[]} bindFields связки полей
 * @param {string} bindFields.name Имя объекта для создания карточки
 * @param {string} bindFields.nameForm Имя на форме, откуда взять значение
 */
function createNewCard(windowCard,bindFields) {
  // Обработка
  const nameForm = findForm(windowCard);
  if (nameForm === '') return;

  // Из формы в объект по настройке
  const card = {};
  bindFields.forEach(function (element) {
    card[element.name] = document.forms[nameForm].elements[element.nameForm].value;
  });
  const initCards= [card];

  const objParam = {
    cardTemplate,
    placesContainer,
    onOpenPreview,
  };
  initPlaces(initCards, settings, true, objParam);
}

/**
 *  Закончил работу с формами
 */

/**
 * Запуск окна "Редактировать профиль"
 */
function openProfile() {
  // Инициализировать поля
  initPopup(windowProfile, settings.bindProfile);

  showPopup(windowProfile, settings, closeProfileKey);
}

/**
 * Закрыть окно "Редактировать профиль" по клику вне окна
 *
 * @param {Event} event Событие 'mouseup'
 */
function closeProfileUp(event) {
  if (verifyEventMouseUp(event, settings)) closeProfile(event);
}

/**
 * Закрыть окно "Редактировать профиль" по клавише
 *
 * @param {Event} event Событие 'keydown'
 */
function closeProfileKey(event) {
  if (verifyEventKeyDown(event, settings)) closeProfile(event);
}

/**
 * Закрыть окно "Редактировать профиль"
 *
 */
function closeProfile() {
  closePopup(windowProfile, settings, closeProfileKey);

  // ... и почистить форму
  clearForm(windowProfile);
}

/**
 * Обработка формы "Редактировать профиль"
 *
 * @param {Event} event Событие 'submit'
 */
function submitProfile(event) {
  event.preventDefault();

  editProfile(windowProfile, settings.bindProfile)
  closePopup(windowProfile, settings, closeProfileKey);
  // ... и почистить форму
  clearForm(windowProfile);
}

/**
 * Запуск окна "Добавить карточку"
 *
 */
function openAddCard() {
  showPopup(windowCard, settings, closeAddCardKey);
}

/**
 * Закрыть окно "Добавить карточку" по клику вне окна
 *
 * @param {Event} event Событие 'mouseup'
 */
function closeAddCardUp(event) {
  if (verifyEventMouseUp(event, settings)) closeAddCard(event);
}

/**
 * Закрыть окно "Добавить карточку" по клавише
 *
 * @param {Event} event Событие 'keydown' на кнопке 'Лайк'
 */
function closeAddCardKey(event) {
  if (verifyEventKeyDown(event, settings)) closeAddCard(event);
}

/**
 * Закрыть окно "Добавить карточку"
 *
 */
function closeAddCard() {
  closePopup(windowCard, settings, closeAddCardKey);

  // ... и почистить форму
  clearForm(windowCard);
}

/**
 * Обработка формы "Редактировать профиль"
 *
 * @param {Event} event Событие 'submit'
 */
function submitCard(event) {
  event.preventDefault();

  createNewCard(windowCard, settings.bindCard);
  closePopup(windowCard, settings, closeAddCardKey);
  // ... и почистить форму
  clearForm(windowCard);
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
 * Закрыть окно "Добавить карточку" по клику вне окна
 *
 * @param {Event} event Событие 'mouseup'
 */
function closeOpenPreviewUp(event) {
  if (verifyEventMouseUp(event, settings)) closeOpenPreview(event);
}

/**
 * Закрыть окно "Добавить карточку" по клавише
 *
 * @param {Event} event Событие 'keydown'
 */
function closeOpenPreviewKey(event) {
  if (verifyEventKeyDown(event, settings)) closeOpenPreview(event);
}

/**
 * Закрыть окно "Показ картинки"
 *
 */
function closeOpenPreview() {
  closePopup(windowImage, settings, closeOpenPreviewKey);
}

// Стартуем
// 1. Инициализация модального окна
//    а. Окно "Редактировать профиль"
// Обработка результатов формы
formProfile.addEventListener("submit", submitProfile);

/**
 * callback'и для окна "Редактировать профиль"
 *
 * @type {object} callback'и для окна "Редактировать профиль"
 */
const objListenerProfile = {
  close: closeProfile,
  closeUp: closeProfileUp,
};
setModalWindowEventListeners(windowProfile, settings, objListenerProfile);

//    б. Окно "Добавить карточку"
// Обработка результатов формы
formCard.addEventListener("submit", submitCard);

/**
 * callback'и для окна "Добавить карточку"
 *
 * @type {object} callback'и для окна "Добавить карточку"
 */
const objListenerAddCard = {
  close: closeAddCard,
  closeUp: closeAddCardUp,
};
setModalWindowEventListeners(windowCard, settings, objListenerAddCard);

//    в. Окно "Показ картинки"
/**
 * callback'и для окна "Показ картинки в отдельном окне"
 *
 * @type {object} callback'и для окна "Показ картинки в отдельном окне"
 */
const objListenerOpenPreview = {
  close: closeOpenPreview,
  closeUp: closeOpenPreviewUp,
}
setModalWindowEventListeners(windowImage, settings, objListenerOpenPreview);

// 2. Вывести карточки на страницу
const objParam = {
  cardTemplate,
  placesContainer,
  onOpenPreview,
};
initPlaces(initialCards, settings, false, objParam);
