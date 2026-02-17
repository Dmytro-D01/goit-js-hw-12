import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { getImagesByQuery } from './js/pixabay-api.js';
import { 
  createGallery, 
  clearGallery, 
  showLoader, 
  hideLoader, 
  showLoadMoreButton, 
  hideLoadMoreButton 
} from './js/render-functions.js';

const searchForm = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = "";
let totalHits = 0;
const PER_PAGE = 15;

searchForm.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleSearch(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const query = form.elements['search-text'].value.trim();

  if (query === "") {
    iziToast.warning({ message: "Please enter a search query!" });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  totalHits = 0;

  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    
    if (data.hits.length === 0) {
      iziToast.error({
        message: "Sorry, there are no images matching your search query. Please try again!",
        position: 'topRight'
      });
      return;
    }

    totalHits = data.totalHits;
    createGallery(data.hits);
    
    if (totalHits > PER_PAGE) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight'
      });
    }

  } catch (error) {
    console.error(error);
    iziToast.error({ message: "Something went wrong. Try again later." });
  } finally {
    hideLoader();
    form.reset();
  }
}

async function handleLoadMore() {
  currentPage += 1;
  
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    
    createGallery(data.hits);
    
    const totalPages = Math.ceil(totalHits / PER_PAGE);
    
    if (currentPage >= totalPages) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight'
      });
    } else {
      showLoadMoreButton();
    }

    smoothScroll();

  } catch (error) {
    console.error(error);
    iziToast.error({ message: "Error loading more images." });
  } finally {
    hideLoader();
  }
}

function smoothScroll() {
  const galleryItem = document.querySelector('.gallery-item');
  if (galleryItem) {
    const rect = galleryItem.getBoundingClientRect();
    window.scrollBy({
      top: rect.height * 2,
      behavior: 'smooth',
    });
  }
}