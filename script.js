document.addEventListener('DOMContentLoaded', function () {
  document.body.classList.add('js-enabled');
  initMobileMenu();
  initStickyHeader();
  initRevealAnimations();
  initTestimonials();
  initContactForm();
  initSmoothAnchors();
  initBackToTop();

  initWatchModal();
  initCollectionSelector();
  initGoldFlowBackground();
});

function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const panel = document.querySelector('.mobile-panel');
  const close = document.querySelector('.mobile-panel-close');
  const navLinks = document.querySelectorAll('.mobile-panel .nav-link');
  const body = document.body;

  if (!toggle || !panel || !close) {
    return;
  }

  const openMenu = function () {
    panel.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    body.classList.add('no-scroll');
  };

  const closeMenu = function () {
    panel.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
    body.classList.remove('no-scroll');
  };

  toggle.addEventListener('click', function () {
    if (panel.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  close.addEventListener('click', closeMenu);

  document.addEventListener('click', function (event) {
    if (panel.classList.contains('open') && !panel.contains(event.target) && !toggle.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && panel.classList.contains('open')) {
      closeMenu();
    }
  });

  if (navLinks.length) {
    navLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }
}

function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) {
    return;
  }

  const updateHeader = function () {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader);
}

function initRevealAnimations() {
  const reveals = document.querySelectorAll('[data-reveal]');
  if (!reveals.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach(function (element) {
      element.classList.add('reveal-active');
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries, observerRef) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observerRef.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    }
  );

  reveals.forEach(function (element) {
    observer.observe(element);
  });
}

function initTestimonials() {
  const slider = document.querySelector('[data-testimonial-slider]');
  if (!slider) {
    return;
  }

  const slides = slider.querySelectorAll('.testimonial-slide');
  const prevButton = slider.querySelector('.testimonial-button:first-child');
  const nextButton = slider.querySelector('.testimonial-button:last-child');
  const dotsContainer = slider.querySelector('.testimonial-dots');
  let currentIndex = 0;
  let timer = null;

  if (!slides.length || !prevButton || !nextButton || !dotsContainer) {
    return;
  }

  const createDots = function () {
    slides.forEach(function (_, index) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Aller au témoignage ' + (index + 1));
      dot.addEventListener('click', function () {
        goToSlide(index);
      });
      dotsContainer.appendChild(dot);
    });
  };

  const updateSlider = function () {
    const track = slider.querySelector('.testimonial-slides');
    if (!track) {
      return;
    }
    track.style.transform = 'translateX(-' + currentIndex * 100 + '%)';
    dotsContainer.querySelectorAll('button').forEach(function (dot, index) {
      dot.classList.toggle('active', index === currentIndex);
    });
  };

  const goToSlide = function (index) {
    currentIndex = (index + slides.length) % slides.length;
    updateSlider();
  };

  const nextSlide = function () {
    goToSlide(currentIndex + 1);
  };

  const startAutoSlide = function () {
    timer = window.setInterval(nextSlide, 5000);
  };

  const stopAutoSlide = function () {
    if (timer) {
      window.clearInterval(timer);
    }
  };

  createDots();
  updateSlider();
  startAutoSlide();

  prevButton.addEventListener('click', function () {
    goToSlide(currentIndex - 1);
  });

  nextButton.addEventListener('click', function () {
    nextSlide();
  });

  slider.addEventListener('mouseenter', stopAutoSlide);
  slider.addEventListener('mouseleave', startAutoSlide);

  let startX = null;
  slider.addEventListener('touchstart', function (event) {
    startX = event.touches[0].clientX;
  });

  slider.addEventListener('touchend', function (event) {
    if (startX === null) {
      return;
    }
    const endX = event.changedTouches[0].clientX;
    if (endX - startX > 50) {
      goToSlide(currentIndex - 1);
    } else if (startX - endX > 50) {
      nextSlide();
    }
    startX = null;
  });
}

