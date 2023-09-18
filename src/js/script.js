// Ваш файл script.js
import { fetchItemsByTag } from './find-photo-api.js';

const form = document.getElementById('search-form');
const input = form.querySelector('input[name="searchQuery"]');
const imageContainer = document.querySelector('.photo-card');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const searchQuery = input.value.trim();

    if (searchQuery) {
        try {
            const images = await fetchItemsByTag(searchQuery);

            if (images.length === 0) {
                showNoImagesMessage();
            } else {
                displayImages(images);
            }
        } catch (error) {
            console.error('Error fetching images:', error);
            // Handle the error (e.g., show an error message).
        }
    }
});

function showNoImagesMessage() {
    imageContainer.innerHTML = '<p class="no-images-message">Sorry, there are no images matching your search query. Please try again.</p>';
}

function displayImages(images) {
    imageContainer.innerHTML = '';

    images.forEach((image) => {       
        const cardInfo = `
        <div class="photo-one-card">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width="250px" height="150px">
          <div class="info">
            <p class="info-item">${image.likes}</p>
            <p class="info-item">${image.views}</p>
            <p class="info-item">${image.comments}</p>
            <p class="info-item">${image.downloads}</p>
          </div>
        </div>
        `       
        imageContainer.innerHTML += cardInfo;
    });
}


// Запускаємо пошук за замовчуванням
//form.submit();



// const imageObj = {
//     webformatURL: images.webformatURL,
//     largeImageURL: images.largeImageURL,
//     tags: images.tags,
//     likes: images.likes,
//     views: images.views,
//     comments: images.comments,
//     downloads: images.downloads,
// };

// webformatURL - посилання на маленьке зображення для списку карток.
//  - посилання на велике зображення.
//  - рядок з описом зображення. Підійде для атрибуту alt.
//  - кількість лайків.
// - кількість переглядів.
//  - кількість коментарів.
//  - кількість завантажень. 

//const imgElement = document.createElement('img');
        // imgElement.src = image.webformatURL;
        // imgElement.alt = image.tags;
        // imageContainer.appendChild(imgElement);