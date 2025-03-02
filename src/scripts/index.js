import '../pages/index.css';                                                  // Импорт главного файла стилей

import {settings} from '../components/settings.js';                           // Настройки проекта
import {initialCards} from '../components/cards.js';                          // Импорт описания карточек
import {initPlaces} from '../components/card.js';                             // Функция для создания карточек при инициализации
import {showPopup, closePopup, submitProfile, submitCard} from '../components/modal.js';    // Функции для открытия/закрытия окна

/** Заготовка */
const cardTemplate = document.querySelector(settings.idTemplate).content;

/** DOM узлы по потребности */
const placesContainer = document.querySelector(settings.classPlacesList);      // Место для укладки карт
const windowProfile = document.querySelector(settings.classWindowEditProfile); // Окно "Редактировать профиль"
const formProfile = windowProfile.querySelector(settings.classForm);           // Форма "Редактировать профиль"
const windowCard = document.querySelector(settings.classWindowAddCard);        // Окно "Добавить карточку"
const formCard = windowCard.querySelector(settings.classForm);                 // Форма "Добавить карточку"
const windowImage = document.querySelector(settings.classWindowViewImage);     // Окно "Показать картинку"

// Редактировать профиль
document.querySelector(settings.classButtonEditProfile)
  .addEventListener('click', event => showPopup(event, windowProfile, settings.bindProfile));
// Обеспечить закрытие
windowProfile.querySelector(settings.classElementClose)
  .addEventListener('click', closePopup);
// Обработка результатов формы
formProfile
  .addEventListener("submit", event => submitProfile(event, windowProfile, settings.bindProfile));

// Добавление карточки
document.querySelector(settings.classButtonAddCard)
  .addEventListener('click', event => showPopup(event, windowCard, null));
// Обеспечить закрытие
windowCard.querySelector(settings.classElementClose)
  .addEventListener('click', closePopup);
// Обработка результатов формы
formCard
  .addEventListener("submit", event => submitCard(event, windowCard, settings.bindCard));

// Просмотр картинки
// обеспечить закрытие
windowImage.querySelector(settings.classElementClose)
  .addEventListener('click', closePopup);

// Стартуем
// 1. Вывести карточки на страницу
initPlaces(initialCards, cardTemplate, placesContainer, false);
