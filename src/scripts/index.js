import '../pages/index.css';                                                  // Импорт главного файла стилей

import {settings} from '../components/settings.js';                           // Настройки проекта
import {initialCards} from '../components/cards.js';                          // Импорт описания карточек
import {initPlaces} from '../components/card.js';                             // Функция для создания карточек при инициализации
import {showPopup, closePopup} from '../components/modal.js';                 // Обработка окон
import {initPopup, initImage, clearForm, editProfile, editCard} from '../components/forms.js';   // Обработка форм

/** Заготовка */
const cardTemplate = document.querySelector(settings.idTemplate).content;

/** DOM узлы по потребности */
const placesContainer = document.querySelector(settings.classPlacesList);      // Место для укладки карт
const windowProfile = document.querySelector(settings.classWindowEditProfile); // Окно "Редактировать профиль"
const formProfile = windowProfile.querySelector(settings.classForm);           // Форма "Редактировать профиль"
const windowCard = document.querySelector(settings.classWindowAddCard);        // Окно "Добавить карточку"
const formCard = windowCard.querySelector(settings.classForm);                 // Форма "Добавить карточку"
const windowImage = document.querySelector(settings.classWindowViewImage);     // Окно "Показать картинку"

// Редактировать профиль
document.querySelector(settings.classButtonEditProfile).addEventListener('click', openProfile);

// Добавление карточки
document.querySelector(settings.classButtonAddCard).addEventListener('click', openAddCard);

/**
 * Проверка на mouseup вне окна
 *
 * @param {Event} event Событие 'mouseup' на документе
 * @returns {boolean} результат проверки
 */
function checkUp(event) {
  // На окне клацнули? Если да, то не закрываем!
  return event.target.closest(settings.classWindowPopup) === null;
}

/**
 * Проверка нажатой клавиши на документе
 *
 * @param {Event} event Событие 'keydown' на документе
 * @returns {boolean} результат проверки
 */
function checkKey(event) {
  // Поискать клавишу в списке
  return settings.keysClose.findIndex(function (element){
    return element === event.key;
  }) !== -1;
}

const objListenerProfile = {
  close: closeProfile,
  submit: submitProfile,
  closeUp: closeProfileUp,
  closeKey: closeProfileKey,
};

/**
 * Запуск окна "Редактировать профиль"
 *
 * @param {Event} event Событие 'click' на кнопке 'Лайк'
 */
function openProfile(event) {
  event.stopPropagation();

  // Инициализировать поля
  initPopup(windowProfile, settings.bindProfile, settings);

  showPopup(windowProfile, formProfile, settings, objListenerProfile);
}

/**
 * Закрыть окно "Редактировать профиль" по клику вне окна
 *
 * @param {Event} event Событие 'click' на кнопке 'Лайк'
 */
function closeProfileUp(event) {
  if (checkUp(event)) closeProfile(event);
}

/**
 * Закрыть окно "Редактировать профиль" по клавише
 *
 * @param {Event} event Событие 'click' на кнопке 'Лайк'
 */
function closeProfileKey(event) {
  if (checkKey(event)) closeProfile(event);
}

/**
 * Закрыть окно "Редактировать профиль"
 *
 * @param {Event} event Событие 'click' на кнопке 'Лайк'
 */
function closeProfile(event) {
  event.stopPropagation();

  closePopup(windowProfile, formCard, settings, objListenerProfile);

  // ... и почистить форму
  clearForm(windowProfile, settings);
}

/**
 * Обработка формы "Редактировать профиль"
 *
 * @param {Event} event Событие 'click' на кнопке 'Лайк'
 */
function submitProfile(event) {
  event.preventDefault();

  editProfile(windowProfile, settings.bindProfile, settings)
  closePopup(windowProfile, formProfile, settings, objListenerProfile);
  // ... и почистить форму
  clearForm(windowProfile, settings);
}

const objListenerAddCard = {
  close: closeAddCard,
  submit: submitCard,
  closeUp: closeAddCardUp,
  closeKey: closeAddCardKey,
};

/**
 * Запуск окна "Добавить карточку"
 *
 * @param {Event} event Событие 'click' на кнопке 'Лайк'
 */
function openAddCard(event) {
  event.stopPropagation();

  showPopup(windowCard, formCard, settings, objListenerAddCard);
}

/**
 * Закрыть окно "Добавить карточку" по клику вне окна
 *
 * @param {Event} event Событие 'click' на кнопке 'Лайк'
 */
function closeAddCardUp(event) {
  if (checkUp(event)) closeAddCard(event);
}

/**
 * Закрыть окно "Добавить карточку" по клавише
 *
 * @param {Event} event Событие 'click' на кнопке 'Лайк'
 */
function closeAddCardKey(event) {
  if (checkKey(event)) closeAddCard(event);
}

/**
 * Закрыть окно "Добавить карточку"
 *
 * @param {Event} event Событие 'click' на кнопке 'Лайк'
 */
function closeAddCard(event) {
  event.stopPropagation();

  closePopup(windowCard, formCard, settings, objListenerAddCard);

  // ... и почистить форму
  clearForm(windowCard, settings);
}

/**
 * Обработка формы "Редактировать профиль"
 *
 * @param {Event} event Событие 'click' на кнопке 'Лайк'
 */
function submitCard(event) {
  event.preventDefault();

  const objParam = {
    windowCard,
    initPlaces,
    onOpenPreview,
  }

  editCard(settings, settings.bindCard, objParam);
  closePopup(windowCard, formCard, settings, objListenerAddCard);
  // ... и почистить форму
  clearForm(windowCard, settings);
}

const objListenerOpenPreview = {
  close: closeOpenPreview,
  submit: null,
  closeUp: closeOpenPreviewUp,
  closeKey: closeOpenPreviewKey,
}

/**
 * Показ картинки в отдельном окне
 *
 * @callback onOpenPreview
 * @param {Event} event Событие 'click' на кнопке 'Лайк'
 */
function onOpenPreview(event) {
  event.stopPropagation();

  // Инициализировать картинку
  initImage(windowImage, event.target, settings);

  showPopup(windowImage, null, settings, objListenerOpenPreview);
}

/**
 * Закрыть окно "Добавить карточку" по клику вне окна
 *
 * @param {Event} event Событие 'click' на кнопке 'Лайк'
 */
function closeOpenPreviewUp(event) {
  if (checkUp(event)) closeOpenPreview(event);
}

/**
 * Закрыть окно "Добавить карточку" по клавише
 *
 * @param {Event} event Событие 'click' на кнопке 'Лайк'
 */
function closeOpenPreviewKey(event) {
  if (checkKey(event)) closeOpenPreview(event);
}

/**
 * Закрыть окно "Показ картинки"
 *
 * @param {Event} event Событие 'click' на кнопке 'Лайк'
 */
function closeOpenPreview(event) {
  event.stopPropagation();

  closePopup(windowImage, null, settings, objListenerOpenPreview);
}

// Стартуем
// 1. Вывести карточки на страницу
const objParam = {
  cardTemplate,
  placesContainer,
  onOpenPreview,
};
initPlaces(initialCards, settings, false, objParam);
