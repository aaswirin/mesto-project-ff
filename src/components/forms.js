/**
 * Поиск формы внутри окна
 *
 * @param {HTMLElement} elementWindow Окно формы
 * @param {Object} settings Настройки
 * @return {string} Имя формы
 */
function findForm(elementWindow, settings) {
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
 * @param {Object} settings Настройки
 */
export function initPopup(elementWindow, bindFields, settings) {
  const nameForm = findForm(elementWindow, settings);
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
 * @param {Object} settings Настройки
 */
export function initImage(elementWindow, elementImages, settings) {
  // Напихать в окно всё из карточки
  const viewImage= elementWindow.querySelector(settings.classViewImage);
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
 * @param {Object} settings Настройки
 */
export function clearForm(elementWindow, settings) {
  const nameForm = findForm(elementWindow, settings);
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
 * @param {Object} settings Настройки
 */
export function editProfile(elementWindow, bindFields, settings) {
  // Обработка
  const nameForm = findForm(elementWindow, settings);
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
 * @param {Object} settings Настройки
 * @param {Object[]} bindFields связки полей
 * @param {string} bindFields.name Имя объекта для создания карточки
 * @param {string} bindFields.nameForm Имя на форме, откуда взять значение
 * @param {Element} windowCard Окно формы
 * @param {initPlaces} initPlaces Функция для создания карточек
 * @param {onOpenPreview} onOpenPreview Функция для создания карточек
 */
export function editCard( settings, bindFields,
                           {windowCard,  initPlaces, onOpenPreview} = {}) {
  // Обработка
  const nameForm = findForm(windowCard, settings);
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

  const objParam = {
    cardTemplate,
    placesContainer,
    onOpenPreview,
  };
  initPlaces(initCards, settings, true, objParam);
}
