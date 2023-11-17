import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

export let lightbox = new SimpleLightbox('.photo-card a', { 
                captionsData: 'alt',
                captionDelay: 250,
    });