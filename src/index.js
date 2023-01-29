//import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
const axios = require('axios').default;

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const downloadMore = document.querySelector('#download');

let query = undefined;
const pageSize = 40;
let currentPage = 1;
let pagesLeft = 0;

const API_KEY = "32831732-fbbeddb34dab056c70c27a61e";



form.addEventListener('submit', handleSubmit);
downloadMore.addEventListener('click', handleLoadMore);   
      
function render(picture) {  
return `
<div class="photo-card">
  <a  href=${picture.largeImageURL}><img src=${picture.webformatURL} alt=${picture.tags} loading="lazy" width=270px height=180px/></a>
  <div class="info">
    <p class="info-item">
      <b>❤️Likes: ${picture.likes}</b>
      
    </p>
    <p class="info-item">
      <b>👁️Views: ${picture.views}</b>
     
    </p>
    <p class="info-item">
      <b>Comments: 🗨️${picture.comments}</b>
      
    </p>
    <p class="info-item">
      <b>⏬Downloads: ${picture.downloads}</b>   
    </p>
  </div>
</div>
`;
}
    
function axiosRequest(query, currentPage) {    
    return axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${query}&per_page=${pageSize}&page=${currentPage}&image_type=photo&orientation=horizontal&safesearch=true`)    
}
async function handleSubmit(e) {
  e.preventDefault();
  downloadMore.classList.add('hidden');
  downloadMore.classList.remove('load_more');

  currentPage = 1;
  query = e.currentTarget.elements.searchQuery.value;
  gallery.innerHTML = '';
  await axiosRequest(query, currentPage).then(response => {
    if (query === ' ' || query === '') {
      Notiflix.Notify.failure('Please type search and try again.');
      return;
    }
    pagesLeft = response.data.totalHits;
    console.log(pagesLeft)
    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else {
      Notiflix.Notify.success(`Hooray! We found ${pagesLeft} images.`);
      gallery.insertAdjacentHTML(
        'beforeend',
        response.data.hits.map(picture => render(picture)).join('')
      );
      pagesLeft -= pageSize;
      downloadMore.classList.remove('hidden');
      downloadMore.classList.add('load_more');
    }
  });
  lightBox.refresh();
}
async function handleLoadMore() {
  currentPage += 1;
  if (pagesLeft <= 0) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    await axiosRequest(query, currentPage).then(response =>
      gallery.insertAdjacentHTML(
        'beforeend',
        response.data.hits.map(picture => render(picture)).join('')
      )
    );
    pagesLeft -= pageSize;
  }
  lightBox.refresh();
}


const lightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});


 //const { height: cardHeight } = document
 // .querySelector('.gallery')
 // .firstElementChild.getBoundingClientRect();

//window.scrollBy({
 // top: cardHeight * 2,
 // behavior: 'smooth',
//});

