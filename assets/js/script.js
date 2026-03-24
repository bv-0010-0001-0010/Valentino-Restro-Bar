'use strict';



/**
 * PRELOAD
 * 
 * loading will be end after document is loaded
 */

const preloader = document.querySelector("[data-preaload]");

window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});



/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * NAVBAR
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("nav-active");
};

const toggleNavbar = function () {
  const shouldOpen = !navbar.classList.contains("active");

  if (shouldOpen) {
    navbar.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("nav-active");
  } else {
    closeNavbar();
  }
}

addEventOnElements(navTogglers, "click", toggleNavbar);

const navbarLinks = document.querySelectorAll(".navbar-link");

addEventOnElements(navbarLinks, "click", function () {
  const href = this.getAttribute("href") || "";
  // Close navbar for internal section links and external links
  const isInternalSectionLink = href.startsWith("#") && href.length > 1;
  const isExternalLink = href.startsWith("./") || href.startsWith("http");

  if (isInternalSectionLink || isExternalLink) {
    closeNavbar();
  }
});

window.addEventListener("hashchange", closeNavbar);



/**
 * HEADER & BACK TOP BTN
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");
const topbar = document.querySelector(".topbar");
const heroSection = document.querySelector(".hero");

let lastScrollPos = 0;

const updateHeroOffset = function () {
  if (!heroSection || !header) return;

  const headerHeight = header.offsetHeight;
  const isTopbarVisible = topbar && window.getComputedStyle(topbar).display !== "none";
  const topbarHeight = isTopbarVisible ? topbar.offsetHeight : 0;

  document.documentElement.style.setProperty("--hero-offset", `${headerHeight + topbarHeight}px`);
};

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollPos = window.scrollY;
}

window.addEventListener("scroll", function () {
  const topbarHeight = topbar && window.getComputedStyle(topbar).display !== "none" ? topbar.offsetHeight : 0;
  const headerHeight = header ? header.offsetHeight : 0;
  const heroBottom = heroSection ? (heroSection.offsetTop + heroSection.offsetHeight) : 0;
  const activationPoint = Math.max(0, heroBottom - topbarHeight - headerHeight);

  if (window.scrollY >= activationPoint) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
    header.classList.remove("hide");
    backTopBtn.classList.remove("active");
  }
});

window.addEventListener("load", updateHeroOffset);
window.addEventListener("resize", updateHeroOffset);
window.addEventListener("load", function () {
  window.dispatchEvent(new Event("scroll"));
});



/**
 * HERO SLIDER
 */

const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];

const updateSliderPos = function () {
  lastActiveSliderItem.classList.remove("active");
  heroSliderItems[currentSlidePos].classList.add("active");
  lastActiveSliderItem = heroSliderItems[currentSlidePos];
}

const slideNext = function () {
  if (currentSlidePos >= heroSliderItems.length - 1) {
    currentSlidePos = 0;
  } else {
    currentSlidePos++;
  }

  updateSliderPos();
}

heroSliderNextBtn.addEventListener("click", slideNext);

const slidePrev = function () {
  if (currentSlidePos <= 0) {
    currentSlidePos = heroSliderItems.length - 1;
  } else {
    currentSlidePos--;
  }

  updateSliderPos();
}

heroSliderPrevBtn.addEventListener("click", slidePrev);

/**
 * auto slide
 */

let autoSlideInterval;

const autoSlide = function () {
  autoSlideInterval = setInterval(function () {
    slideNext();
  }, 7000);
}

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function () {
  clearInterval(autoSlideInterval);
});

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);

window.addEventListener("load", autoSlide);



/**
 * HERO SCROLL PARALLAX (GSAP-LIKE FEEL)
 */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion && heroSection) {
  let rafScheduled = false;

  const renderHeroParallax = function () {
    const activeSlideBg = document.querySelector(".hero [data-hero-slider-item].active .slider-bg");
    if (!activeSlideBg) {
      rafScheduled = false;
      return;
    }

    const heroRect = heroSection.getBoundingClientRect();
    const heroVisible = heroRect.bottom > 0 && heroRect.top < window.innerHeight;

    if (!heroVisible) {
      activeSlideBg.style.removeProperty("--hero-parallax-y");
      rafScheduled = false;
      return;
    }

    const scrolled = Math.max(0, window.scrollY);
    const offset = Math.min(60, scrolled * 0.16);
    activeSlideBg.style.setProperty("--hero-parallax-y", `${offset}px`);

    rafScheduled = false;
  };

  const requestHeroParallax = function () {
    if (rafScheduled) return;
    rafScheduled = true;
    window.requestAnimationFrame(renderHeroParallax);
  };

  window.addEventListener("scroll", requestHeroParallax, { passive: true });
  window.addEventListener("resize", requestHeroParallax);
  window.addEventListener("load", requestHeroParallax);

  addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "click", requestHeroParallax);
}



