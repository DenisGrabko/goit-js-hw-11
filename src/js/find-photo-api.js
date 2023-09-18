// Ваш файл find-photo-api.js
import axios from 'axios';
import notiflix from "notiflix"

const apiKey = '39444831-9a9227c6cf2b75d1cfcf35b46';

const apiURL = 'https://pixabay.com/api/';

export function fetchItemsByTag(tag) {
  axios.get(apiURL, {
    params: {
        key: apiKey,
        q: tag, // Використовуємо параметр tag для пошуку за тегом.
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
    }
  })
  .then((response) => {
    const images = response.data.hits;
    // Тут ви можете використовувати знайдені зображення для подальших дій.
    return images;
  })
  .catch((error) => {
    console.error('Помилка запиту до Pixabay API:', error);
    const errorMessage = notiflix.Notify.failure('Помилка запиту до Pixabay API');
    return errorMessage;
  });
}


return fetchItemsByTag();
//const text = notiflix.Notify.failure("Please choose a date in the future"); return text;
    