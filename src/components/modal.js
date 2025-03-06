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
  elementWindow.querySelector(settings.classElementClose).addEventListener('click',  objListener.close);
  // Для снятия открытого окна по клику вне окна
  elementWindow.addEventListener('mouseup', objListener.closeUp);
}

/**
 * Поднятие окна
 *
 * @param {HTMLElement} elementWindow Окно для поднятия
 * @param {Object} settings Настройки
 * @param {function} closeKey
 */
export function showPopup(elementWindow, settings, closeKey) {
  // Показать окно
  elementWindow.classList.add(settings.classWindowOpenNotDot);
  // Для снятия открытого окна по клавише
  document.addEventListener('keydown', closeKey);
}

/**
 * Закрытие окна
 *
 * @param {HTMLElement} elementWindow Окно для поднятия
 * @param {Object} settings Настройки
 * @param {function} closeKey
 */
export function closePopup(elementWindow, settings,closeKey) {
  // Закрыть окно
  elementWindow.classList.remove(settings.classWindowOpenNotDot);
  // Для снятия открытого окна по клавише
  document.removeEventListener('keydown', closeKey);
}
