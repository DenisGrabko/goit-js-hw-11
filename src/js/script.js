import { fetchItemsByTag } from './find-photo-api.js';

const form = document.getElementById('search-form');
const input = form.querySelector('input[name="searchQuery"]');
const imageContainer = document.querySelector('.photo-card');
const loadMoreButton = document.querySelector('.load-more');

let page = 1;
let searchQuery = '';

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    searchQuery = input.value.trim();
    page = 1;

    if (searchQuery) {
        try {
            const images = await fetchItemsByTag(searchQuery, page);
            displayImages(images);
            toggleLoadMoreButton(images);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    }
});

loadMoreButton.addEventListener('click', async () => {
    try {
        page++;
        const images = await fetchItemsByTag(searchQuery, page);
        displayImages(images);
        toggleLoadMoreButton(images);
    } catch (error) {
        console.error('Error fetching more images:', error);
    }
});

function displayImages(images) {
    if (page === 1) {
        imageContainer.innerHTML = ''; // Очистити контейнер при першому запиті
    }

    images.forEach((image) => {
        const cardInfo = `
        <div class="photo-one-card">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width="450px" height="250px">
          <div class="info">
            <p class="info-item"><b>Likes:</b> ${image.likes}</p>
            <p class="info-item"><b>Views:</b> ${image.views}</p>
            <p class="info-item"><b>Comments:</b> ${image.comments}</p>
            <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
          </div>
        </div>
        `;

        imageContainer.innerHTML += cardInfo;
    });
}

function toggleLoadMoreButton(images) {
    if (images.length < 40) {
        loadMoreButton.style.display = 'none'; // Ховати кнопку, якщо немає більше зображень
        if (page > 1) {
            imageContainer.insertAdjacentHTML('beforeend', '<p class="end-message">We\'re sorry, but you\'ve reached the end of search results.</p>');
        }
    } else {
        loadMoreButton.style.display = 'block'; // Показувати кнопку, якщо є більше зображень
        const endMessage = imageContainer.querySelector('.end-message');
        if (endMessage) {
            endMessage.remove(); // Видалити повідомлення про завершення пошуку, якщо воно є
        }
    }
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