/**
 * PARALLAX EFFECT
 */

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

window.addEventListener("mousemove", function (event) {

  x = (event.clientX / window.innerWidth * 10) - 5;
  y = (event.clientY / window.innerHeight * 10) - 5;

  // reverse the number eg. 20 -> -20, -5 -> 5
  x = x - (x * 2);
  y = y - (y * 2);

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }

});



/**
 * MENU PDF VIEWER + ORDER OVERLAY
 */

const menuOverlay = document.querySelector("[data-menu-overlay]");
const orderOverlay = document.querySelector("[data-order-overlay]");

const menuOpenButtons = document.querySelectorAll("[data-menu-open]");
const menuCloseButtons = document.querySelectorAll("[data-menu-close]");
const orderOpenButtons = document.querySelectorAll("[data-order-open]");
const orderCloseButtons = document.querySelectorAll("[data-order-close]");

const openOverlay = function (overlayEl, bodyClass) {
  if (!overlayEl) return;
  overlayEl.classList.add("active");
  document.body.classList.add(bodyClass);
};

const closeOverlay = function (overlayEl, bodyClass) {
  if (!overlayEl) return;
  overlayEl.classList.remove("active");
  document.body.classList.remove(bodyClass);
};

addEventOnElements(menuOpenButtons, "click", function (event) {
  event.preventDefault();
  closeNavbar();
  closeOverlay(orderOverlay, "order-open");
  openOverlay(menuOverlay, "menu-open");
});

addEventOnElements(menuCloseButtons, "click", function (event) {
  event.preventDefault();
  closeOverlay(menuOverlay, "menu-open");
});

addEventOnElements(orderOpenButtons, "click", function (event) {
  event.preventDefault();
  closeNavbar();
  closeOverlay(menuOverlay, "menu-open");
  openOverlay(orderOverlay, "order-open");
});

addEventOnElements(orderCloseButtons, "click", function (event) {
  event.preventDefault();
  closeOverlay(orderOverlay, "order-open");
});




/**
 * VALENTINO MENU DATA
 * Updated with actual items from ValentinoRestro&BarMenu.pdf
 */