function initCollectionsFilter() {
  const filterButtons = document.querySelectorAll('.filter-button');
  const productCards = document.querySelectorAll('.product-card[data-category]');
  if (!filterButtons.length || !productCards.length) {
    return;
  }

  const updateFilter = function (category) {
    filterButtons.forEach(function (button) {
      button.classList.toggle('filter-button--active', button.dataset.filter === category);
    });
    productCards.forEach(function (card) {
      const cardCategory = card.dataset.category;
      const show = category === 'all' || cardCategory === category;
      card.style.display = show ? '' : 'none';
    });
  };

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      updateFilter(button.dataset.filter);
    });
  });

  const query = new URLSearchParams(window.location.search);
  const category = query.get('category');
  if (category) {
    const valid = ['luxury', 'classic', 'sport', 'smart'];
    if (valid.includes(category)) {
      updateFilter(category);
      return;
    }
  }

  updateFilter('all');
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) {
    return;
  }

  const result = form.querySelector('.form-result');
  const phoneInput = form.querySelector('[name="phone"]');
  const emailInput = form.querySelector('[name="email"]');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!result) {
      return;
    }

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const model = form.model.value.trim();
    const message = form.message.value.trim();

    const errors = [];
    if (!name) {
      errors.push('Veuillez indiquer votre nom complet.');
    }

    if (!validatePhone(phone)) {
      errors.push('Veuillez saisir un numéro marocain valide.');
    }

    if (!validateEmail(email)) {
      errors.push('Veuillez saisir une adresse e-mail valide.');
    }

    if (errors.length) {
      result.textContent = errors.join(' ');
      result.style.color = '#ff8a6a';
      return;
    }

    result.textContent = 'Votre demande est prête. Nous ouvrons WhatsApp pour finaliser votre message.';
    result.style.color = varColor('--accent');

    const encodedMessage = encodeURIComponent(
      'Bonjour L’Instant, je souhaite obtenir plus d’informations sur vos montres.\n' +
      'Nom : ' + name + '\n' +
      'Téléphone : ' + phone + '\n' +
      'E-mail : ' + email + '\n' +
      (model ? 'Modèle recherché : ' + model + '\n' : '') +
      (message ? 'Message : ' + message : '')
    );

    window.open('https://wa.me/212754141406?text=' + encodedMessage, '_blank');
  });
}

