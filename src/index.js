import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchPhoto } from './js/pixabay-api';
import { createMarkup } from './js/markup';
import { refs } from './js/refs';
import { lightbox } from './js/lightbox';


const { searchForm, gallery, btnLoadMore } = refs;

const paramsForNotify = {
    position: 'right-top',
    timeout: 4000,
    width: '400px',
    fontSize: '24px'
};

const perPage = 40;
let page = 1;
let keyOfSearchPhoto = '';

btnLoadMore.classList.add('is-hidden');

searchForm.addEventListener('submit', onSubmitForm);

function onSubmitForm(event) {
  event.preventDefault();

  gallery.innerHTML = '';
  page = 1;
  const { searchQuery } = event.currentTarget.elements;
  keyOfSearchPhoto = searchQuery.value
    .trim()
    .toLowerCase()
    .split(' ')
    .join('+');

  if (keyOfSearchPhoto === '') {
    btnLoadMore.classList.add('is-hidden');
    Notify.info('Enter your request, please!', paramsForNotify);
    return;
  }

  fetchPhoto(keyOfSearchPhoto, page, perPage)
    .then(data => {
      const searchResults = data.hits;
      if (data.totalHits === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          paramsForNotify
        );
      } else {
        Notify.info(
          `Hooray! We found ${data.totalHits} images.`,
          paramsForNotify
        );
      }
      console.log(searchResults);
      const numberOfPage = Math.ceil(data.totalHits / perPage);
      createMarkup(searchResults);
          
        if (page >= numberOfPage) {
            btnLoadMore.classList.add('is-hidden');
        Notify.info(
          "We're sorry, but you've reached the end of search results.",
          paramsForNotify
        );
      } else {
        btnLoadMore.classList.remove('is-hidden');
        // window.addEventListener('scroll', showLoadMorePage);
        btnLoadMore.addEventListener('click', onClickLoadMore);
        //event.currentTarget.reset();
      }; lightbox.refresh();
    })  
    .catch(er => console.log(er));

}

btnLoadMore.addEventListener('click', onClickLoadMore);
    
function onClickLoadMore() {
    page += 1;
    fetchPhoto(keyOfSearchPhoto, page, perPage)
        .then(data => {
            const searchResults = data.hits;           
          createMarkup(searchResults);
            if (page === 1 && searchResults.length < 40) {
                    btnLoadMore.classList.add('is-hidden');
                    Notify.info("We're sorry, but you've reached the end of search results.", paramsForNotify);
                    btnLoadMore.removeEventListener('click', onClickLoadMore);
                    // window.removeEventListener('scroll', showLoadMorePage);
            }; lightbox.refresh();
            })     
    .catch(er => console.log(er));

};

// function showLoadMorePage() {
//     if (checkIfEndOfPage()) {
//         onClickLoadMore();
//     };
// };

function checkIfEndOfPage() {
  return (
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight
  );
}

