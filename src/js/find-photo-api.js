import axios from 'axios';
import notiflix from "notiflix"

const apiKey = '39444831-9a9227c6cf2b75d1cfcf35b46';

const apiURL = 'https://pixabay.com/api/';

export async function fetchItemsByTag(tag) {
  try {
    const response = await axios.get(apiURL, {
      params: {
        key: apiKey,
        q: tag, 
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: 1,
        per_page: 40,
      }
    });

    const images = response.data.hits;
    return images;
    
  } catch (error) {
    console.error('Помилка запиту до Pixabay API:', error);
    notiflix.Notify.failure('Помилка запиту до Pixabay API');
    return [];
  }
}

//return fetchItemsByTag();
//const text = notiflix.Notify.failure("Please choose a date in the future"); return text;
    