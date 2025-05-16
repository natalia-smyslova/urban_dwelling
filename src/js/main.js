
// BURGER MENU
document.addEventListener("DOMContentLoaded", function () {
  const burger = document.getElementById("burger-button");
  const nav = document.getElementById("mobile-nav");

  burger.addEventListener("click", function () {
    nav.classList.toggle("active");
    burger.classList.toggle("active");
  });
});



// WORKING WITH CARDS

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".grid-container");

  // Здесь идея такая: на больших экранах подгружаются картинки в зависимости от разрешения (поэтому srcset),
  // на мобильном экране при клике меняем картинку на маленькую, без srcset-a, она у нас в макете только на мобильном экране существует.
  // Сбрасываем эту картинку, если экран становится больше.
  // Понимаю, намудрила, но следовала макету. 

  products.forEach((product) => {
    const imageBase = product.image;
    const originalSrc = `img/${imageBase}-small.webp`;
    const altSrc = product.altImage ? `img/${product.altImage}-small.webp` : null;

    const originalSrcset = `
      img/${imageBase}-small.webp 320w,
      img/${imageBase}-medium.webp 768w,
      img/${imageBase}-big.webp 1200w
    `.trim();

    const altSrcset = product.altImage ? `img/${product.altImage}-small.webp 320w` : null;

    // CREATE HTML-TEMPLATE

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-image">
        <img 
          src="${originalSrc}" 
          alt="${product.title}" 
          class="product-img"
          data-original-src="${originalSrc}"
          data-alt-src="${altSrc || ''}"
          data-original-srcset="${originalSrcset}"
          data-alt-srcset="${altSrcset || ''}"
          srcset="${originalSrcset}"
          sizes="(max-width: 390px) 320px, (max-width: 770px) 768px, 1200px"
        >
        ${product.isPromo ? '<button class="btn-action">Акция</button>' : ""}
        <div class="card-details">
          <button class="btn-more">Подробнее</button>
        </div>
      </div>
<div class="price-info">
  <h3 class="card-title title-3">${product.title}</h3>
<div class="card-prices">
  ${product.isPromo
        ? `
        <p class="card-price card-price--action price-current">
          ${product.price}<span class="currency">₽</span>
        </p>
        <p class="card-price card-price--old price-old">
          ${product.oldPrice}<span class="currency">₽</span>
        </p>
      `
        : `
        <p class="card-price price-current">
          ${product.price}<span class="currency">₽</span>
        </p>
      `
      }
</div>
</div>
      </div>
    `;
    container.appendChild(card);
  });

  // TOGGLE PRODUCT'S PHOTO 
  container.addEventListener("click", (e) => {
    if (window.innerWidth > 390) return;

    const img = e.target.closest(".product-img");
    if (!img) return;

    const originalSrc = img.dataset.originalSrc;
    const altSrc = img.dataset.altSrc;
    if (!altSrc) return; 

    const originalSrcset = img.dataset.originalSrcset;
    const altSrcset = img.dataset.altSrcset;

    if (img.src.includes(originalSrc)) {
      img.src = altSrc;
      if (altSrcset) {
        img.srcset = altSrcset;
      } else {
        img.removeAttribute("srcset");
      }
    } else {
      img.src = originalSrc;
      if (originalSrcset) {
        img.srcset = originalSrcset;
      }
    }


  });


});

// REMOVE ALT-IMG IF WINDOW > 390
window.addEventListener("resize", () => {
  const container = document.querySelector(".grid-container");
  const imgs = container.querySelectorAll(".product-img");

  imgs.forEach(img => {
    if (window.innerWidth > 390) {
      img.src = img.dataset.originalSrc;
      if (img.dataset.originalSrcset) {
        img.srcset = img.dataset.originalSrcset;
      } else {
        img.removeAttribute("srcset");
      }
    }
  });
});


// UPDATE PRICE 
document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".grid-container");
  container.addEventListener("click", (e) => {
  const priceInfo = e.target.closest(".price-info");
  if (!priceInfo) return;

  const card = priceInfo.closest(".card");
  const titleEl = card.querySelector(".card-title");
  const productTitle = titleEl?.textContent?.trim();
  if (!productTitle) return;


  const cardIndex = [...container.querySelectorAll(".card")].indexOf(card);

  const product = products[cardIndex];
  if (!product || product.title !== productTitle || product.isPromo) return;

  product.isPromo = true;
  product.oldPrice = product.oldPrice || "7 000";

  const pricesContainer = priceInfo.querySelector(".card-prices");
  pricesContainer.innerHTML = `
    <p class="card-price card-price--action price-current">
      ${product.price}<span class="currency">₽</span>
    </p>
    <p class="card-price card-price--old price-old" style="opacity: 0;">
      ${product.oldPrice}<span class="currency">₽</span>
    </p>
  `;

  // ANIMATION FOR PRICE

  requestAnimationFrame(() => {
    const priceOld = pricesContainer.querySelector(".price-old");
    priceOld.style.transition = "opacity 0.4s ease";
    priceOld.style.opacity = 1;
  });

  const imageContainer = card.querySelector(".card-image");
  if (!imageContainer.querySelector(".btn-action")) {
    const promoBtn = document.createElement("button");
    promoBtn.className = "btn-action";
    promoBtn.textContent = "Акция";
    imageContainer.insertBefore(promoBtn, imageContainer.firstChild);
  }
});

});