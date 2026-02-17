import axios from 'axios';

const API_KEY = '54641243-abfc91c86f68821b6b62fe46a';
const BASE_URL = 'https://pixabay.com/api/';

export function getImagesByQuery(query) {
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });

  return axios.get(`${BASE_URL}?${searchParams}`)
    .then(response => {
      return response.data;
    });
}