const valentinoMenu = [
  // Soups & Salads
  { id: "roasted-tomato-basil-soup",    name: "Roasted Tomato & Basil Soup",     price: 14.00, category: "Soups & Salads" },
  { id: "wild-mushroom-veloute",        name: "Wild Mushroom Velouté",           price: 14.00, category: "Soups & Salads" },
  { id: "caesar-salad",                 name: "Caesar Salad",                    price: 13.99, category: "Soups & Salads" },
  { id: "chicken-caesar-salad",         name: "Chicken Caesar Salad",            price: 16.49, category: "Soups & Salads" },
  { id: "quinoa-salad",                 name: "Quinoa Salad",                    price: 14.99, category: "Soups & Salads" },

  // Nibbles & Sharing
  { id: "onion-rings",                  name: "Onion Rings",                     price: 11.99, category: "Nibbles & Sharing" },
  { id: "cajun-fries",                  name: "Cajun Fries",                     price: 11.99, category: "Nibbles & Sharing" },
  { id: "mountain-masala-papad",        name: "Mountain Masala Papad",           price: 11.00, category: "Nibbles & Sharing" },
  { id: "loaded-nachos",                name: "Loaded Nachos",                   price: 17.00, category: "Nibbles & Sharing" },
  { id: "housemade-hummus",             name: "Housemade Hummus",                price: 14.00, category: "Nibbles & Sharing" },
  { id: "spinach-artichoke-dip",        name: "Spinach Artichoke Dip",           price: 18.00, category: "Nibbles & Sharing" },
  { id: "jalapeno-poppers",             name: "Jalapeño Poppers",                price: 14.00, category: "Nibbles & Sharing" },
  { id: "corn-chips-guacamole",         name: "Corn Chips & Guacamole",          price: 15.00, category: "Nibbles & Sharing" },

  // Grill & Seafood
  { id: "paneer-tikka-kebab",           name: "Paneer Tikka Kebab (6)",          price: 19.49, category: "Grill & Seafood" },
  { id: "chicken-tikka-kebab",          name: "Chicken Tikka Kebab (6)",         price: 21.99, category: "Grill & Seafood" },
  { id: "malai-kebab",                  name: "Malai Kebab (6)",                 price: 21.99, category: "Grill & Seafood" },
  { id: "lamb-cutlets",                 name: "Lamb Cutlets (4)",                price: 30.99, category: "Grill & Seafood" },
  { id: "tandoori-prawns",              name: "Tandoori Prawns (8)",             price: 25.49, category: "Grill & Seafood" },
  { id: "calamari-rings",               name: "Calamari Rings",                  price: 17.99, category: "Grill & Seafood" },
  { id: "tempura-shrimp",               name: "Tempura Shrimp (8)",              price: 18.99, category: "Grill & Seafood" },

  // Burgers
  { id: "veg-burger",                   name: "Veg Burger",                      price: 17.99, category: "Burgers" },
  { id: "cheese-burger",                name: "Cheese Burger",                   price: 21.99, category: "Burgers" },
  { id: "ultra-crunchy-chicken-burger", name: "Ultra Crunchy Chicken Burger",    price: 20.99, category: "Burgers" },

  // Wings
  { id: "crispy-wings",                 name: "Crispy Wings (8 pcs)",            price: 18.00, category: "Wings" },

  // Pasta
  { id: "basil-pasta",                  name: "Basil Pasta",                     price: 22.49, category: "Pasta" },
  { id: "seafood-pasta",                name: "Seafood Pasta",                   price: 28.49, category: "Pasta" },
  { id: "spicy-prawn-pasta",            name: "Spicy Prawn Pasta",               price: 26.49, category: "Pasta" },
  { id: "boscaiola-pasta",              name: "Boscaiola Pasta",                 price: 26.49, category: "Pasta" },
  { id: "arrabbiata-pasta",             name: "Arrabbiata Pasta",                price: 23.49, category: "Pasta" },
  { id: "lamb-ragu-pasta",              name: "Lamb Ragù Pasta",                 price: 27.49, category: "Pasta" },
  { id: "valentino-veggie-pasta",       name: "Valentino Veggie Pasta",          price: 22.49, category: "Pasta" },
  { id: "sizzling-garlic-prawns",       name: "Sizzling Garlic Prawns",          price: 18.49, category: "Pasta" },

  // Tacos
  { id: "cauliflower-taco",             name: "Cauliflower Taco",                price: 14.99, category: "Tacos" },
  { id: "chicken-taco",                 name: "Chicken Taco",                    price: 14.99, category: "Tacos" },
  { id: "beef-taco",                    name: "Beef Taco",                       price: 15.99, category: "Tacos" },
  { id: "shrimp-taco",                  name: "Shrimp Taco",                     price: 15.99, category: "Tacos" },

  // Mains
  { id: "paneer-butter-masala",         name: "Paneer Butter Masala",            price: 18.00, category: "Mains" },
  { id: "paneer-tikka-masala",          name: "Paneer Tikka Masala",             price: 19.00, category: "Mains" },
  { id: "butter-chicken",               name: "Butter Chicken",                  price: 21.49, category: "Mains" },
  { id: "chicken-tikka-masala",         name: "Chicken Tikka Masala",            price: 21.49, category: "Mains" },
  { id: "dal-makhani",                  name: "Dal Makhani",                     price: 21.99, category: "Mains" },

  // Rice
  { id: "veg-fried-rice",               name: "Veg Fried Rice",                  price: 17.99, category: "Rice" },
  { id: "egg-fried-rice",               name: "Egg Fried Rice",                  price: 19.99, category: "Rice" },
  { id: "thai-basil-chicken-fried-rice",name: "Thai Basil Chicken Fried Rice",   price: 21.99, category: "Rice" },

  // Breads
  { id: "plain-naan",                   name: "Plain Naan",                      price: 5.00,  category: "Breads" },
  { id: "butter-naan",                  name: "Butter Naan",                     price: 7.00,  category: "Breads" },
  { id: "garlic-naan",                  name: "Garlic Naan",                     price: 7.49,  category: "Breads" },
  { id: "cheese-naan",                  name: "Cheese Naan",                     price: 8.49,  category: "Breads" },
  { id: "cheese-garlic-naan",           name: "Cheese Garlic Naan",              price: 8.49,  category: "Breads" },

  // Trimmings
  { id: "plain-rice",                   name: "Plain Rice",                      price: 6.00,  category: "Trimmings" },
  { id: "jeera-rice",                   name: "Jeera Rice",                      price: 7.00,  category: "Trimmings" },
  { id: "saffron-rice",                 name: "Saffron Rice",                    price: 9.00,  category: "Trimmings" },

  // Desserts
  { id: "nests-gulab-jamun",            name: "Nests Gulab Jamun",               price: 14.99, category: "Desserts" },
  { id: "ny-cheesecake",                name: "New York Cheesecake",             price: 14.99, category: "Desserts" },
  { id: "pistachio-tiramisu",           name: "Pistachio Tiramisu",              price: 15.90, category: "Desserts" },

  // Signature Mocktails
  { id: "cucumber-elderflower-cooler",  name: "Cucumber, Elderflower & White Pepper Cooler", price: 13.50, category: "Signature Mocktails" },
  { id: "kiwi-basil-verde-spritz",      name: "Kiwi & Basil Verde Spritz",       price: 13.50, category: "Signature Mocktails" },
  { id: "watermelon-black-pepper-cooler", name: "Watermelon & Black Pepper Cooler", price: 14.00, category: "Signature Mocktails" },
  { id: "banana-honey-highball",        name: "Banana & Honey Highball",         price: 16.00, category: "Signature Mocktails" },
  { id: "burnt-orange-honey-tonic",     name: "Burnt Orange & Honey Tonic",      price: 15.50, category: "Signature Mocktails" },
  { id: "cranberry-basil-smoked-salt-spritz", name: "Cranberry, Basil & Smoked Salt Spritz", price: 15.00, category: "Signature Mocktails" },
];





