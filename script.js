/* ================================================
   PORTFOLIO — script.js
   Handles: nav scroll, mobile menu, fade-in, filter
   ================================================ */

// --- Nav: add .scrolled class on scroll ---
const nav = document.getElementById("nav");
if (nav) {
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
  };
  window.addEventListener("scroll", onScroll, {passive: true});
  onScroll(); // run once on load
}

// --- Mobile hamburger menu ---
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger.classList.remove("open");
    });
  });
}

// --- Project image carousels (prev/next) with pager dots ---
function initProjectCarousels() {
  document.querySelectorAll(".project-card-full").forEach((card) => {
    const carousel = card.querySelector(".project-carousel");
    if (!carousel) return;
    const imgs = Array.from(carousel.querySelectorAll("img"));
    if (!imgs.length) return;
    let idx = imgs.findIndex((i) => i.classList.contains("active"));
    if (idx === -1) idx = 0;
    imgs.forEach((img, i) => img.classList.toggle("active", i === idx));

    const prev = card.querySelector(".project-prev");
    const next = card.querySelector(".project-next");

    // Create or locate pager dots container (placed between image and content)
    let dotsContainer = card.querySelector(".carousel-dots");
    const projectImage = card.querySelector(".project-image");
    const projectContent = card.querySelector(".project-content");
    if (!dotsContainer) {
      dotsContainer = document.createElement("div");
      dotsContainer.className = "carousel-dots";
      if (projectContent && projectContent.parentNode) {
        projectContent.parentNode.insertBefore(dotsContainer, projectContent);
      } else if (projectImage) {
        projectImage.parentNode.insertBefore(
          dotsContainer,
          projectImage.nextSibling,
        );
      }
    }

    // Build dots
    const dots = [];
    dotsContainer.innerHTML = "";
    imgs.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "carousel-dot" + (i === idx ? " active" : "");
      b.setAttribute("aria-label", `Show image ${i + 1}`);
      b.addEventListener("click", (e) => {
        e.preventDefault();
        show(i);
      });
      dotsContainer.appendChild(b);
      dots.push(b);
    });

    const show = (newIdx) => {
      imgs[idx].classList.remove("active");
      if (dots[idx]) dots[idx].classList.remove("active");
      idx = (newIdx + imgs.length) % imgs.length;
      imgs[idx].classList.add("active");
      if (dots[idx]) dots[idx].classList.add("active");
    };

    if (prev)
      prev.addEventListener("click", (e) => {
        e.preventDefault();
        show(idx - 1);
      });
    if (next)
      next.addEventListener("click", (e) => {
        e.preventDefault();
        show(idx + 1);
      });

    if (imgs.length <= 1) {
      if (prev) prev.style.display = "none";
      if (next) next.style.display = "none";
      if (dotsContainer) dotsContainer.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", initProjectCarousels);

// --- Scroll fade-in animation ---
const fadeEls = document.querySelectorAll(".fade-in");
if (fadeEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger sibling cards slightly
          const delay = entry.target.closest(
            ".projects-grid, .all-projects-grid, .skills-grid, .edu-cards",
          )
            ? [...entry.target.parentElement.children].indexOf(entry.target) *
              80
            : 0;
          setTimeout(() => entry.target.classList.add("visible"), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    {threshold: 0.12, rootMargin: "0px 0px -40px 0px"},
  );
  fadeEls.forEach((el) => observer.observe(el));
}

// --- Active nav link highlight (home page scroll spy) ---
const sections = document.querySelectorAll("section[id], header[id]");
const navLinks = document.querySelectorAll(".nav-links a");
if (sections.length && navLinks.length) {
  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((a) => {
            const href = a.getAttribute("href");
            const isMatch =
              href === `#${entry.target.id}` ||
              (href === "index.html" && entry.target.id === "home");
            a.classList.toggle("active", isMatch);
          });
        }
      });
    },
    {threshold: 0.4},
  );
  sections.forEach((s) => spyObserver.observe(s));
}

// --- Projects page: category filter ---
const filterBar = document.getElementById("filter-bar");
const projectsContainer = document.getElementById("projects-container");
if (filterBar && projectsContainer) {
  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    // Update active button
    filterBar
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    const cards = projectsContainer.querySelectorAll(".project-card-full");

    cards.forEach((card) => {
      const match = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !match);
      // Re-trigger fade-in for newly shown cards
      if (match && !card.classList.contains("visible")) {
        setTimeout(() => card.classList.add("visible"), 60);
      }
    });
  });
}
