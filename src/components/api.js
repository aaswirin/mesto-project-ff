/*
 Общение с API
 */

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
function buildPromise(params, settings) {
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
 * @param {Object} settings Настройки
 * @return {Promise}
 */
export function getProfileAndCard(settings) {
  return Promise.all(
  [buildPromise({
             nameMethod: settings.methodProfile,
             method: 'GET',
             body: null,
             id: null
           },
           settings),
         buildPromise({
             nameMethod: settings.methodCard,
             method: 'GET',
             body: null,
             id: null
           },
           settings),
        ]);
}

/**
 * Отправить в API профиль
 *
 * @param {Object} data Данные профиля
 * @param {String} data.name Имя профиля
 * @param {String} data.about Описание профиля
 * @param {Object} settings Настройки
 * @return {Promise}
 */
export function setProfile(data, settings) {
  return buildPromise({
      nameMethod: settings.methodProfile,
      method: 'PATCH',
      body: {name: data.name, about: data.about},
      id: null
    },
    settings);
}

/**
 * Отправить в API новую карту
 *
 * @param {Object} data Данные карты
 * @param {String} data.name Имя карты
 * @param {String} data.link URL карты
 * @param {Object} settings Настройки
 * @return {Promise}
 */
export function setCard(data, settings) {
  return buildPromise({
      nameMethod: settings.methodCard,
      method: 'POST',
      body: {name: data.name, link: data.link},
      id: null
    },
    settings);
}

/**
 * Удалить в API карту
 *
 * @param {Object} data Данные карты
 * @param {String} data.id Id карты
 * @param {HTMLElement} data.element Карта для удаления
 * @param {Object} settings Настройки
 * @return {Promise}
 */
export function deleteCard(data, settings) {
  return  buildPromise({
    nameMethod: settings.methodCard,
    method: 'DELETE',
    body: null,
    id: data.id
  },
  settings);
}

/**
 * Отправить лайк на карту в API
 *
 * @param {Object} data Данные карты
 * @param {String} data.id Id карты
 * @param {Object} settings Настройки
 * @return {Promise}
 */
export function setLike(data, settings) {
  return buildPromise({
    nameMethod: settings.methodLike,
    method: 'PUT',
    body: null,
    id: data.id
  },
  settings);
}

/**
 * Отправить удаление лайка на карте в API
 *
 * @param {Object} data Данные карты
 * @param {String} data.id Id карты
 * @param {Object} settings Настройки
 * @return {Promise}
 */
export function deleteLike(data, settings) {
  return buildPromise({
    nameMethod: settings.methodLike,
    method: 'DELETE',
    body: null, id: data.id
  },
  settings);
}

/**
 * Обновить аватар в API
 *
 * @param {Object} data Данные аватара
 * @param {String} data.link URL аватара
 * @param {HTMLElement} data.buttonSubmit Кнопка "Сохранить"
 * @param {Object} settings Настройки
 * @return {Promise}
 */
export function updateAvatar(data, settings) {
  return buildPromise({
    nameMethod: settings.methodAvatar,
    method: 'PATCH',
    body: {avatar: data.link},
    id: null
  },
  settings);
}

