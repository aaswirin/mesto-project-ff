/**
 * Настройки для разметки и прочая, и прочая...
 * При изменении разметки править здесь
 *
 * @type {object} Настройки
 */
export const settings = {
  idTemplate: "#card-template",                     // Id template'а для карт
  classPlacesList: '.places__list',                 // Класс места для укладки карт
  classPlacesItem: '.places__item',                 // Класс для карты
  classCardImage: '.card__image',                   // Класс для картинки карты
  classCardTitle: '.card__title',                   // Класс для подписи карты
  classCardDeleteButton: '.card__delete-button',    // Класс для кнопки удаления карты
  classListItem: 'li.places__item',                 // Тэг и Класс места для укладки карт
  // Для окон
  classWindowPopup: '.popup__content',               // Класс для содержимого окон
  classWindowOpen: '.popup_is-opened',               // Класс для показа окна
  classWindowOpenNotDot: 'popup_is-opened',          // Класс для показа окна (без точки)
  classWindowAnimatedNotDot: 'popup_is-animated',    // Класс для анимации
  classElementClose: '.popup__close',                // Класс для кнопки закрытия окна
  classForm: '.popup__form',                         // Класс формы
  keysClose: [                                       // Список клавиш, по которым закрываем окно. Вдруг поменяется?
    'Escape',
    //'F10',
  ],
  // Редактировать профиль
  classButtonEditProfile: '.profile__edit-button',   // Класс для кнопки "Редактировать профиль"
  classWindowEditProfile: '.popup_type_edit',        // Класс для окна "Редактировать профиль"
  nameFormEditProfile: 'edit-profile',               // Имя формы "Редактировать профиль"
  bindProfile: [                                     // Связки полей на форме и на странице
    {
      classPage: '.profile__title',                  // Класс на странице
      nameForm: 'name',                              // Имя на форме
    },
    {
      classPage: '.profile__description',
      nameForm: 'description',
    }
  ],
  // Добавить карточку
  classButtonAddCard: '.profile__add-button',        // Класс для кнопки "Добавить карточку"
  classWindowAddCard: '.popup_type_new-card',        // Класс для окна "Добавить карточку"
  nameFormAddCard: 'new-place',                      // Имя формы "Добавить карточку"
  bindCard: [                                        // Связки полей на форме и на странице
    {
      name: 'name',                                  // Имя значения объекта для создания карточки
      nameForm: 'place-name',                        // Имя на форме, откуда взять значение
    },
    {
      name: 'link',
      nameForm: 'link',
    },
  ],
  // Просмотр картинки
  classWindowViewImage: '.popup_type_image',         // Класс для окна "Просмотр картинки"
  classViewImage: '.popup__image',                   // Класс для картинки, которую показываем
  classViewCaption: '.popup__caption',               // Подпись под картинкой, которую показываем
  // Лайк карточки
  classLikeButton: '.card__like-button',             // Класс для кнопки лайка
  classLikeYes: '.card__like-button_is-active',      // Класс для установки лайка
  classLikeYesNotDot: 'card__like-button_is-active', // Класс для установки лайка (без точки)
}
