import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { getImagesByQuery } from './js/pixabay-api.js';
import { createGallery, clearGallery, showLoader, hideLoader } from './js/render-functions.js';

const searchForm = document.querySelector('.form');

searchForm.addEventListener('submit', handleSearch);

function handleSearch(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const query = form.elements['search-text'].value.trim();

  if (query === "") {
    iziToast.warning({ message: "Please enter a search query!" });
    return;
  }

  clearGallery();
  showLoader();

  getImagesByQuery(query)
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.error({
          message: "Sorry, there are no images matching your search query. Please try again!",
          position: 'topRight'
        });
        return;
      }

      createGallery(data.hits);
    })
    .catch(error => {
      console.error(error);
      iziToast.error({ message: "Something went wrong. Try again later." });
    })
    .finally(() => {
      hideLoader();
      form.reset();
    });
}