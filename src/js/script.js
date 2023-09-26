import Notiflix from 'notiflix';
import { fetchItemsByTag } from './find-photo-api.js';
import SimpleLightbox from 'simplelightbox'; 
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.getElementById('search-form');
const input = form.querySelector('input[name="searchQuery"]');
const imageContainer = document.querySelector('.photo-card');
const loadMoreButton = document.querySelector('.load-more');

let page = 1;
let searchQuery = '';
let imagesArray = [];
let loadMoreActive = false; 
loadMoreButton.style.display = 'none';

const lightbox = new SimpleLightbox('.photo-one-card a', {
  captions: true,
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  searchQuery = input.value.trim();
  page = 1;

  if (searchQuery === '') {
    Notiflix.Notify.failure('Empty field');
    return;
  }

  try {
    imagesArray = await fetchItemsByTag(searchQuery, page);
    if (imagesArray.length === 0) {
      Notiflix.Notify.failure('No images found.');
    } else {
      displayImages(imagesArray);
      loadMoreActive = true;
      toggleLoadMoreButton(imagesArray);
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
});

loadMoreButton.addEventListener('click', async () => {
  if (!loadMoreActive) {
    return;
  }

  try {
    page++;
    const newImages = await fetchItemsByTag(searchQuery, page);
    if (newImages.length === 0) {
      Notiflix.Notify.info('No more images to load.');
      loadMoreButton.style.display = 'none';
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
      <a href="${image.webformatURL}" data-lightbox="image">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width="500px" height="250px">
      </a>
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

  // После добавления всех изображений вызываем метод .refresh() для SimpleLightbox,
  // чтобы обновить галерею с новыми изображениями
  lightbox.refresh();
}

function toggleLoadMoreButton(images) {
  if (images.length < 40) {
    loadMoreButton.style.display = 'none';
    if (page > 1) {
      imageContainer.insertAdjacentHTML(
        'beforeend',
        '<p class="end-message">We\'re sorry, but you\'ve reached the end of search results.</p>'
      );
    }
  } else {
    if (loadMoreActive) {
      loadMoreButton.style.display = 'block';
      const endMessage = imageContainer.querySelector('.end-message');
      if (endMessage) {
        endMessage.remove();
      }
    }
  }
}


// function closeModalFunc() {
//   modal.style.display = 'none';
// }

// function showPrev() {
//   if (currentImageArrayIndex > 0) {
//     currentImageArrayIndex--;
//     setModalImage(imagesArray[currentImageArrayIndex].webformatURL, imagesArray[currentImageArrayIndex].tags);
//   }
// }

// function showNext() {
//   if (currentImageArrayIndex < imagesArray.length - 1) {
//     currentImageArrayIndex++;
//     setModalImage(imagesArray[currentImageArrayIndex].webformatURL, imagesArray[currentImageArrayIndex].tags);
//   }
// }

// closeModal.addEventListener('click', closeModalFunc);
// prevBtn.addEventListener('click', showPrev);
// nextBtn.addEventListener('click', showNext);

// function setModalImage(src, alt) {
//   modalImage.src = src;
//   modalImage.alt = alt;
// }


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