/**
 * ORDERING SYSTEM
 */

const orderMenuContainer = document.querySelector("[data-order-menu]");
const cartListEl = document.querySelector("[data-order-cart-list]");
const cartTotalEl = document.querySelector("[data-order-cart-total]");
const orderForm = document.querySelector("[data-order-form]");

const orderCart = new Map();

const formatPrice = value => "$" + value.toFixed(2);

function renderOrderMenu() {
  if (!orderMenuContainer) return;

  const categories = Array.from(new Set(valentinoMenu.map(item => item.category)));
  const fragment = document.createDocumentFragment();

  categories.forEach(category => {
    const section = document.createElement("section");
    section.className = "order-menu-section";

    const heading = document.createElement("h3");
    heading.className = "title-3 order-menu-heading";
    heading.textContent = category;
    section.appendChild(heading);

    const list = document.createElement("ul");
    list.className = "order-menu-list";

    valentinoMenu
      .filter(item => item.category === category)
      .forEach(item => {
        const li = document.createElement("li");
        li.className = "order-menu-item";

        const info = document.createElement("div");
        info.className = "order-menu-item-info";

        const nameEl = document.createElement("p");
        nameEl.className = "body-3";
        nameEl.textContent = item.name;

        const priceEl = document.createElement("span");
        priceEl.className = "label-2";
        priceEl.textContent = formatPrice(item.price);

        info.appendChild(nameEl);
        info.appendChild(priceEl);

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn-secondary order-add-btn";
        btn.dataset.itemId = item.id;

        const t1 = document.createElement("span");
        t1.className = "text text-1";
        t1.textContent = "Add";

        const t2 = document.createElement("span");
        t2.className = "text text-2";
        t2.textContent = "Add";

        btn.appendChild(t1);
        btn.appendChild(t2);

        li.appendChild(info);
        li.appendChild(btn);
        list.appendChild(li);
      });

    section.appendChild(list);
    fragment.appendChild(section);
  });

  orderMenuContainer.innerHTML = "";
  orderMenuContainer.appendChild(fragment);
}

