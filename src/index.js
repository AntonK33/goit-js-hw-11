//import axios from 'axios';
import { axiosRequest } from './axiosRequest';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import easyScroll from 'easy-scroll';
const axios = require('axios').default;

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const downloadMore = document.querySelector('#download');

let query = undefined;
const pageSize = 40;
let currentPage = 1;
let pagesLeft = 0;





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
    

async function handleSubmit(e) {
  e.preventDefault();
  downloadMore.classList.add('hidden');
  //downloadMore.classList.remove('load_more');

  currentPage = 1;
  query = e.currentTarget.elements.searchQuery.value;
  gallery.innerHTML = '';
  axiosRequest(query, currentPage).then(response => {
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
    } if (pagesLeft <= 40) {
       Notiflix.Notify.success(`Hooray! We found ${pagesLeft} images.`);
      gallery.insertAdjacentHTML(
        'beforeend',
        response.data.hits.map(picture => render(picture)).join('')
      );
      
      downloadMore.classList.add('hidden');
      return;
    }
    
    else {
      Notiflix.Notify.success(`Hooray! We found ${pagesLeft} images.`);
      gallery.insertAdjacentHTML(
        'beforeend',
        response.data.hits.map(picture => render(picture)).join('')
      );
      pagesLeft -= pageSize;
      downloadMore.classList.remove('hidden');
      //downloadMore.classList.add('load_more');
    }
  });
  lightBox.refresh();
}
async function handleLoadMore() {
  currentPage += 1;
     axiosRequest(query, currentPage).then(response =>
      gallery.insertAdjacentHTML(
        'beforeend',
        response.data.hits.map(picture => render(picture)).join('')
      )
    );
    pagesLeft -= pageSize;
  if (pagesLeft <= 40) {
      downloadMore.classList.add('hidden');
  }
   lightBox.refresh();
  }
 



const lightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});


