import {initPlaces} from './card.js';           // Функция для создания карточек при инициализации
import {settings} from './settings.js';         // Настройки проекта

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
 * Поднятие окна
 *
 * @param {Event} event Событие 'click' на кнопке
 * @param {HTMLElement} elementWindow Окно для поднятия
 * @param {Object[]} bindFields связки полей
 * @param {string} bindFields.classPage Класс элемента из которого нужно взять значение
 * @param {string} bindFields.nameForm Имя на форме, куда нужно записать значение
 */
export function showPopup(event, elementWindow, bindFields) {
  // Класс с точкой впереди
  elementWindow.classList.add(settings.classWindowOpen.slice(1));

  // Инициализировать поля
  if (bindFields !== null) initPopup(elementWindow, bindFields);

  // Для снятия открытого окна по клику вне окна
  document.addEventListener('mouseup',  closePopup);
  // Для снятия открытого окна по клавише
  document.addEventListener('keydown', closePopup);
}

/**
 * Закрытие окна
 *
 * @param {Event} event Событие 'click' на элементе
 */
export function closePopup(event) {
  // Есть открытое окно?
  const openedWindow = document.querySelector(settings.classWindowOpen);

  if (openedWindow === null) return;  // Нет открытых окон!

  // Если кликнули вне окна?
  if (event.type === 'mouseup') {
    // На окне клацнули? Если да, то не закрываем!
    if (event.target.closest(settings.classWindowPopup) !== null) return;
  }

  // Клавишу нажали
  if (event.type === 'keydown') {
    // Поискать клавишу в списке
    const index = settings.keysClose.findIndex(function (element){
      return element === event.key;
    });
    if (index === -1) return;  // Не та клавиша
  }

  // Класс с точкой впереди
  openedWindow.classList.remove(settings.classWindowOpen.slice(1));
  event.stopPropagation();
  // ... и почистить форму
  clearForm(openedWindow);

  // ... и снять слушатели, что б лишнего электричества не тратить!
  document.removeEventListener('mouseup',  closePopup);
  document.removeEventListener('keydown',  closePopup);
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
 * Результат формы для добавления данных на страницу
 *
 * @param {Event} event Событие 'submit' на элементе
 * @param {HTMLElement} elementWindow Окно формы
 * @param {Object[]} bindFields связки полей
 * @param {string} bindFields.classPage Класс элемента из которого нужно взять значение
 * @param {string} bindFields.nameForm Имя на форме, куда нужно записать значение
 */
export function submitProfile(event, elementWindow, bindFields) {
  event.preventDefault();

  // Обработка
  const nameForm = findForm(elementWindow);
  if (nameForm === '') return;

  // Из формы на страницу по настройке
  bindFields.forEach(function (element) {
    const textElement = document.querySelector(element.classPage);
    if (textElement === null) return;

    textElement.textContent = document.forms[nameForm].elements[element.nameForm].value;
  });

  closePopup(event);
}

/**
 * Результат формы для добавления карточки на страницу
 *
 * @param {Event} event Событие 'submit' на элементе * @param {Object[]} bindFields связки полей
 * @param {HTMLElement} elementWindow Окно формы
 * @param {Object[]} bindFields связки полей
 * @param {string} bindFields.name Имя объекта для создания карточки
 * @param {string} bindFields.nameForm Имя на форме, откуда взять значение
 */

export function submitCard(event, elementWindow, bindFields) {
  event.preventDefault();

  // Обработка
  const nameForm = findForm(elementWindow);
  if (nameForm === '') return;

  // Из формы в объект по настройке
  const card = {};
  bindFields.forEach(function (element) {
    card[element.name] = document.forms[nameForm].elements[element.nameForm].value;
  });
  const initCards= [card];
  /** Заготовка */
  const cardTemplate = document.querySelector(settings.idTemplate).content;
  /** Место для укладки карт */
  const placesContainer = document.querySelector(settings.classPlacesList);

  initPlaces(initCards, cardTemplate, placesContainer, true);
  closePopup(event);
}