function renderCart() {
  if (!cartListEl || !cartTotalEl) return;

  cartListEl.innerHTML = "";
  let total = 0;

  if (orderCart.size === 0) {
    const empty = document.createElement("li");
    empty.className = "body-4 cart-empty";
    empty.textContent = "Your cart is empty.";
    cartListEl.appendChild(empty);
    cartTotalEl.textContent = "$0.00";
    return;
  }

  orderCart.forEach(({ item, quantity }) => {
    const lineTotal = item.price * quantity;
    total += lineTotal;

    const li = document.createElement("li");
    li.className = "cart-item";

    const nameEl = document.createElement("p");
    nameEl.className = "body-3";
    nameEl.textContent = `${item.name} × ${quantity}`;

    const right = document.createElement("div");
    right.className = "cart-item-actions";

    const priceEl = document.createElement("span");
    priceEl.className = "label-2";
    priceEl.textContent = formatPrice(lineTotal);

    const controls = document.createElement("div");
    controls.className = "cart-qty-controls";

    const minusBtn = document.createElement("button");
    minusBtn.type = "button";
    minusBtn.className = "cart-qty-btn";
    minusBtn.dataset.itemId = item.id;
    minusBtn.dataset.action = "decrease";
    minusBtn.textContent = "−";

    const plusBtn = document.createElement("button");
    plusBtn.type = "button";
    plusBtn.className = "cart-qty-btn";
    plusBtn.dataset.itemId = item.id;
    plusBtn.dataset.action = "increase";
    plusBtn.textContent = "+";

    controls.appendChild(minusBtn);
    controls.appendChild(plusBtn);

    right.appendChild(priceEl);
    right.appendChild(controls);

    li.appendChild(nameEl);
    li.appendChild(right);

    cartListEl.appendChild(li);
  });

  cartTotalEl.textContent = formatPrice(total);
}

function addToCart(itemId) {
  const item = valentinoMenu.find(m => m.id === itemId);
  if (!item) return;

  const existing = orderCart.get(itemId);
  if (existing) {
    existing.quantity += 1;
  } else {
    orderCart.set(itemId, { item, quantity: 1 });
  }

  renderCart();
}

function changeCartQuantity(itemId, delta) {
  const entry = orderCart.get(itemId);
  if (!entry) return;
  entry.quantity += delta;
  if (entry.quantity <= 0) orderCart.delete(itemId);
  renderCart();
}

/* event: click Add */
if (orderMenuContainer) {
  orderMenuContainer.addEventListener("click", function (event) {
    const btn = event.target.closest(".order-add-btn");
    if (!btn) return;
    addToCart(btn.dataset.itemId);
  });
}

/* event: +/- in cart */
if (cartListEl) {
  cartListEl.addEventListener("click", function (event) {
    const btn = event.target.closest(".cart-qty-btn");
    if (!btn) return;
    const itemId = btn.dataset.itemId;
    const action = btn.dataset.action;
    const delta = action === "increase" ? 1 : -1;
    changeCartQuantity(itemId, delta);
  });
}

/* event: Place Order */
if (orderForm) {
  orderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (orderCart.size === 0) {
      alert("Your cart is empty.");
      return;
    }

    const formData = new FormData(orderForm);
    const name = (formData.get("customerName") || "Guest").trim();
    const phone = (formData.get("customerPhone") || "").trim();
    const notes = (formData.get("orderNotes") || "").trim();

    let total = 0;
    const lines = [];

    orderCart.forEach(({ item, quantity }) => {
      const lineTotal = item.price * quantity;
      total += lineTotal;
      lines.push(`${quantity} × ${item.name} — ${formatPrice(lineTotal)}`);
    });

    const summary =
      `Valentino Restro & Bar order from ${name}\n` +
      (phone ? `Phone: ${phone}\n` : "") +
      `\nItems:\n${lines.join("\n")}\n\nTotal: ${formatPrice(total)}\n\nNotes:\n${notes || "-"}`;

    // Show a quick confirmation
    alert(`Thank you, ${name}! Your order will now open in your email app.`);

    // Send via default mail client (front-end only, no backend needed)
    const mailto =
      "mailto:atvalentinoo@gmail.com" +
      "?subject=" + encodeURIComponent("Valentino order from " + name) +
      "&body=" + encodeURIComponent(summary);

    window.location.href = mailto;

    // reset cart + close overlay
    orderCart.clear();
    renderCart();
    orderForm.reset();
    closeOverlay(orderOverlay, "order-open");
  });
}

/* initial render */
renderOrderMenu();
renderCart();
