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

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);



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
  closeOverlay(orderOverlay, "order-open");
  openOverlay(menuOverlay, "menu-open");
});

addEventOnElements(menuCloseButtons, "click", function (event) {
  event.preventDefault();
  closeOverlay(menuOverlay, "menu-open");
});

addEventOnElements(orderOpenButtons, "click", function (event) {
  event.preventDefault();
  closeOverlay(menuOverlay, "menu-open");
  openOverlay(orderOverlay, "order-open");
});

addEventOnElements(orderCloseButtons, "click", function (event) {
  event.preventDefault();
  closeOverlay(orderOverlay, "order-open");
});




/**
 * BACKBENCHER MENU DATA
 * (You can edit/add items here later if your menu changes)
 */

const backbencherMenu = [
  // Veg Entrees & Drinks
  { id: "samosa-chat",        name: "Samosa Chat",            price: 11.99, category: "Veg Entrees" },
  { id: "aloo-chat",          name: "Aloo Chat",              price: 10.99, category: "Veg Entrees" },
  { id: "paneer-manchurian",  name: "Paneer Manchurian",      price: 15.99, category: "Veg Entrees" },
  { id: "gobhi-manchurian",   name: "Gobhi Manchurian",       price: 15.99, category: "Veg Entrees" },
  { id: "paneer-tikka-wrap",  name: "Paneer Tikka Wrap",      price: 15.99, category: "Veg Entrees" },
  { id: "chicken-tikka-wrap", name: "Chicken Tikka Wrap",     price: 15.99, category: "Veg Entrees" },

  { id: "aloo-paratha-1",     name: "Aloo Paratha (1pc)",     price: 8.99,  category: "Parathas" },
  { id: "gobhi-paratha-1",    name: "Gobhi Paratha (1pc)",    price: 8.99,  category: "Parathas" },
  { id: "muli-paratha-1",     name: "Muli Paratha (1pc)",     price: 8.99,  category: "Parathas" },
  { id: "aloo-paratha-2",     name: "Aloo Paratha (2pcs)",    price: 15.99, category: "Parathas" },
  { id: "gobhi-paratha-2",    name: "Gobhi Paratha (2pcs)",   price: 15.99, category: "Parathas" },
  { id: "muli-paratha-2",     name: "Muli Paratha (2pcs)",    price: 15.99, category: "Parathas" },

  { id: "pickle",             name: "Pickle",                 price: 1.59,  category: "Sides" },
  { id: "curd",               name: "Curd",                   price: 2.99,  category: "Sides" },

  { id: "ginger-chai",        name: "Ginger Chai",            price: 3.99,  category: "Chai & Beverages" },
  { id: "masala-chai",        name: "Masala Chai",            price: 3.99,  category: "Chai & Beverages" },
  { id: "coffee",             name: "Coffee",                 price: 4.99,  category: "Chai & Beverages" },
  { id: "mango-lassi",        name: "Mango Lassi",            price: 8.99,  category: "Chai & Beverages" },
  { id: "badam-milk",         name: "Badam Milk",             price: 8.99,  category: "Chai & Beverages" },
  { id: "cheeku-shake",       name: "Cheeku Shake",           price: 8.99,  category: "Chai & Beverages" },
  { id: "custard-apple-shake",name: "Custard Apple Shake",    price: 8.99,  category: "Chai & Beverages" },
  { id: "orange-juice",       name: "Orange Fresh Juice",     price: 8.99,  category: "Fresh Juice" },
  { id: "apple-juice",        name: "Apple Fresh Juice",      price: 8.99,  category: "Fresh Juice" },
  { id: "mixed-juice",        name: "Mixed Fresh Juice",      price: 10.99, category: "Fresh Juice" },
  { id: "carrot-juice",       name: "Carrot Fresh Juice",     price: 8.99,  category: "Fresh Juice" },

  // Salads & Curries
  { id: "chicken-tikka-salad",name: "Chicken Tikka Salad",    price: 15.99, category: "Salads" },
  { id: "paneer-tikka-salad", name: "Paneer Tikka Salad",     price: 15.99, category: "Salads" },
  { id: "quinoa-salad",       name: "Quinoa Salad",           price: 15.99, category: "Salads" },

  { id: "dal-makhni",         name: "Dal Makhni",             price: 19.99, category: "Curries" },
  { id: "shahi-paneer",       name: "Shahi Paneer",           price: 20.99, category: "Curries" },
  { id: "aloo-gobhi",         name: "Aloo Gobhi",             price: 19.99, category: "Curries" },
  { id: "bhindi",             name: "Bhindi",                 price: 20.99, category: "Curries" },
  { id: "palak-paneer",       name: "Palak Paneer",           price: 20.99, category: "Curries" },
  { id: "butter-chicken",     name: "Butter Chicken",         price: 21.99, category: "Curries" },
  { id: "kadhai-chicken",     name: "Kadhai Chicken",         price: 21.99, category: "Curries" },

  // Combos
  { id: "dal-makhni-rice",    name: "Dal Makhni & Rice",      price: 15.99, category: "Combos" },
  { id: "any-curry-rice",     name: "Any Curry & Rice",       price: 16.99, category: "Combos" },
  { id: "chai-paratha-1",     name: "Chai & Paratha (1pc)",   price: 11.99, category: "Combos" },
  { id: "chai-paratha-2",     name: "Chai & Paratha (2pcs)",  price: 16.99, category: "Combos" },
  { id: "special-thali",      name: "Special Thali Combo",    price: 21.99, category: "Combos" },
  { id: "thali-combo",        name: "Thali Combo",            price: 18.99, category: "Combos" },

  { id: "fish-ribs",          name: "Fish Ribs",              price: 17.99, category: "Combos" },
  { id: "chilli-chicken",     name: "Chilli Chicken",         price: 17.99, category: "Combos" },
  { id: "chicken-65",         name: "Chicken 65",             price: 17.99, category: "Combos" },

  { id: "jeera-rice",         name: "Jeera Rice",             price: 6.99,  category: "Rice & Pasta" },
  { id: "plain-rice",         name: "Plain Rice",             price: 5.99,  category: "Rice & Pasta" },

  { id: "white-pasta-paneer", name: "White Sauce Pasta (Paneer)", price: 15.99, category: "Rice & Pasta" },
  { id: "red-pasta-paneer",   name: "Red Sauce Pasta (Paneer)",   price: 15.99, category: "Rice & Pasta" },
  { id: "white-pasta-chicken",name: "White Sauce Pasta (Chicken)",price: 15.99, category: "Rice & Pasta" },
  { id: "red-pasta-chicken",  name: "Red Sauce Pasta (Chicken)",  price: 15.99, category: "Rice & Pasta" },

  { id: "pizza-veg",          name: "Indian Style Pizza (Veg)",   price: 14.99, category: "Pizza" },
  { id: "pizza-nonveg",       name: "Indian Style Pizza (Non-Veg)", price: 14.99, category: "Pizza" },

  // Sandwiches
  { id: "veg-sandwich",       name: "Vegetable Sandwich (Non-grilled)", price: 10.99, category: "Sandwich" },
  { id: "veg-sandwich-grill", name: "Vegetable Sandwich (Grilled)",     price: 12.99, category: "Sandwich" },
  { id: "cheese-chutney-sand",name: "Cheese Chutney Sandwich",         price: 10.99, category: "Sandwich" },
  { id: "pita-sandwich",      name: "Pita Sandwich (Chicken or Paneer)",price: 15.99, category: "Sandwich" },
  { id: "paneer-tikka-bread", name: "Paneer Tikka with Bread",          price: 19.99, category: "Sandwich" },
  { id: "chicken-tikka-bread",name: "Chicken Tikka with Bread",         price: 19.99, category: "Sandwich" },

  // Sweets & snacks
  { id: "gulab-jamun",        name: "2pcs Gulab Jammun",      price: 4.99,  category: "Sweet & Snacks" },
  { id: "samosa-snack",       name: "Samosa",                 price: 3.99,  category: "Sweet & Snacks" },
  { id: "bun-maska",          name: "Bun Maska",              price: 2.99,  category: "Sweet & Snacks" },
  { id: "pav-bhaji",          name: "Pav Bhaji",              price: 14.99, category: "Sweet & Snacks" },
  { id: "chole-kulcha",       name: "Chole Kulcha",           price: 15.99, category: "Sweet & Snacks" }
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

  const categories = Array.from(new Set(backbencherMenu.map(item => item.category)));
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

    backbencherMenu
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
  const item = backbencherMenu.find(m => m.id === itemId);
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
      `BackBencher order from ${name}\n` +
      (phone ? `Phone: ${phone}\n` : "") +
      `\nItems:\n${lines.join("\n")}\n\nTotal: ${formatPrice(total)}\n\nNotes:\n${notes || "-"}`;

    // Show a quick confirmation
    alert(`Thank you, ${name}! Your order will now open in your email app.`);

    // Send via default mail client (front-end only, no backend needed)
    const mailto =
      "mailto:tbbencher@gmail.com" +
      "?subject=" + encodeURIComponent("BackBencher order from " + name) +
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
