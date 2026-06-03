const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
revealItems.forEach(item => observer.observe(item));

const filters = document.querySelectorAll('.filter');
const galleryGrid = document.querySelector('.gallery-grid');

filters.forEach(button => {
  button.addEventListener('click', () => {
    filters.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const category = button.dataset.filter;
    document.querySelectorAll('.photo-card').forEach(card => {
      const show = category === 'all' || card.dataset.category === category;
      card.style.display = show ? 'block' : 'none';
    });
  });
});

const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');
const lightboxText = lightbox.querySelector('p');
const closeLightbox = document.querySelector('.close-lightbox');
const lightboxSaveBtn = document.querySelector('.lightbox-save-btn');
const lightboxRemoveBtn = document.querySelector('.lightbox-remove-btn');
const photoUpload = document.getElementById('photoUpload');

let currentLightboxCard = null;

function openPhotoInLightbox(card) {
  currentLightboxCard = card;
  lightboxImg.src = card.dataset.img;
  if (lightboxSaveBtn) lightboxSaveBtn.href = card.dataset.img;
  lightboxText.textContent = card.dataset.caption || '';

  if (card.classList.contains('uploaded-photo')) {
    lightboxRemoveBtn?.classList.add('show');
  } else {
    lightboxRemoveBtn?.classList.remove('show');
  }

  lightbox.classList.add('show');
  lightbox.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  lightbox.classList.remove('show');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxRemoveBtn?.classList.remove('show');
  currentLightboxCard = null;
}

if (galleryGrid) {
  galleryGrid.addEventListener('click', event => {
    const card = event.target.closest('.photo-card');
    if (!card || !galleryGrid.contains(card)) return;
    openPhotoInLightbox(card);
  });
}

lightboxRemoveBtn?.addEventListener('click', () => {
  if (!currentLightboxCard || !currentLightboxCard.classList.contains('uploaded-photo')) return;

  if (currentLightboxCard.dataset.img?.startsWith('blob:')) {
    URL.revokeObjectURL(currentLightboxCard.dataset.img);
  }

  currentLightboxCard.remove();
  closeModal();
});

closeLightbox.addEventListener('click', closeModal);
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) closeModal();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeModal();
});

if (photoUpload && galleryGrid) {
  photoUpload.addEventListener('change', event => {
    const files = Array.from(event.target.files || []);

    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;

      const imageUrl = URL.createObjectURL(file);
      const card = document.createElement('div');
      card.className = 'photo-card uploaded-photo';
      card.dataset.category = 'friends';
      card.dataset.caption = '';
      card.dataset.img = imageUrl;

      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = file.name || 'Uploaded camping memory';

      card.appendChild(img);
      galleryGrid.appendChild(card);
    });

    photoUpload.value = '';

    if (files.length) {
      document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
    }
  });
}
