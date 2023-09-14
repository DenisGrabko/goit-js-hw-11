import axios from 'axios';
import notiflix from "notiflix"

const apiKey = '39444831-9a9227c6cf2b75d1cfcf35b46';
const searchQuery = 'dogs';

//axios.defaults.headers.common['x-api-key'] = 'live_lJcJU1AuNnhlcVjceNk6Xjrh8ITLhUvkZcjR4Semjtm4rRofZYSDP6yaWhF3phbO';

 
const apiURL ='https://pixabay.com/api/';

export function fetchItems() {
  axios.get(`${apiURL}`, {
    params: {
        key: apiKey,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
    }})
.then((response) => {
    console.log(response.data);
})
.catch((error) => {
    console.error('Помилка запиту до Pixabay API:', error);
    notiflix.Notify.failure('Помилка запиту до Pixabay API');
})
}


export function fetchItemsById(TypeOfItemName) {
    axios.get(`${apiURL}/${TypeOfItemName}`, {
        params: {
           key: apiKey,
           q: searchQuery,
           image_type: 'photo',
           orientation: 'horizontal',
           safesearch: true,
        }
    })
    .then((result) => {
        console.log(response.data);
    })
    .catch((error) => {
        console.error('Помилка запиту до Pixabay API:', error);
        notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    })
}

return fetchItems();
//const text = notiflix.Notify.failure("Please choose a date in the future"); return text;
    