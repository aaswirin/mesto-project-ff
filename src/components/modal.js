/*
 Модальные окна
 */

/**
 * Проверка на mouseup вне модальном окне
 *
 * @param {Event} event Событие 'mouseup' на документе
 * @param {Object} settings Настройки
 * @returns {boolean} результат проверки
 */
export function verifyEventMouseUp(event, settings) {
  // На окне клацнули? Если да, то не закрываем!
  return event.target.closest(settings.classWindowPopup) === null;
}

/**
 * Проверка нажатой клавиши на модальном окне
 *
 * @param {Event} event Событие 'keydown' на документе
 * @param {Object} settings Настройки
 * @returns {boolean} результат проверки
 */
export function verifyEventKeyDown(event, settings) {
  // Поискать клавишу в списке
  return settings.keysClose.findIndex(function (element) {
    return element === event.key;
  }) !== -1;
}

/**
 * Инициализация модального окна
 *
 * @param {HTMLElement} elementWindow Окно для поднятия
 * @param {Object} settings Настройки
 * @param {Object} objListener Слушатели
 * @param {function} objListener.close Закрытие по клику
 * @param {function} objListener.closeUp Закрытие по клику вне окна
 */
export function setModalWindowEventListeners(elementWindow, settings, objListener) {
  // Обеспечить анимацию
  elementWindow.classList.add(settings.classWindowAnimatedNotDot);
  // Обеспечить закрытие по крестику
  elementWindow.querySelector(settings.classElementClose)
    .addEventListener('click',  () => objListener.close(elementWindow, objListener.close));
  // Для снятия открытого окна по клику вне окна
  elementWindow
    .addEventListener('mouseup', event => objListener.closeUp(event, elementWindow, objListener.closeUp));
  // Для снятия сетевой ошибки
  const elementNetError = elementWindow.querySelector(settings.classNetError);
  if (elementNetError !== null) {
    elementNetError.querySelector(settings.classNetErrorClose).addEventListener('click', () => {
      elementNetError.classList.remove(settings.classNetErrorShow);
    });
  }
}

/**
 * Поднятие окна
 *
 * @param {HTMLElement} elementWindow Окно для поднятия
 * @param {Object} settings Настройки
 * @param {function} functionCloseKey Функция для снятия окна по клавише
 */
export function showPopup(elementWindow, settings, functionCloseKey) {
  // Показать окно
  elementWindow.classList.add(settings.classWindowOpenNotDot);
  // Для снятия открытого окна по клавише
  document.addEventListener('keydown', functionCloseKey);
}

/**
 * Закрытие окна
 *
 * @param {HTMLElement} elementWindow Окно для поднятия
 * @param {Object} settings Настройки
 * @param {function} functionCloseKey Функция для снятия окна по клавише
 */
export function closePopup(elementWindow, settings,functionCloseKey) {
  // Закрыть окно
  elementWindow.classList.remove(settings.classWindowOpenNotDot);
  // Для снятия открытого окна по клавише
  document.removeEventListener('keydown', functionCloseKey);
}
