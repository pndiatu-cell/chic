/**
 * AFROCHIC — Salon de Beauté & Coiffure (RDC)
 * Script d'interaction & Générateur de Réservations WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  // Configuration globale du salon (Placeholders personnalisables)
  const SALON_CONFIG = {
    // Remplacer par le numéro WhatsApp officiel du salon sans espaces ni signes (ex: 243810000000)
    // Placeholder identifié pour la RDC (+243)
    whatsappNumber: '243000000000',
    salonName: 'AfroChic',
    city: 'Kinshasa, RDC'
  };

  /* -------------------------------------------------------------
     1. Navigation Mobile (Menu Burger)
     ------------------------------------------------------------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });

    // Fermer le menu lors du clic sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* -------------------------------------------------------------
     2. Détection du Lien Actif dans la Navigation
     ------------------------------------------------------------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* -------------------------------------------------------------
     3. Utilitaire de Génération de Liens WhatsApp Officiels
     ------------------------------------------------------------- */
  function openWhatsApp(messageText) {
    const cleanNumber = SALON_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  /* -------------------------------------------------------------
     4. Bouton Flottant WhatsApp
     ------------------------------------------------------------- */
  const floatingBtn = document.querySelector('.whatsapp-float');
  if (floatingBtn) {
    floatingBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const message = `Bonjour ${SALON_CONFIG.salonName},\nJe visite votre site web et je souhaite obtenir des renseignements sur vos prestations et disponibilités.\nMerci d'avance pour votre accueil !`;
      openWhatsApp(message);
    });
  }

  /* -------------------------------------------------------------
     5. Réservation Directe depuis les Cartes de Services
     ------------------------------------------------------------- */
  const serviceBookingButtons = document.querySelectorAll('.js-book-service');
  serviceBookingButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.service-card') || btn.closest('.univers-card');
      const serviceName = btn.dataset.service || (card ? card.querySelector('h3')?.innerText : 'Prestation Beauté');
      const servicePrice = btn.dataset.price || (card ? card.querySelector('.price-tag')?.innerText : 'Sur devis');
      const serviceDuration = btn.dataset.duration || 'À préciser';

      const message = `Bonjour ${SALON_CONFIG.salonName},\n\nJe souhaite solliciter un rendez-vous pour la prestation suivante :\n- Prestation : ${serviceName.trim()}\n- Tarif indicatif : ${servicePrice.trim()}\n- Durée estimée : ${serviceDuration.trim()}\n\nPourriez-vous me confirmer vos créneaux disponibles pour cette semaine ?\n\nMerci beaucoup !`;
      
      openWhatsApp(message);
    });
  });

  /* -------------------------------------------------------------
     6. Filtrage Dynamique des Services (Onglets)
     ------------------------------------------------------------- */
  const serviceTabs = document.querySelectorAll('.tab-btn[data-category]');
  const serviceCards = document.querySelectorAll('.service-card[data-category]');

  if (serviceTabs.length > 0 && serviceCards.length > 0) {
    serviceTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        serviceTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const category = tab.dataset.category;

        serviceCards.forEach(card => {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* -------------------------------------------------------------
     7. Formulaire Interactif de Réservation WhatsApp (Page Contact)
     ------------------------------------------------------------- */
  const bookingForm = document.getElementById('whatsappBookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const clientName = document.getElementById('clientName')?.value.trim();
      const clientPhone = document.getElementById('clientPhone')?.value.trim();
      const serviceSelect = document.getElementById('clientService');
      const selectedServiceName = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].text : 'Non précisé';
      const bookingDate = document.getElementById('bookingDate')?.value;
      const bookingSlot = document.getElementById('bookingSlot')?.value;
      const clientNotes = document.getElementById('clientNotes')?.value.trim();

      if (!clientName || !bookingDate || !bookingSlot) {
        alert('Veuillez remplir votre nom, la date et le créneau souhaité.');
        return;
      }

      // Construction du message structuré WhatsApp
      let message = `Bonjour ${SALON_CONFIG.salonName},\n\n`;
      message += `Je souhaite effectuer une demande de rendez-vous depuis votre site web :\n\n`;
      message += `👤 Nom : ${clientName}\n`;
      if (clientPhone) {
        message += `📞 Téléphone de contact : ${clientPhone}\n`;
      }
      message += `💇 Prestation demandée : ${selectedServiceName}\n`;
      message += `📅 Date souhaitée : ${bookingDate}\n`;
      message += `⏰ Créneau préféré : ${bookingSlot}\n`;

      if (clientNotes) {
        message += `📝 Précisions ou souhaits particuliers : ${clientNotes}\n`;
      }

      message += `\nMerci de me confirmer si ce créneau est disponible ou de me proposer une alternative. Bonne journée !`;

      // Affichage de feedback visuel dans le formulaire
      const feedbackBox = document.getElementById('formFeedback');
      if (feedbackBox) {
        feedbackBox.style.display = 'block';
        feedbackBox.innerHTML = `
          <div style="background: rgba(37,211,102,0.12); border: 1px solid var(--color-whatsapp); border-radius: 8px; padding: 1.2rem; margin-top: 1.5rem; text-align: center;">
            <p style="color: #176536; font-weight: 600; margin-bottom: 0.5rem;">Votre message a été préparé pour WhatsApp !</p>
            <p style="font-size: 0.9rem; color: #2C2C2C; margin-bottom: 1rem;">Si la conversation WhatsApp ne s'est pas ouverte automatiquement, cliquez ci-dessous :</p>
            <button type="button" class="btn btn-whatsapp btn-sm js-manual-wa-link">Ouvrir WhatsApp maintenant</button>
          </div>
        `;

        feedbackBox.querySelector('.js-manual-wa-link').addEventListener('click', () => {
          openWhatsApp(message);
        });
      }

      // Ouverture directe
      openWhatsApp(message);
    });
  }

  /* -------------------------------------------------------------
     8. Filtrage & Lightbox de la Galerie de Réalisations
     ------------------------------------------------------------- */
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxBookBtn = document.getElementById('lightboxBookBtn');
  const lightboxClose = document.getElementById('lightboxClose');

  // Filtrage des photos
  if (galleryFilterBtns.length > 0 && galleryItems.length > 0) {
    galleryFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        galleryFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.dataset.filter;

        galleryItems.forEach(item => {
          if (cat === 'all' || item.dataset.category === cat) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Ouverture Lightbox
  if (galleryItems.length > 0 && lightboxModal) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-title')?.innerText || 'Réalisation AfroChic';
        const cat = item.querySelector('.gallery-category')?.innerText || 'Coiffure';

        if (lightboxImg) lightboxImg.src = img.src;
        if (lightboxTitle) lightboxTitle.innerText = title;
        if (lightboxCategory) lightboxCategory.innerText = cat;

        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (lightboxBookBtn) {
          lightboxBookBtn.onclick = () => {
            const message = `Bonjour ${SALON_CONFIG.salonName},\nJ'ai vu cette réalisation sur votre galerie : "${title}" (${cat}).\nEst-il possible de réaliser cette coiffure / ce soin lors de ma prochaine visite ? Quels sont vos créneaux disponibles ?\nMerci !`;
            openWhatsApp(message);
          };
        }
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  /* -------------------------------------------------------------
     9. Formulaire de Contact Standard (Renseignements généraux)
     ------------------------------------------------------------- */
  const contactForm = document.getElementById('generalContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('genName')?.value;
      const message = document.getElementById('genMessage')?.value;
      
      const successDiv = document.getElementById('contactFeedback');
      if (successDiv) {
        successDiv.style.display = 'block';
        successDiv.innerHTML = `
          <div style="background: rgba(197, 160, 89, 0.15); border: 1px solid var(--color-champagne); border-radius: 8px; padding: 1.2rem; margin-top: 1.5rem; text-align: center;">
            <p style="color: var(--color-black); font-weight: 700; margin-bottom: 0.35rem;">Merci ${name || ''} !</p>
            <p style="font-size: 0.9rem; color: var(--color-text-muted);">Votre message a bien été préparé. Pour une réponse instantanée, nous vous recommandons de nous joindre directement via WhatsApp.</p>
          </div>
        `;
      }
      contactForm.reset();
    });
  }
});