function validatePhone(value) {
  const cleaned = value.replace(/[\s.-]/g, '');
  const patterns = [
    /^(?:\+212|212)[67]\d{8}$/,
    /^0[67]\d{8}$/
  ];
  return patterns.some(function (pattern) {
    return pattern.test(cleaned);
  });
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function varColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function initSmoothAnchors() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach(function (link) {
    link.addEventListener('click', function (event) {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') {
        return;
      }
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initBackToTop() {
  const button = document.querySelector('.back-to-top');
  if (!button) {
    return;
  }

  const toggleVisibility = function () {
    if (window.scrollY > 420) {
      button.classList.add('show');
    } else {
      button.classList.remove('show');
    }
  };

  window.addEventListener('scroll', toggleVisibility);
  toggleVisibility();

  button.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}



/*===============
================ */

function initWatchModal() {

  const modal = document.getElementById("watch-modal");

  const overlay = document.getElementById("watch-modal-overlay");

  const closeButton = document.getElementById("watch-modal-close");

  const cards = document.querySelectorAll(".watch-card-button");

  const mainImage = document.getElementById("watch-main-image");
  const thumbnails = document.querySelectorAll(".watch-thumbnail");
  const orderForm = document.getElementById("watch-order-form");
  const successBox = document.getElementById("watch-success");
  const submitButton = orderForm
  ? orderForm.querySelector('button[type="submit"]')
  : null;

let isSubmitting = false;

  if (
    !modal ||
    !overlay ||
    !closeButton ||
    !cards.length
  ) {
    return;
  }
  let selectedWatch = null;
  function openModal(card) {

  const name = card.dataset.name || "";
  const price = card.dataset.price || "";
  const code = card.dataset.code || "";
  const description = card.dataset.description || "";

  const image1 = card.dataset.image1 || "";
  const image2 = card.dataset.image2 || "";
  const image3 = card.dataset.image3 || "";
  selectedWatch = {
  name: name,
  price: price,
  code: code
};

  
  const title = document.getElementById("watch-modal-title");
  const modalPrice = document.getElementById("watch-modal-price");
  const modalDescription = document.getElementById("watch-modal-description");

  const thumb1 = document.getElementById("thumb-1");
  const thumb2 = document.getElementById("thumb-2");
  const thumb3 = document.getElementById("thumb-3");

  const thumbnails = document.querySelectorAll(".watch-thumbnail");
  

  title.textContent = name;
  modalPrice.textContent = price;
  modalDescription.textContent = description;

  mainImage.src = image1;
  mainImage.alt = name;

  thumb1.src = image1;
  thumb2.src = image2;
  thumb3.src = image3;

  thumb1.alt = name + " - vue 1";
  thumb2.alt = name + " - vue 2";
  thumb3.alt = name + " - vue 3";

  modal.hidden = false;

  requestAnimationFrame(function () {

    modal.classList.add("is-open");

    document.body.classList.add("modal-open");

  });



  }

  function closeModal() {

    modal.classList.remove("is-open");

    document.body.classList.remove("modal-open");

    setTimeout(function () {

      modal.hidden = true;

    }, 300);

  }

  cards.forEach(function (card) {
  card.addEventListener("click", function () {
    openModal(card);
  });
});

thumbnails.forEach(function (thumbnail) {
  thumbnail.addEventListener("click", function () {
    const thumbnailImage = thumbnail.querySelector("img");

    if (!thumbnailImage || !thumbnailImage.src) {
      return;
    }

    mainImage.src = thumbnailImage.src;
    mainImage.alt = thumbnailImage.alt;

    thumbnails.forEach(function (item) {
      item.classList.remove("active");
    });

    thumbnail.classList.add("active");
  });
});
  if (orderForm) {
  orderForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // منع double click
    if (isSubmitting) {
      return;
    }

    // نتأكد أن الساعة مختارة
    if (!selectedWatch) {
      alert("Veuillez sélectionner une montre.");
      return;
    }

    // الطلب بدا
    isSubmitting = true;

    // نعطل زر Commander
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Envoi en cours...";
    }

    const customerName = orderForm.querySelector('[name="name"]').value.trim();
    const phone = orderForm.querySelector('[name="phone"]').value.trim();
    const city = orderForm.querySelector('[name="city"]').value.trim();

    const numericPrice = Number(
      selectedWatch.price.replace(/[^\d.,]/g, "").replace(",", ".")
    );

    const orderData = {
      customer_name: customerName,
      phone: phone,
      city: city,
      product_name: selectedWatch.name,
      product_code: selectedWatch.code,
      quantity: 1,
      price: numericPrice
    };

    try {
      const response = await fetch("https://linstant-backend-production.up.railway.app/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de la commande");
      }

      console.log("Commande enregistrée :", result);

    orderForm.hidden = true;

if (successBox) {
  successBox.hidden = false;
}

setTimeout(function () {

  // نسدو الـ modal من بعد جوج ثواني
  closeModal();

  // نرجعو كلشي للحالة الأصلية
  setTimeout(function () {

    orderForm.reset();
    orderForm.hidden = false;

    if (successBox) {
      successBox.hidden = true;
    }

    isSubmitting = false;

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Commander";
    }

  }, 300);

}, 2000);

    } catch (error) {

  console.error("Erreur commande :", error);

  isSubmitting = false;

  if (submitButton) {
    submitButton.disabled = false;
    submitButton.textContent = "Commander";
  }

  alert("Une erreur est survenue. Veuillez réessayer.");
}
  });
}
  closeButton.addEventListener("click", closeModal);

  overlay.addEventListener("click", closeModal);

  document.addEventListener("keydown", function(e){

    if(e.key === "Escape"){

      closeModal();

    }

  });

}

function initCollectionSelector() {
  const selectionSection = document.querySelector(
    ".section-collection-entry"
  );

  const selectButtons = document.querySelectorAll(
    ".collection-select-button"
  );

  const collectionPanels = document.querySelectorAll(
    ".watch-collection-panel"
  );

  if (
    !selectionSection ||
    !selectButtons.length ||
    !collectionPanels.length
  ) {
    console.error("Collection selector: élément HTML manquant.");
    return;
  }

  function showCollection(collectionName) {
    collectionPanels.forEach(function (panel) {
      const isSelected =
        panel.dataset.collectionPanel === collectionName;

      panel.hidden = !isSelected;
    });

    const selectedPanel = document.querySelector(
      '[data-collection-panel="' + collectionName + '"]'
    );

    if (selectedPanel) {
      window.setTimeout(function () {
        selectedPanel.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 50);
    }
  }

  selectButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const collectionName =
        button.dataset.targetCollection;

      showCollection(collectionName);
    });
  });
}
/*==================================

==================================*/
function initGoldFlowBackground() {
  const background = document.querySelector(".gold-flow-bg");

  const hero = document.querySelector(".hero--home, .page-hero");

  if (!background || !hero) {
    return;
  }

  function updateBackground() {
    const triggerPoint = hero.offsetHeight * 0.7;

    if (window.scrollY > triggerPoint) {
      background.classList.add("show");
    } else {
      background.classList.remove("show");
    }
  }

  updateBackground();

  window.addEventListener("scroll", updateBackground);
}