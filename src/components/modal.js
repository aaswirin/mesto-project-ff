/**
 * Поднятие окна
 *
 * @param {HTMLElement} elementWindow Окно для поднятия
 * @param {HTMLElement} elementForm Форма
 * @param {Object} settings Настройки
 * @param {Object} objListener Слушатели
 * @param {function} objListener.close Закрытие по клику
 * @param {function} objListener.submit Отправка
 * @param {function} objListener.closeUp Закрытие по клику вне окна
 * @param {function} objListener.closeKey Закрытие по клавише
 */
export function showPopup(elementWindow, elementForm, settings, objListener) {
  // Обеспечить закрытие
  elementWindow.querySelector(settings.classElementClose).addEventListener('click',  objListener.close);
  // Обработка результатов формы
  if (objListener.submit !== null) {
    elementForm.addEventListener("submit",objListener.submit);
  }
  // Для снятия открытого окна по клику вне окна
  document.addEventListener('mouseup', objListener.closeUp);
  // Для снятия открытого окна по клавише
  document.addEventListener('keydown', objListener.closeKey);

  // Показать окно
  elementWindow.classList.add(settings.classWindowOpenNotDot);
}

/**
 * Закрытие окна
 *
 * @param {HTMLElement} elementWindow Окно для поднятия
 * @param {HTMLElement} elementForm Форма
 * @param {Object} settings Настройки
 * @param {Object} objListener Слушатели
 * @param {function} objListener.close Закрытие по клику
 * @param {function} objListener.submit Отправка
 * @param {function} objListener.closeUp Закрытие по клику вне окна
 * @param {function} objListener.closeKey Закрытие по клавише */
export function closePopup(elementWindow, elementForm, settings, objListener) {
  // Закрыть окно
  elementWindow.classList.remove(settings.classWindowOpenNotDot);

  // ... и снять слушатели, что б лишнего электричества не тратить!
  elementWindow.querySelector(settings.classElementClose).removeEventListener('click', objListener.close);
  if (objListener.submit !== null) {
    elementForm
      .removeEventListener("submit", event => objListener.submit(event, elementWindow, settings.bindProfile, settings));
  }
  document.removeEventListener('mouseup', objListener.closeUp);
  document.removeEventListener('keydown', objListener.closeKey);
}
