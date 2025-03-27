/*
 Валидация
 */

/**
 * Включение валидации
 *
 * @param {Object} settings Настройки
 */
export function enableValidation(settings) {
  // Все формы
  const formList = Array.from(document.querySelectorAll(settings.classForm));

  formList.forEach((elementForm) => {
    const elementButton = elementForm.querySelector(settings.classSubmitButton);
    setEventListeners(elementForm, elementButton, settings);
  });
}
/**
 * Очистка ошибок валидации для формы
 *
 * @param {HTMLElement} elementForm Форма для валидации
 * @param {HTMLElement} elementButton Кнопка формы
 * @param {Object} settings Настройки
 */
export function clearValidation(elementForm, elementButton, settings) {
  // Все поля внутри формы
  const listInput = Array.from(elementForm.querySelectorAll(settings.classInput));

  listInput.forEach((elementInput) => {
    hideInputError(elementInput, settings)  });

  // Переключить кнопку
  toggleStateButton(listInput, elementButton, settings);
  // Убрать показ загрузки
  elementButton.querySelector(settings.classSubmitLabel).textContent = "Сохранить";
  elementButton.querySelector(settings.classSpinner).classList.remove(settings.classSpinnerVisible);
}

/**
 * Установка валидации на все поля
 *
 * @param {HTMLElement} elementForm Форма для валидации
 * @param {HTMLElement} elementButton Кнопка формы
 * @param {Object} settings Настройки
 */
function setEventListeners(elementForm, elementButton, settings) {
  // Все поля внутри формы
  const listInput = Array.from(elementForm.querySelectorAll(settings.classInput));

  listInput.forEach((elementInput) => {
    elementInput.addEventListener('input', () => {
      isValid(elementForm, elementInput, listInput, elementButton, settings);
    });
  });
}

/**
 * Проверка правильности введённых данных
 *
 * @param {HTMLElement} elementForm Форма
 * @param {HTMLElement} elementInput Поле ввода
 * @param {Array} listInput Список полей ввода
 * @param {HTMLElement} elementButton Кнопка на форме
 * @param {Object} settings Настройки
 */
function isValid(elementForm, elementInput, listInput, elementButton, settings) {
  if (elementInput.validity.patternMismatch) {
    elementInput.setCustomValidity(elementInput.dataset.errorMessage);
  } else {
    elementInput.setCustomValidity("");
  }

  if (!elementInput.validity.valid) {
    showInputError(elementInput, elementInput.validationMessage, settings);
  } else {
    hideInputError(elementInput, settings);
  }

  // Переключить кнопку
  toggleStateButton(listInput, elementButton, settings);
}

/**
 * Добавить класс с ошибкой
 *
 * @param {HTMLElement} elementInput Поле ввода
 * @param {String} errorMessage Сообщение об ошибке валидации
 * @param {Object} settings Настройки
 */
function showInputError(elementInput, errorMessage, settings) {
  const containerError = document.querySelector(`.popup__input-error-${elementInput.id}`);
  elementInput.classList.add(settings.classErrorValidation);
  // Прописать ошибку
  containerError.textContent = errorMessage;
  containerError.classList.add(settings.classValidationContainer);
}

/**
 * Удалить класс с ошибкой
 * @param {HTMLElement} elementInput Поле ввода
 * @param {Object} settings Настройки
 */
function hideInputError(elementInput, settings) {
  const containerError = document.querySelector(`.popup__input-error-${elementInput.id}`);
  elementInput.classList.remove(settings.classErrorValidation);
  containerError.textContent = '';
  containerError.classList.remove(settings.classValidationContainer);
}

/**
 * Проверить валидность полей на форме
 *
 * @param {Array} listInput Список полей ввода
 */
function hasInvalidForm(listInput) {
  // проход по полям на форме
  return listInput.some((elementInput) => {
    return !elementInput.validity.valid;
  })
}

/**
 * Переключить кнопку
 *
 * @param {Array} listInput Список полей ввода
 * @param {HTMLElement} elementButton Кнопка на форме
 * @param {Object} settings Настройки
 */
function toggleStateButton(listInput, elementButton, settings) {
  buttonSetState(elementButton, hasInvalidForm(listInput), settings);
}

/**
 * Проверка правильности введённых данных
 *
 * @param {HTMLElement} elementButton Кнопка на форме
 * @param {Boolean} disabled Установить в disabled
 * @param {Object} settings Настройки
 */
export function buttonSetState(elementButton, disabled, settings) {
  elementButton.disabled = disabled;
  if (disabled)  elementButton.classList.add(settings.classButtonInActive);
  else elementButton.classList.remove(settings.classButtonInActive);
}
