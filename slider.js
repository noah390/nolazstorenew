// Slider functionality for home page
let slideIndex = 1;
let slideIndex2 = 1;

// Initialize sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeSliders();
});

function initializeSliders() {
  // Initialize first slider
  showSlide(slideIndex);
  
  // Initialize second slider
  showSlide2(slideIndex2);
  
  // Auto-advance first slider
  setInterval(() => {
    slideIndex++;
    if (slideIndex > 3) slideIndex = 1;
    showSlide(slideIndex);
  }, 5000);
  
  // Auto-advance second slider
  setInterval(() => {
    slideIndex2++;
    if (slideIndex2 > 3) slideIndex2 = 1;
    showSlide2(slideIndex2);
  }, 6000);
}

function currentSlide(n) {
  showSlide(slideIndex = n);
}

function currentSlide2(n) {
  showSlide2(slideIndex2 = n);
}

function showSlide(n) {
  const slides = document.querySelectorAll('.slider-section:first-of-type .slide');
  const dots = document.querySelectorAll('.slider-section:first-of-type .nav-dot');
  
  if (n > slides.length) slideIndex = 1;
  if (n < 1) slideIndex = slides.length;
  
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  if (slides[slideIndex - 1]) {
    slides[slideIndex - 1].classList.add('active');
  }
  if (dots[slideIndex - 1]) {
    dots[slideIndex - 1].classList.add('active');
  }
}

function showSlide2(n) {
  const slides = document.querySelectorAll('.slider-section:last-of-type .slide');
  const dots = document.querySelectorAll('.slider-section:last-of-type .nav-dot');
  
  if (n > slides.length) slideIndex2 = 1;
  if (n < 1) slideIndex2 = slides.length;
  
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  if (slides[slideIndex2 - 1]) {
    slides[slideIndex2 - 1].classList.add('active');
  }
  if (dots[slideIndex2 - 1]) {
    dots[slideIndex2 - 1].classList.add('active');
  }
}