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

/* event: Reservation Form Submission */
const reservationForm = document.getElementById("reservationForm");
const reservationDateInput = document.getElementById("reservationDate");
const reservationTimeSelect = document.getElementById("reservationTime");
const reservationPersonSelect = document.getElementById("person");
const googleAppsScriptUrl = typeof window.GOOGLE_APPS_SCRIPT_URL === "string"
  ? window.GOOGLE_APPS_SCRIPT_URL.trim()
  : typeof GOOGLE_APPS_SCRIPT_URL === "string"
    ? GOOGLE_APPS_SCRIPT_URL.trim()
    : "";

const reservationSettings = window.RESERVATION_SETTINGS || {};
const SLOT_CAPACITY = Number(reservationSettings.slotCapacity) > 0 ? Number(reservationSettings.slotCapacity) : 70;
const OPENING_HOUR_24 = Number.isInteger(reservationSettings.openingHour24)
  ? Number(reservationSettings.openingHour24)
  : 10;
const LAST_BOOKING_HOUR_24 = Number.isInteger(reservationSettings.lastBookingHour24)
  ? Number(reservationSettings.lastBookingHour24)
  : 22;
const BLOCKED_WINDOWS = Array.isArray(reservationSettings.blockedWindows) ? reservationSettings.blockedWindows : [];
const ENABLE_LIVE_AVAILABILITY = reservationSettings.enableLiveAvailability === true;

const availabilityCache = new Map();
let availabilityRequestCounter = 0;

const toIsoDate = function (date) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 10);
};

const parseTimeToMinutes = function (timeValue) {
  if (!timeValue) return null;

  if (/^\d{2}:\d{2}$/.test(timeValue)) {
    const [hours, minutes] = timeValue.split(":").map(Number);
    return hours * 60 + minutes;
  }

  const twelveHourMatch = timeValue.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (!twelveHourMatch) return null;

  let hours = Number(twelveHourMatch[1]);
  const minutes = Number(twelveHourMatch[2]);
  const meridiem = twelveHourMatch[3].toUpperCase();

  if (hours === 12) {
    hours = meridiem === "AM" ? 0 : 12;
  } else if (meridiem === "PM") {
    hours += 12;
  }

  return hours * 60 + minutes;
};

const normalizeSlotTime = function (timeValue) {
  const minutes = parseTimeToMinutes(timeValue);
  if (minutes === null) return "";
  const hours = Math.floor(minutes / 60).toString().padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
};

