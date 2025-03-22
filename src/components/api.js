/*
 Общение с API
 */

/**
 * Обратиться к API
 *
 * @param {Object} promises горстка promis'ов
 * @param {Array} callbacks Обработчики для promis'ов
 * @param {Object} extraData дополнительные данные для callback'ов
 * @param {Object} settings Настройки
 */
function callAPI(promises, callbacks, extraData, settings) {
  Promise.all(promises)
    .then((res) =>{
      res.forEach((response, index) => {
        response.json().then((data) => {
          if (typeof data[settings.messageField] !== 'undefined') {  // Что-то пошло не так
            callbacks[index](false, {error: data[settings.messageField]}, extraData, settings);
          } else {
            callbacks[index](true, data, extraData, settings);
          }
        })
        .catch((err) => {
          callbacks[0](false, {error: err}, extraData, settings);
        });
      })
    })
    .catch((err) => {
      callbacks[0](false, {error: err}, extraData, settings);
    });
}

/**
 * Получить из API профиль и карты
 *
 * @param {onLoadAndSetProfileAPI} onLoadAndSetProfileAPI Функция обработки результатов запроса профиля
 * @param {onLoadCardsAPI} onLoadCardsAPI Функция обработки результатов запроса карт
 * @param {Object} settings Настройки
 */
export function getProfileAndCard(onLoadAndSetProfileAPI, onLoadCardsAPI, settings) {
  const promiseAll = [
    fetch(`${settings.apiURL}${settings.apiIdGroup}/${settings.methodProfile}`, {
      headers: {
        authorization: settings.apiToken,
      }
    }),
    fetch(`${settings.apiURL}${settings.apiIdGroup}/${settings.methodCard}`, {
      headers: {
        authorization: settings.apiToken,
      }
    }),

  ];
  const callbacks = [
    onLoadAndSetProfileAPI,
    onLoadCardsAPI,
  ];
  callAPI(promiseAll, callbacks, null, settings);
}

/**
 * Отправить в API профиль
 *
 * @param {onSetProfileAPI} onSetProfileAPI Функция обработки результатов отправки профиля
 * @param {Object} data Данные профиля
 * @param {String} data.name Имя профиля
 * @param {String} data.about Описание профиля
 * @param {Object} settings Настройки
 */
export function setProfile(onSetProfileAPI, data, settings) {
  const promiseAll = [
    fetch(`${settings.apiURL}${settings.apiIdGroup}/${settings.methodProfile}`, {
      method: 'PATCH',
      headers: {
        authorization: settings.apiToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      })
    })
  ]
  const callbacks = [
    onSetProfileAPI
  ];
  callAPI(promiseAll, callbacks, null, settings);
}

/**
 * Отправить в API новую карту
 *
 * @param {onSetCardAPI} onSetCardAPI Функция обработки результатов отправки карты
 * @param {Object} data Данные профиля
 * @param {String} data.name Имя профиля
 * @param {String} data.link URL карты
 * @param {Object} settings Настройки
 */
export function setCard(onSetCardAPI, data, settings) {
  const promiseAll = [
    fetch(`${settings.apiURL}${settings.apiIdGroup}/${settings.methodCard}`, {
      method: 'POST',
      headers: {
        authorization: settings.apiToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      })
    })
  ]
  const callbacks = [
    onSetCardAPI
  ];
  callAPI(promiseAll, callbacks, null, settings);
}

/**
 * Удалить в API карту
 *
 * @param {onDeleteCardAPI} onDeleteCardAPI Функция обработки результатов удаления карты
 * @param {Object} data Данные карты
 * @param {String} data.id Id карты
 * @param {HTMLElement} data.element Карта для удаления
 * @param {Object} settings Настройки
 */
export function deleteCard(onDeleteCardAPI, data, settings) {
  const promiseAll = [
    fetch(`${settings.apiURL}${settings.apiIdGroup}/${settings.methodCard}/${data.id}`, {
      method: 'DELETE',
      headers: {
        authorization: settings.apiToken,
      },
    })
  ]
  const callbacks = [
    onDeleteCardAPI
  ];
  callAPI(promiseAll, callbacks, data, settings);
}

/**
 * Отправить лайк на карту в API
 *
 * @param {onSetLikeAPI} onSetLikeAPI Функция обработки результатов удаления карты
 * @param {Object} data Данные карты
 * @param {String} data.id Id карты
 * @param {HTMLElement} data.element Карта для лайка
 * @param {Object} settings Настройки
 */
export function setLike(onSetLikeAPI, data, settings) {
  const promiseAll = [
    fetch(`${settings.apiURL}${settings.apiIdGroup}/${settings.methodLike}/${data.id}`, {
      method: 'PUT',
      headers: {
        authorization: settings.apiToken,
      },
    })
  ]
  const callbacks = [
    onSetLikeAPI
  ];
  callAPI(promiseAll, callbacks, data, settings);
}

/**
 * Отправить удаление лайка на карте в API
 *
 * @param {onDeleteLikeAPI} onDeleteLikeAPI Функция обработки результатов удаления карты
 * @param {Object} data Данные карты
 * @param {String} data.id Id карты
 * @param {HTMLElement} data.element Карта для удаления лайка
 * @param {Object} settings Настройки
 */
export function deleteLike(onDeleteLikeAPI, data, settings) {
  const promiseAll = [
    fetch(`${settings.apiURL}${settings.apiIdGroup}/${settings.methodLike}/${data.id}`, {
      method: 'DELETE',
      headers: {
        authorization: settings.apiToken,
      },
    })
  ]
  const callbacks = [
    onDeleteLikeAPI
  ];
  callAPI(promiseAll, callbacks, data, settings);
}
