import axios from 'axios';
import { Buffer } from 'buffer';
window.Buffer = Buffer;

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const galleryDiv = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let searchQuery = '';
let lightbox;

form.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', fetchImages);

async function handleSearch(event) {
  event.preventDefault();
  searchQuery = event.currentTarget.elements.searchQuery.value.trim();
  currentPage = 1;
  if (!searchQuery) {
    Notiflix.Notify.failure('Proszę wpisać zapytanie wyszukiwania.');
    return;
  }
  clearGallery();
  fetchImages();
}

async function fetchImages() {
  const API_KEY = '34082644-62fbc73837a8e3c89e383a92f';
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(
    searchQuery
  )}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`;

  try {
    const response = await axios.get(URL);
    const images = response.data.hits;
    if (images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    displayImages(images);
    Notiflix.Notify.success(
      `Hooray! We found ${response.data.totalHits} images.`
    );
    loadMoreBtn.style.display = 'block';
    currentPage += 1;
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure(
      'Wystąpił błąd podczas wyszukiwania obrazów. Spróbuj ponownie.'
    );
  }
}

function displayImages(images) {
  const markup = images
    .map(
      img => `
    <div class="photo-card">
      <a href="${img.largeImageURL}"><img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" /></a>
      <div class="info">
        <p class="info-item"><b>Likes</b> ${img.likes}</p>
        <p class="info-item"><b>Views</b> ${img.views}</p>
        <p class="info-item"><b>Comments</b> ${img.comments}</p>
        <p class="info-item"><b>Downloads</b> ${img.downloads}</p>
      </div>
    </div>
  `
    )
    .join('');
  galleryDiv.insertAdjacentHTML('beforeend', markup);

  // Odśwież lub utwórz instancję SimpleLightbox
  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('.gallery a');
  }
}

function clearGallery() {
  galleryDiv.innerHTML = '';
  loadMoreBtn.style.display = 'none';
}