const formatTimeLabelFrom24Hour = function (hour24) {
  const period = hour24 >= 12 ? "PM" : "AM";
  const twelveHour = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${String(twelveHour).padStart(2, "0")}:00 ${period}`;
};

const buildSlotCatalog = function () {
  const slots = [];

  for (let hour = OPENING_HOUR_24; hour <= LAST_BOOKING_HOUR_24; hour++) {
    slots.push({
      value: formatTimeLabelFrom24Hour(hour),
      hhmm: `${String(hour).padStart(2, "0")}:00`
    });
  }

  return slots;
};

const slotCatalog = buildSlotCatalog();

const parseGuestCount = function (personValue) {
  const parsed = Number(personValue);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  return 1;
};

const parseDateParts = function (isoDate) {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null;
  const [year, month, day] = isoDate.split("-").map(Number);
  return { year, month, day };
};

const isTodayDate = function (isoDate) {
  return isoDate === toIsoDate(new Date());
};

const isSameDate = function (dateA, dateB) {
  return dateA.year === dateB.year && dateA.month === dateB.month && dateA.day === dateB.day;
};

const parseBlockedScopeDate = function (scopeValue) {
  if (!scopeValue || typeof scopeValue !== "string") return null;
  const trimmed = scopeValue.trim().toLowerCase();

  if (trimmed === "today") return parseDateParts(toIsoDate(new Date()));
  if (trimmed === "tomorrow") {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return parseDateParts(toIsoDate(tomorrow));
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return parseDateParts(trimmed);

  return null;
};

const isSlotBlockedByWindow = function (isoDate, hhmm) {
  const dateParts = parseDateParts(isoDate);
  if (!dateParts) return false;

  const slotMinutes = parseTimeToMinutes(hhmm);
  if (slotMinutes === null) return false;

  return BLOCKED_WINDOWS.some((windowRule) => {
    const ruleDate = parseBlockedScopeDate(windowRule.scope);
    if (!ruleDate || !isSameDate(dateParts, ruleDate)) return false;

    const startMinutes = parseTimeToMinutes(windowRule.start);
    const endMinutes = parseTimeToMinutes(windowRule.end);
    if (startMinutes === null || endMinutes === null) return false;

    return slotMinutes >= startMinutes && slotMinutes <= endMinutes;
  });
};

const ensureSlotOptions = function () {
  if (!reservationTimeSelect) return;

  const selectedValue = reservationTimeSelect.value;
  reservationTimeSelect.innerHTML = "";

  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = "Select Time";
  reservationTimeSelect.appendChild(placeholderOption);

  slotCatalog.forEach((slot) => {
    const option = document.createElement("option");
    option.value = slot.value;
    option.textContent = slot.value;
    option.dataset.baseLabel = slot.value;
    option.dataset.hhmm = slot.hhmm;
    reservationTimeSelect.appendChild(option);
  });

  const stillExists = Array.from(reservationTimeSelect.options).some((option) => option.value === selectedValue);
  reservationTimeSelect.value = stillExists ? selectedValue : "";
};

const setSlotStatusMessage = function (message, type) {
  const formError = document.getElementById("formError");
  const formSuccess = document.getElementById("formSuccess");

  if (!formError || !formSuccess) return;

  if (!message) {
    formError.style.display = "none";
    return;
  }

  formSuccess.style.display = "none";

  if (type === "success") {
    formError.style.display = "none";
    formSuccess.textContent = message;
    formSuccess.style.display = "block";
    return;
  }

  formError.textContent = message;
  formError.style.display = "block";
};

const getSlotAvailability = async function (isoDate, forceRefresh = false) {
  if (!isoDate) return null;

  if (!ENABLE_LIVE_AVAILABILITY) {
    const localOnly = {
      capacity: SLOT_CAPACITY,
      slots: []
    };
    availabilityCache.set(isoDate, localOnly);
    return localOnly;
  }

  if (!forceRefresh && availabilityCache.has(isoDate)) {
    return availabilityCache.get(isoDate);
  }

  if (!googleAppsScriptUrl) {
    const fallback = {
      capacity: SLOT_CAPACITY,
      slots: slotCatalog.map((slot) => ({
        time: slot.value,
        booked: 0,
        seatsLeft: SLOT_CAPACITY,
        isOpen: true,
        isBlocked: false
      }))
    };

    availabilityCache.set(isoDate, fallback);
    return fallback;
  }

  const requestId = ++availabilityRequestCounter;
  const availabilityUrl = `${googleAppsScriptUrl}?action=getAvailability&date=${encodeURIComponent(isoDate)}`;
  const response = await fetch(availabilityUrl, { method: "GET" });
  const rawText = await response.text();
  let payload;

  try {
    payload = JSON.parse(rawText);
  } catch (parseError) {
    throw new Error("Could not read availability response from reservation service.");
  }

  if (!response.ok || payload.status !== "success") {
    throw new Error(payload.message || "Unable to fetch slot availability right now.");
  }

  if (requestId !== availabilityRequestCounter) {
    return availabilityCache.get(isoDate) || payload.data;
  }

  const normalized = {
    capacity: Number(payload.data && payload.data.capacity) > 0 ? Number(payload.data.capacity) : SLOT_CAPACITY,
    slots: Array.isArray(payload.data && payload.data.slots) ? payload.data.slots : []
  };

  availabilityCache.set(isoDate, normalized);
  return normalized;
};

const updateTimeSlotOptions = async function (forceRefresh = false) {
  if (!reservationTimeSelect || !reservationDateInput) return;

  const selectedDate = reservationDateInput.value;
  const guestCount = parseGuestCount(reservationPersonSelect ? reservationPersonSelect.value : "1");
  const selectedOptionValue = reservationTimeSelect.value;

  ensureSlotOptions();

  if (!selectedDate) {
    setSlotStatusMessage("Please select your reservation date first.", "error");
    return;
  }

  let availabilityData;

  try {
    availabilityData = await getSlotAvailability(selectedDate, forceRefresh);
  } catch (error) {
    if (ENABLE_LIVE_AVAILABILITY) {
      setSlotStatusMessage(error.message || "Unable to fetch slot availability right now.", "error");
    }
    availabilityData = {
      capacity: SLOT_CAPACITY,
      slots: []
    };
  }

  const slotMap = new Map();
  availabilityData.slots.forEach((slotEntry) => {
    const normalizedTime = normalizeSlotTime(slotEntry.time);
    if (!normalizedTime) return;

    const booked = Number(slotEntry.booked);
    const seatsLeft = Number.isFinite(Number(slotEntry.seatsLeft))
      ? Number(slotEntry.seatsLeft)
      : Math.max(0, availabilityData.capacity - (Number.isFinite(booked) ? booked : 0));

    slotMap.set(normalizedTime, {
      booked: Number.isFinite(booked) ? booked : 0,
      seatsLeft: Math.max(0, seatsLeft),
      isOpen: slotEntry.isOpen !== false,
      isBlocked: Boolean(slotEntry.isBlocked)
    });
  });

  let hasAvailableSlot = false;

  Array.from(reservationTimeSelect.options).forEach((option) => {
    if (!option.value) return;

    const hhmm = option.dataset.hhmm || normalizeSlotTime(option.value);
    const baseLabel = option.dataset.baseLabel || option.value;
    const slotInfo = slotMap.get(hhmm) || {
      booked: 0,
      seatsLeft: availabilityData.capacity,
      isOpen: true,
      isBlocked: false
    };

    const blockedByWindow = isSlotBlockedByWindow(selectedDate, hhmm);
    const isClosedByLastBooking = parseTimeToMinutes(hhmm) > (LAST_BOOKING_HOUR_24 * 60);
    const isSlotClosed = blockedByWindow || isClosedByLastBooking || slotInfo.isBlocked || !slotInfo.isOpen;
    const cannotFitParty = slotInfo.seatsLeft < guestCount;
    const isSoldOut = slotInfo.seatsLeft <= 0;

    option.disabled = isSlotClosed || isSoldOut || cannotFitParty;

    // Keep slot labels clean on UI; availability state is represented by enabled/disabled only.
    option.textContent = baseLabel;

    if (!option.disabled) {
      hasAvailableSlot = true;
    }
  });

  const selectedOptionStillValid = Array.from(reservationTimeSelect.options).some(
    (option) => option.value === selectedOptionValue && !option.disabled
  );

  reservationTimeSelect.value = selectedOptionStillValid ? selectedOptionValue : "";

  if (!hasAvailableSlot) {
    setSlotStatusMessage("Sorry, all slots are full or unavailable for the selected date.", "error");
  } else {
    setSlotStatusMessage("", "error");
  }
};

const validateCurrentSelection = async function (guestCount, selectedDate, selectedTime) {
  if (!selectedDate || !selectedTime) {
    return {
      valid: false,
      message: "Please select reservation date and time."
    };
  }

  const normalizedTime = normalizeSlotTime(selectedTime);
  if (!normalizedTime) {
    return {
      valid: false,
      message: "Please select a valid reservation time."
    };
  }

  if (isSlotBlockedByWindow(selectedDate, normalizedTime)) {
    return {
      valid: false,
      message: "This slot is blocked for today. Please choose another time."
    };
  }

  const availability = await getSlotAvailability(selectedDate, true);
  const slotEntry = Array.isArray(availability.slots)
    ? availability.slots.find((slot) => normalizeSlotTime(slot.time) === normalizedTime)
    : null;

  const booked = slotEntry && Number.isFinite(Number(slotEntry.booked)) ? Number(slotEntry.booked) : 0;
  const seatsLeft = slotEntry && Number.isFinite(Number(slotEntry.seatsLeft))
    ? Number(slotEntry.seatsLeft)
    : Math.max(0, availability.capacity - booked);
  const isBlocked = Boolean(slotEntry && slotEntry.isBlocked);
  const isOpen = slotEntry ? slotEntry.isOpen !== false : true;

  if (isBlocked || !isOpen) {
    return {
      valid: false,
      message: "This slot is no longer available. Please select another slot."
    };
  }

  if (seatsLeft < guestCount) {
    return {
      valid: false,
      message: "Sorry, all slots are full for this time. Please choose another slot."
    };
  }

  return {
    valid: true,
    seatsLeft
  };
};

const setAnimatedButtonLabel = function (button, label) {
  if (!button) return;

  const primaryText = button.querySelector(".text-1");
  const secondaryText = button.querySelector(".text-2");

  if (primaryText) primaryText.textContent = label;
  if (secondaryText) secondaryText.textContent = label;
};

if (reservationForm) {
  if (reservationDateInput) {
    reservationDateInput.min = toIsoDate(new Date());
    reservationDateInput.addEventListener("change", function () {
      updateTimeSlotOptions(true);
    });
  }

  if (reservationPersonSelect) {
    reservationPersonSelect.addEventListener("change", function () {
      updateTimeSlotOptions(false);
    });
  }

  ensureSlotOptions();

  reservationForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formError = document.getElementById("formError");
    const formSuccess = document.getElementById("formSuccess");

    // Reset messages
    formError.style.display = "none";
    formSuccess.style.display = "none";

    // Collect form data
    const formData = new FormData(reservationForm);
    const name = (formData.get("name") || "").trim();
    const phone = (formData.get("phone") || "").trim();
    const email = (formData.get("email") || "").trim();
    const person = (formData.get("person") || "").trim();
    const reservationDate = (formData.get("reservation-date") || "").trim();
    const reservationTime = (formData.get("reservation-time") || "").trim();
    const message = (formData.get("message") || "").trim();
    const guestCount = parseGuestCount(person);

    // Validate required fields
    if (!name || !phone || !email || !person || !reservationDate || !reservationTime) {
      formError.textContent = "Please fill in all required fields.";
      formError.style.display = "block";
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      formError.textContent = "Please enter a valid email address.";
      formError.style.display = "block";
      return;
    }

    const selectedDateParts = parseDateParts(reservationDate);
    const todayParts = parseDateParts(toIsoDate(new Date()));

    if (!selectedDateParts || !todayParts) {
      formError.textContent = "Please choose a valid reservation date.";
      formError.style.display = "block";
      return;
    }

    if (
      selectedDateParts.year < todayParts.year ||
      (selectedDateParts.year === todayParts.year && selectedDateParts.month < todayParts.month) ||
      (selectedDateParts.year === todayParts.year && selectedDateParts.month === todayParts.month && selectedDateParts.day < todayParts.day)
    ) {
      formError.textContent = "Past dates are not available for reservation.";
      formError.style.display = "block";
      return;
    }

    const normalizedSelectedTime = normalizeSlotTime(reservationTime);
    if (!normalizedSelectedTime) {
      formError.textContent = "Please select a valid reservation time.";
      formError.style.display = "block";
      return;
    }

    const isAfterLastBooking = parseTimeToMinutes(normalizedSelectedTime) > LAST_BOOKING_HOUR_24 * 60;
    if (isAfterLastBooking) {
      formError.textContent = "Reservations are closed after 10:00 PM.";
      formError.style.display = "block";
      return;
    }

    if (isTodayDate(reservationDate) && isSlotBlockedByWindow(reservationDate, normalizedSelectedTime)) {
      formError.textContent = "Bookings are blocked today between 6:00 PM and 9:00 PM.";
      formError.style.display = "block";
      return;
    }

    try {
      const availabilityValidation = await validateCurrentSelection(guestCount, reservationDate, reservationTime);

      if (!availabilityValidation.valid) {
        formError.textContent = availabilityValidation.message;
        formError.style.display = "block";
        await updateTimeSlotOptions(true);
        return;
      }
    } catch (availabilityError) {
      formError.textContent = availabilityError.message || "Unable to validate availability at this time.";
      formError.style.display = "block";
      return;
    }

    // Disable submit button to prevent double submission
    const submitBtn = document.getElementById("submitBtn");
    const originalBtnText = submitBtn.querySelector(".text-1")?.textContent || "Book Us In";
    submitBtn.disabled = true;
    setAnimatedButtonLabel(submitBtn, "Sending...");

    try {
      if (!googleAppsScriptUrl) {
        formError.textContent = "Reservation email service is not configured. Add the deployed Google Apps Script URL in assets/js/config.js.";
        formError.style.display = "block";
        return;
      }

      // Send data to Google Apps Script
      const response = await fetch(googleAppsScriptUrl, {
        method: "POST",
        body: JSON.stringify({
          action: "createReservation",
          name,
          phone,
          email,
          person,
          guestCount,
          "reservation-date": reservationDate,
          "reservation-time": reservationTime,
          message
        })
      });

      const responseText = await response.text();
      let result;

      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Reservation response parse error:", parseError, responseText);
        throw new Error("The reservation service returned an unexpected response.");
      }

      if (!response.ok) {
        throw new Error(result.message || "The reservation service could not process your request.");
      }

      if (result.status === "success") {
        formSuccess.textContent = result.message;
        formSuccess.style.display = "block";
        reservationForm.reset();
        availabilityCache.delete(reservationDate);
        await updateTimeSlotOptions(true);

        // Hide success message after 5 seconds and scroll to top
        setTimeout(() => {
          formSuccess.style.display = "none";
          reservationForm.scrollIntoView({ behavior: "smooth" });
        }, 5000);
      } else {
        formError.textContent = result.message || "An error occurred. Please try again.";
        formError.style.display = "block";
      }
    } catch (error) {
      console.error("Reservation form error:", error);
      formError.textContent = error.message || "Network error. Please check your connection and try again.";
      formError.style.display = "block";
    } finally {
      // Re-enable submit button
      submitBtn.disabled = false;
      setAnimatedButtonLabel(submitBtn, originalBtnText);
    }
  });
}

/* initial render */
renderOrderMenu();
renderCart();
