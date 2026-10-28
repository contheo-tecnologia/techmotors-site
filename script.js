const TECH_MOTORS_WHATSAPP = "5516999999999";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const navItems = document.querySelectorAll(".nav-link");

  // Efeito do menu superior flutuante ao rolar a pagina + ScrollSpy ativo
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }

    let currentId = "home";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 160;
      if (window.scrollY >= top) {
        currentId = sec.getAttribute("id");
      }
    });

    navItems.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });
  });

  // Menu mobile
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    navItems.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        navItems.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      });
    });
  }

  // Ano atual no rodape
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Carrossel Infinito de Marcas Atendidas (Auto-rolagem + Setas)
  const brandsTrack = document.getElementById("brandsTrack");
  const brandPrevBtn = document.getElementById("brandPrevBtn");
  const brandNextBtn = document.getElementById("brandNextBtn");

  if (brandsTrack) {
    let isAnimatingBrand = false;
    let brandAutoTimer = null;

    function getSlideStepWidth() {
      const firstSlide = brandsTrack.querySelector(".brand-slide");
      return firstSlide ? firstSlide.getBoundingClientRect().width : 200;
    }

    function nextBrandSlide() {
      if (isAnimatingBrand) return;
      isAnimatingBrand = true;
      const stepWidth = getSlideStepWidth();

      brandsTrack.style.transition = "transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)";
      brandsTrack.style.transform = `translateX(-${stepWidth}px)`;

      setTimeout(() => {
        brandsTrack.style.transition = "none";
        const first = brandsTrack.firstElementChild;
        if (first) {
          brandsTrack.appendChild(first);
        }
        brandsTrack.style.transform = "translateX(0)";
        isAnimatingBrand = false;
      }, 460);
    }

    function prevBrandSlide() {
      if (isAnimatingBrand) return;
      isAnimatingBrand = true;
      const stepWidth = getSlideStepWidth();

      brandsTrack.style.transition = "none";
      const last = brandsTrack.lastElementChild;
      if (last) {
        brandsTrack.insertBefore(last, brandsTrack.firstElementChild);
      }
      brandsTrack.style.transform = `translateX(-${stepWidth}px)`;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          brandsTrack.style.transition = "transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)";
          brandsTrack.style.transform = "translateX(0)";
          setTimeout(() => {
            isAnimatingBrand = false;
          }, 460);
        });
      });
    }

    function startBrandAutoPlay() {
      clearInterval(brandAutoTimer);
      brandAutoTimer = setInterval(nextBrandSlide, 2600);
    }

    brandNextBtn?.addEventListener("click", () => {
      nextBrandSlide();
      startBrandAutoPlay();
    });

    brandPrevBtn?.addEventListener("click", () => {
      prevBrandSlide();
      startBrandAutoPlay();
    });

    brandsTrack.addEventListener("mouseenter", () => clearInterval(brandAutoTimer));
    brandsTrack.addEventListener("mouseleave", startBrandAutoPlay);

    startBrandAutoPlay();
  }

  // Carrossel do Banner Principal Dividido (Hero)
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".dot");
  const slideCaption = document.getElementById("heroSlideCaption");
  let currentSlide = 0;
  let slideTimer = null;

  function goToSlide(index) {
    slides[currentSlide]?.classList.remove("active");
    dots[currentSlide]?.classList.remove("active");
    currentSlide = index;
    slides[currentSlide]?.classList.add("active");
    dots[currentSlide]?.classList.add("active");
    if (slideCaption && slides[currentSlide]?.dataset.caption) {
      slideCaption.textContent = slides[currentSlide].dataset.caption;
    }
  }

  function startCarousel() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => {
      goToSlide((currentSlide + 1) % slides.length);
    }, 5500);
  }

  if (slides.length > 1) {
    dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        goToSlide(idx);
        startCarousel();
      });
    });
    startCarousel();
  }

  // Botoes de Produtos (GM, Power, Rocam) -> rola para Contato e preenche o campo
  const vehicleInput = document.getElementById("vehicleModel");
  const contatoSection = document.getElementById("contato");

  document.querySelectorAll(".select-product-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (vehicleInput) {
        vehicleInput.value = btn.dataset.product;
      }
      if (contatoSection) {
        contatoSection.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => vehicleInput?.focus(), 500);
      }
    });
  });

  document.querySelectorAll(".quick-tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      if (vehicleInput) {
        vehicleInput.value = tag.dataset.engine;
        vehicleInput.focus();
      }
    });
  });

  // Envio do Formulario de Contato para o WhatsApp
  const quoteForm = document.getElementById("whatsappQuoteForm");
  if (quoteForm) {
    quoteForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const clientName = document.getElementById("clientName").value.trim();
      const vehicleModel = document.getElementById("vehicleModel").value.trim();
      const selectedServices = Array.from(
        document.querySelectorAll('input[name="serviceItem"]:checked')
      ).map((cb) => cb.value);

      const servicesText =
        selectedServices.length > 0
          ? selectedServices.map((s) => `• ${s}`).join("\n")
          : "• Avaliação técnica";

      const message = [
        "*ATENDIMENTO SITE - TECH MOTORS (Ribeirão Preto)*",
        `*Nome/Oficina:* ${clientName}`,
        `*Veículo/Cabeçote:* ${vehicleModel}`,
        "*Interesse:*",
        servicesText,
      ].join("\n");

      const url = `https://wa.me/${TECH_MOTORS_WHATSAPP}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener");
    });
  }
});
