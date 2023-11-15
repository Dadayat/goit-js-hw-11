import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const KEY = '40676469-3b6bdf365c2990f38f98f7a4f';

export async function fetchPhoto(q, page, perPage) {
  const url = `${URL}?key=${KEY}&q=${q}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`;
  const response = await axios.get(url);
  return response.data;
}
