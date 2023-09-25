import Notiflix from 'notiflix';
import { fetchItemsByTag } from './find-photo-api.js';
import * as basicLightbox from 'basiclightbox';

const form = document.getElementById('search-form');
const input = form.querySelector('input[name="searchQuery"]');
const imageContainer = document.querySelector('.photo-card');
const loadMoreButton = document.querySelector('.load-more');

const modal = document.getElementById('myModal');
const modalContent = document.querySelector('.modal-content');
const closeModal = document.getElementById('closeModal');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const modalImage = document.createElement('img');

let page = 1;
let searchQuery = '';
let imagesArray = [];
let currentImageArrayIndex = 0;

modalContent.appendChild(modalImage);
loadMoreButton.style.display = "none";

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    searchQuery = input.value.trim();
    page = 1;

    if (searchQuery === "") {
        Notiflix.Notify.failure("Empty field");
        return;
    }

    try {
        imagesArray = await fetchItemsByTag(searchQuery, page);
        if (imagesArray.length === 0) {
            Notiflix.Notify.failure("No images found.");
        } else {
            displayImages(imagesArray);
            toggleLoadMoreButton(imagesArray);
        }
    } catch (error) {
        console.error('Error fetching images:', error);
    }
});

loadMoreButton.addEventListener('click', async () => {
    try {
        page++;
        const newImages = await fetchItemsByTag(searchQuery, page);
        if (newImages.length === 0) {
            Notiflix.Notify.info("No more images to load.");
        } else {
            imagesArray = imagesArray.concat(newImages);
            displayImages(newImages);
            toggleLoadMoreButton(newImages);
        }
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
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width="498px" height="250px">
          <div class="info">
            <p class="info-item"><b>Likes:</b> ${image.likes}</p>
            <p class="info-item"><b>Views:</b> ${image.views}</p>
            <p class="info-item"><b>Comments:</b> ${image.comments}</p>
            <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
          </div>
        </div>
        `;
    
       
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = cardInfo;
        
        
        const photoCard = tempContainer.firstElementChild;
        
        
        imageContainer.appendChild(photoCard);
    
        photoCard.addEventListener('click', () => openModal(index));
    })};
    

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
    const imageURL = imagesArray[index].webformatURL;
    const imageAlt = imagesArray[index].tags;

    const lightbox = basicLightbox.create(`
        <img src="${imageURL}" alt="${imageAlt}" class="modal-image">
    `);
    
    lightbox.show();
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