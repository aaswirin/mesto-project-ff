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
function callingAPI(promises, callbacks, extraData, settings) {
  Promise.all(promises)
    .then((res) =>{
      res.forEach((response, index) => {
        response.json()
          .then((data) => {
            if (res[index].ok) {
              callbacks[index](true, data, extraData, settings);
            } else {
              let error = `Ошибка ${res[index].status}`;
              // Уточнить ошибку
              if (typeof data.message !== 'undefined') {
                error = error + `: ${data.message}`;
              }
              return Promise.reject(error);
            }
          })
          .catch((err) => {
            callbacks[0](false, {error: err}, extraData, settings);
          });
        });
      })
      .catch((err) => {
        callbacks[0](false, {error: err}, extraData, settings);
      });
}

/**
 * Собрать параметры для вызова API
 *
 * @param {Object} params Параметры
 * @param {String} params.nameMethod Имя метода в API
 * @param {String} params.method Метод вызова
 * @param {Object} params.body Тело запроса
 * @param {String} params.id Id для запросов
 * @param {Object} settings Настройки
 * @return {Promise} Сформированный промис
 */
function buildPromiseCall(params, settings) {
  let url = `${settings.apiURL}${settings.apiIdGroup}/${params.nameMethod}`;

  const options = {
      method: params.method,
      headers: {
        authorization: settings.apiToken,
      },
    };

  if (params.id !== null) {
    url = url + `/${params.id}`;
  }
  if (params.body !== null) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(params.body);
  }

  return fetch(url, options)
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
    buildPromiseCall({nameMethod: settings.methodProfile, method: 'GET', body: null, id: null}, settings),
    buildPromiseCall({nameMethod: settings.methodCard, method: 'GET', body: null, id: null}, settings),
  ];

  const callbacks = [
    onLoadAndSetProfileAPI,
    onLoadCardsAPI,
  ];
  callingAPI(promiseAll, callbacks, null, settings);
}

/**
 * Отправить в API профиль
 *
 * @param {onSetProfileAPI} onSetProfileAPI Функция обработки результатов отправки профиля
 * @param {Object} data Данные профиля
 * @param {String} data.name Имя профиля
 * @param {String} data.about Описание профиля
 * @param {HTMLElement} data.buttonSubmit Кнопка "Сохранить"
 * @param {Object} settings Настройки
 */
export function setProfile(onSetProfileAPI, data, settings) {
  const promiseAll = [
    buildPromiseCall(
      {nameMethod: settings.methodProfile, method: 'PATCH',
        body: {name: data.name, about: data.about}, id: null},
      settings),
  ];

  const callbacks = [
    onSetProfileAPI
  ];

  data.buttonSubmit.querySelector(settings.classSubmitLabel).textContent = "Сохранить...";
  data.buttonSubmit.querySelector(settings.classSpinner).classList.add(settings.classSpinnerVisible);
  callingAPI(promiseAll, callbacks, null, settings);
}

/**
 * Отправить в API новую карту
 *
 * @param {onSetCardAPI} onSetCardAPI Функция обработки результатов отправки карты
 * @param {Object} data Данные карты
 * @param {String} data.name Имя карты
 * @param {String} data.link URL карты
 * @param {HTMLElement} data.buttonSubmit Кнопка "Сохранить"
 * @param {Object} settings Настройки
 */
export function setCard(onSetCardAPI, data, settings) {
  const promiseAll = [
    buildPromiseCall(
      {nameMethod: settings.methodCard, method: 'POST', body: {name: data.name, link: data.link}, id: null},
      settings),
  ];

  const callbacks = [
    onSetCardAPI
  ];

  data.buttonSubmit.querySelector(settings.classSubmitLabel).textContent = "Сохранить...";
  data.buttonSubmit.querySelector(settings.classSpinner).classList.add(settings.classSpinnerVisible);
  callingAPI(promiseAll, callbacks, null, settings);
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
    buildPromiseCall({nameMethod: settings.methodCard, method: 'DELETE', body: null, id: data.id}, settings),
  ];

  const callbacks = [
    onDeleteCardAPI
  ];
  callingAPI(promiseAll, callbacks, data, settings);
}

/**
 * Отправить лайк на карту в API
 *
 * @param {onSetLikeAPI} onSetLikeAPI Функция обработки результатов удаления карты
 * @param {Object} data Данные карты
 * @param {String} data.id Id карты
 * @param {HTMLElement} data.elementCard Карта лайка
 * @param {HTMLElement} data.elementLike Кнопка лайка
 * @param {Object} settings Настройки
 */
export function setLike(onSetLikeAPI, data, settings) {
  const promiseAll = [
    buildPromiseCall({nameMethod: settings.methodLike, method: 'PUT', body: null, id: data.id}, settings),
  ];

  const callbacks = [
    onSetLikeAPI
  ];
  callingAPI(promiseAll, callbacks, data, settings);
}

/**
 * Отправить удаление лайка на карте в API
 *
 * @param {onDeleteLikeAPI} onDeleteLikeAPI Функция обработки результатов удаления карты
 * @param {Object} data Данные карты
 * @param {String} data.id Id карты
 * @param {HTMLElement} data.elementCard Карта лайка
 * @param {HTMLElement} data.elementLike Кнопка лайка
 * @param {Object} settings Настройки
 */
export function deleteLike(onDeleteLikeAPI, data, settings) {
  const promiseAll = [
    buildPromiseCall({nameMethod: settings.methodLike, method: 'DELETE', body: null, id: data.id}, settings),
  ];

  const callbacks = [
    onDeleteLikeAPI
  ];
  callingAPI(promiseAll, callbacks, data, settings);
}

/**
 * Обновить аватар в API
 *
 * @param {onEditAvatarAPI} onEditAvatarAPI Функция обработки результатов обновления аватара
 * @param {Object} data Данные аватара
 * @param {String} data.link URL аватара
 * @param {HTMLElement} data.buttonSubmit Кнопка "Сохранить"
 * @param {Object} settings Настройки
 */
export function updateAvatar(onEditAvatarAPI, data, settings) {
  const promiseAll = [
    buildPromiseCall({nameMethod: settings.methodAvatar, method: 'PATCH', body: {avatar: data.link}, id: null}, settings),
  ]
  const callbacks = [
    onEditAvatarAPI
  ];

  data.buttonSubmit.querySelector(settings.classSubmitLabel).textContent = "Сохранить...";
  data.buttonSubmit.querySelector(settings.classSpinner).classList.add(settings.classSpinnerVisible);
  callingAPI(promiseAll, callbacks, null, settings);
}
