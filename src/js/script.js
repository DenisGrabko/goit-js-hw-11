import { fetchItemsByTag } from './find-photo-api.js';

const form = document.getElementById('search-form');
const input = form.querySelector('input[name="searchQuery"]');
const imageContainer = document.querySelector('.photo-card');
const loadMoreButton = document.querySelector('.load-more');

//////////////////////////////Modal Window///////////////////////////////////////////
const modal = document.getElementById('myModal');
const modalContent = document.querySelector('.modal-content');
const closeModal = document.getElementById('closeModal');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const modalImage = document.createElement('img'); // Створюємо елемент <img> для модального вікна

let page = 1;
let searchQuery = '';
let imagesArray = [];
let currentImageArrayIndex = 0;

modalContent.appendChild(modalImage);

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    searchQuery = input.value.trim();
    page = 1;

    if (searchQuery) {
        try {
            imagesArray = await fetchItemsByTag(searchQuery, page);
            displayImages(imagesArray);
            toggleLoadMoreButton(imagesArray);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    }
});

loadMoreButton.addEventListener('click', async () => {
    try {
        page++;
        const newImages = await fetchItemsByTag(searchQuery, page);
        imagesArray = imagesArray.concat(newImages);
        displayImages(newImages);
        toggleLoadMoreButton(newImages);
    } catch (error) {
        console.error('Error fetching more images:', error);
    }
});

function displayImages(images) {
    if (page === 1) {
        imageContainer.innerHTML = '';
    }

    images.forEach((image, index) => {
        const cardInfo = `
        <div class="photo-one-card">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width="500px" height="250px">
          <div class="info">
            <p class="info-item"><b>Likes:</b> ${image.likes}</p>
            <p class="info-item"><b>Views:</b> ${image.views}</p>
            <p class="info-item"><b>Comments:</b> ${image.comments}</p>
            <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
          </div>
        </div>
        `;

        imageContainer.innerHTML += cardInfo;

        const photoCard = imageContainer.lastElementChild;
        photoCard.addEventListener('click', () => openModal(index));
    });
}

function toggleLoadMoreButton(images) {
    if (images.length < 40) {
        loadMoreButton.style.display = 'none';
        if (page > 1) {
            imageContainer.insertAdjacentHTML('beforeend', '<p class="end-message">We\'re sorry, but you\'ve reached the end of search results.</p>');
        }
    } else {
        loadMoreButton.style.display = 'block';
        const endMessage = imageContainer.querySelector('.end-message');
        if (endMessage) {
            endMessage.remove();
        }
    }
}

function openModal(index) {
    currentImageArrayIndex = index;
    modalImage.src = imagesArray[index].webformatURL;
    modalImage.alt = imagesArray[index].tags;
    modal.style.display = 'block';
}

function closeModalFunc() {
    modal.style.display = 'none';
}

function showPrev() {
    if (currentImageArrayIndex > 0) {
        currentImageArrayIndex--;
        setModalImage(imagesArray[currentImageArrayIndex].webformatURL, imagesArray[currentImageArrayIndex].tags);
    }
}

function showNext() {
    if (currentImageArrayIndex < imagesArray.length - 1) {
        currentImageArrayIndex++;
        setModalImage(imagesArray[currentImageArrayIndex].webformatURL, imagesArray[currentImageArrayIndex].tags);
    }
}

closeModal.addEventListener('click', closeModalFunc);
prevBtn.addEventListener('click', showPrev);
nextBtn.addEventListener('click', showNext);

function setModalImage(src, alt) {
    modalImage.src = src;
    modalImage.alt = alt;
}


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