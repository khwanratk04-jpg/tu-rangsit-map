"use strict";

/* =========================================
   1. ตั้งค่าและข้อมูลเริ่มต้น
========================================= */

const STORAGE_KEY = "tu-rangsit-map-data-v1";
const ADMIN_USER = "admin";
const ADMIN_PASS = "tu-demo-2026";

const initialPlaces = [
  { id: "gym45", name: "ยิม 4-5", category: "กีฬา", description: "อาคารกีฬา ยิม 4-5", mapUrl: "" },
  { id: "social", name: "คณะสังคม", category: "การเรียน", description: "คณะสังคมศาสตร์", mapUrl: "" },
  { id: "swimming", name: "สระว่ายน้ำ", category: "กีฬา", description: "สระว่ายน้ำภายในมหาวิทยาลัย", mapUrl: "" },
  { id: "naga", name: "ลานพญานาค", category: "ส่วนกลาง", description: "พื้นที่ส่วนกลางบริเวณลานพญานาค", mapUrl: "" },
  { id: "sc123", name: "SC123", category: "การเรียน", description: "อาคาร SC123", mapUrl: "" },
  { id: "education", name: "ศึกษาศาสตร์", category: "การเรียน", description: "สถานที่เกี่ยวข้องกับคณะศึกษาศาสตร์", mapUrl: "" },
  { id: "sakor", name: "ศกร", category: "การเรียน", description: "สถานที่ ศกร", mapUrl: "" },
  { id: "br1", name: "บร.1", category: "การเรียน", description: "อาคาร บร.1", mapUrl: "" },
  { id: "puay", name: "ป๋วย", category: "การเรียน", description: "อาคารป๋วย", mapUrl: "" },
  { id: "green", name: "กรีน", category: "ส่วนกลาง", description: "พื้นที่กรีน", mapUrl: "" },
  { id: "sakor-way", name: "ศกรบอกทางขั้นสอง", category: "อื่น ๆ", description: "จุดที่ระบุชื่อว่าศกรบอกทางขั้นสอง", mapUrl: "" },
  { id: "dorm", name: "หอใน", category: "ที่พัก", description: "หอพักภายในมหาวิทยาลัย", mapUrl: "" },
  { id: "interzone", name: "อินเตอร์โซน", category: "ส่วนกลาง", description: "พื้นที่อินเตอร์โซน", mapUrl: "" },
  { id: "tiwson", name: "ทิวสน", category: "ส่วนกลาง", description: "พื้นที่ทิวสน", mapUrl: "" },
  { id: "tangfu", name: "ถังฟุ่", category: "ส่วนกลาง", description: "สถานที่ตามรายการที่ได้รับ", mapUrl: "" },
  { id: "chiang1", name: "เชียงหนึ่ง", category: "การเรียน", description: "สถานที่เชียงหนึ่ง", mapUrl: "" },
  { id: "engineering", name: "วิศวะ", category: "การเรียน", description: "คณะ/อาคารวิศวกรรมศาสตร์", mapUrl: "" },
  { id: "siit", name: "SIIT", category: "การเรียน", description: "สถาบันเทคโนโลยีนานาชาติสิรินธร", mapUrl: "" },
  { id: "architecture", name: "ถาปัด", category: "การเรียน", description: "สถานที่ตามชื่อที่ได้รับ", mapUrl: "" },
  { id: "chiang2", name: "เชียงสอง", category: "การเรียน", description: "สถานที่เชียงสอง", mapUrl: "" },
  { id: "br4", name: "บร.4", category: "การเรียน", description: "อาคาร บร.4", mapUrl: "" },
  { id: "hospital", name: "โรงบาล", category: "ส่วนกลาง", description: "สถานที่ตามชื่อที่ได้รับ", mapUrl: "" },
  { id: "hospitalMall", name: "ห้างรพ", category: "ส่วนกลาง", description: "สถานที่ตามชื่อที่ได้รับ", mapUrl: "" },
  { id: "medical", name: "คณะแพทย์", category: "การเรียน", description: "คณะแพทยศาสตร์", mapUrl: "" }
];

const categorySymbols = {
  "การเรียน": "📚",
  "กีฬา": "🏃",
  "ที่พัก": "🏠",
  "ส่วนกลาง": "🌳",
  "อื่น ๆ": "📍"
};

let data = loadData();
let selectedCategory = "ทั้งหมด";
let selectedPlaceId = null;
let isAdmin = false;

/* =========================================
   2. ฟังก์ชันพื้นฐาน
========================================= */

function createId(prefix = "item") {
  return prefix + "-" + Date.now().toString(36) +
    "-" + Math.random().toString(36).slice(2, 8);
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed.places) && Array.isArray(parsed.routes)) {
        return {
          places: parsed.places,
          routes: parsed.routes
        };
      }
    }
  } catch (error) {
    console.warn("อ่านข้อมูลเดิมไม่สำเร็จ", error);
  }

  return {
    places: initialPlaces.map(place => ({ ...place })),
    routes: []
  };
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    alert("บันทึกข้อมูลไม่สำเร็จ พื้นที่จัดเก็บอาจเต็ม");
    console.error(error);
    return false;
  }
}

function getPlace(placeId) {
  return data.places.find(place => place.id === placeId);
}

function getPlaceName(placeId) {
  return getPlace(placeId)?.name || "ไม่พบสถานที่";
}

function getCategorySymbol(category) {
  return categorySymbols[category] || "📍";
}

function normalizeText(value) {
  return String(value || "").toLocaleLowerCase("th").trim();
}

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/* =========================================
   3. ค้นหาและแสดงรายการสถานที่
========================================= */

const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const placeGrid = document.getElementById("placeGrid");
const placeCount = document.getElementById("placeCount");
const emptyState = document.getElementById("emptyState");
const detailPanel = document.getElementById("detailPanel");

function getFilteredPlaces() {
  const query = normalizeText(searchInput.value);

  return data.places.filter(place => {
    const matchesCategory =
      selectedCategory === "ทั้งหมด" ||
      place.category === selectedCategory;

    const searchableText = normalizeText(
      place.name + " " + place.category + " " + place.description
    );

    return matchesCategory && searchableText.includes(query);
  });
}

function renderPlaces() {
  const places = getFilteredPlaces();

  placeCount.textContent = places.length + " สถานที่";
  placeGrid.innerHTML = "";

  emptyState.classList.toggle("hidden", places.length !== 0);

  places.forEach((place, index) => {
    const card = document.createElement("article");

    card.className =
      "place-card" + (place.id === selectedPlaceId ? " selected" : "");

    card.innerHTML = `
      <div class="place-art">
        <span class="place-symbol">${getCategorySymbol(place.category)}</span>
        <span class="place-number">${String(index + 1).padStart(2, "0")}</span>
      </div>
      <div class="place-card-body">
        <span class="category-label">${escapeHTML(place.category)}</span>
        <h3>${escapeHTML(place.name)}</h3>
        <p>${escapeHTML(place.description || "ยังไม่มีคำอธิบายสถานที่")}</p>
        <button class="button button-primary" type="button"
          data-view-place="${escapeHTML(place.id)}">
          ดูรายละเอียด
        </button>
      </div>
    `;

    placeGrid.appendChild(card);
  });
}

searchInput.addEventListener("input", renderPlaces);

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  renderPlaces();
  searchInput.focus();
});

document.getElementById("categoryFilters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  selectedCategory = button.dataset.category;

  document.querySelectorAll(".filter").forEach(filter => {
    filter.classList.toggle("active", filter === button);
  });

  renderPlaces();
});

placeGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-view-place]");
  if (!button) return;

  showPlaceDetails(button.dataset.viewPlace);

  if (window.innerWidth <= 900) {
    detailPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

/* =========================================
   4. แสดงรายละเอียดและวิดีโอของสถานที่
========================================= */

function getRoutesForPlace(placeId) {
  return data.routes.filter(route =>
    route.fromId === placeId || route.toId === placeId
  );
}

function getYouTubeEmbedUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    let videoId = "";

    if (host === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] || "";
    } else if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v") || "";
      } else {
        const match = url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/);
        if (match) videoId = match[1];
      }
    }

    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return "";
    return "https://www.youtube-nocookie.com/embed/" + videoId;
  } catch {
    return "";
  }
}

/* =========================================
   ระบบให้คะแนนและรีวิวเส้นทาง
   หมายเหตุ: รีวิวเก็บใน LocalStorage ของเบราว์เซอร์นี้
========================================= */

const REVIEW_STORAGE_KEY = "tu-rangsit-map-reviews-v1";
let routeReviews = loadReviews();
let selectedReviewStars = {};

function loadReviews() {
  try {
    const saved = localStorage.getItem(REVIEW_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : {};

    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch (error) {
    console.warn("อ่านรีวิวเดิมไม่สำเร็จ", error);
    return {};
  }
}

function saveReviews() {
  try {
    localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(routeReviews));
    return true;
  } catch (error) {
    alert("บันทึกรีวิวไม่สำเร็จ พื้นที่จัดเก็บอาจเต็ม");
    return false;
  }
}

function renderReviewSection(routeId) {
  const reviews = Array.isArray(routeReviews[routeId])
    ? routeReviews[routeId]
    : [];

  const average = reviews.length
    ? reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length
    : 0;

  const stars = average
    ? "★".repeat(Math.round(average)) + "☆".repeat(5 - Math.round(average))
    : "☆☆☆☆☆";

  return `
    <section class="route-review" data-review-section="${escapeHTML(routeId)}">
      <div class="route-review-heading">
        <h4>รีวิวเส้นทางนี้</h4>
        <div class="route-review-average">
          <strong>${average ? average.toFixed(1) : "—"}</strong>
          <span class="review-stars" aria-label="คะแนนเฉลี่ย">${stars}</span>
          <small>${reviews.length} รีวิว</small>
        </div>
      </div>
      <form class="route-review-form" data-review-form="${escapeHTML(routeId)}">
        <label>ให้คะแนนเส้นทาง</label>
        <div class="review-star-picker" role="group" aria-label="เลือกคะแนน 1 ถึง 5 ดาว">
          ${[1, 2, 3, 4, 5].map(n => `
            <button class="review-star-button ${Number(selectedReviewStars[routeId] || 0) >= n ? "selected" : ""}"
              type="button" data-review-star="${n}" data-review-route="${escapeHTML(routeId)}"
              aria-label="${n} ดาว" aria-pressed="${Number(selectedReviewStars[routeId] || 0) >= n}">★</button>
          `).join("")}
        </div>
        <label>ความคิดเห็น (ไม่บังคับ)
          <textarea name="reviewText" rows="3" maxlength="500" placeholder="บอกเล่าประสบการณ์การใช้เส้นทางนี้"></textarea>
        </label>
        <button class="button button-primary" type="submit">ส่งรีวิว</button>
      </form>
      <div class="route-review-list">
        ${reviews.length ? reviews.slice().reverse().map(review => `
          <article class="route-review-item">
            <div class="route-review-item-top">
              <span class="review-stars">${"★".repeat(Math.max(0, Math.min(5, Number(review.rating) || 0)))}${"☆".repeat(5 - Math.max(0, Math.min(5, Number(review.rating) || 0)))}</span>
              <small>${escapeHTML(review.date || "")}</small>
            </div>
            ${review.text
              ? `<p>${escapeHTML(review.text)}</p>`
              : `<p class="helper-text">ไม่ได้เขียนความคิดเห็นเพิ่มเติม</p>`}
          </article>
        `).join("") : `<p class="helper-text">ยังไม่มีรีวิว เป็นคนแรกที่ให้คะแนนเส้นทางนี้ได้เลย</p>`}
      </div>
    </section>
  `;
}

document.addEventListener("click", event => {
  const star = event.target.closest("[data-review-star]");
  if (!star) return;

  const routeId = star.dataset.reviewRoute;
  selectedReviewStars[routeId] = Number(star.dataset.reviewStar);

  const section = star.closest("[data-review-section]");
  if (!section) return;

  const picker = section.querySelector(".review-star-picker");

  picker.querySelectorAll("[data-review-star]").forEach(button => {
    const selected =
      Number(button.dataset.reviewStar) <= selectedReviewStars[routeId];

    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
});

document.addEventListener("submit", event => {
  const form = event.target.closest("[data-review-form]");
  if (!form) return;

  event.preventDefault();

  const routeId = form.dataset.reviewForm;
  const rating = Number(selectedReviewStars[routeId] || 0);
  const text = String(new FormData(form).get("reviewText") || "").trim();

  if (rating < 1 || rating > 5) {
    alert("กรุณาเลือกคะแนนดาวก่อนส่งรีวิว");
    return;
  }

  if (!data.routes.some(route => route.id === routeId)) {
    alert("ไม่พบเส้นทางนี้ กรุณาลองใหม่อีกครั้ง");
    return;
  }

  const list = Array.isArray(routeReviews[routeId])
    ? routeReviews[routeId]
    : [];

  list.push({
    rating,
    text,
    date: new Date().toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  });

  routeReviews[routeId] = list;

  if (!saveReviews()) return;

  selectedReviewStars[routeId] = 0;

  // แสดงคะแนนเฉลี่ยและรีวิวใหม่ทันที
  const fromId = routeFrom.value;
  const toId = routeTo.value;

  if (selectedPlaceId && getPlace(selectedPlaceId)) {
    showPlaceDetails(selectedPlaceId);
  }

  if (fromId && toId) {
    document.getElementById("findRoute").click();
  }
});

function showPlaceDetails(placeId) {
  const place = getPlace(placeId);
  if (!place) return;

  selectedPlaceId = placeId;
  renderPlaces();

  const routes = getRoutesForPlace(placeId);

  const routeCards = routes.length
    ? routes.map(route => {
        const embedUrl = getYouTubeEmbedUrl(route.videoUrl);

        return `
          <article class="video-card">
            <span class="route-badge">วิดีโอแนะนำเส้นทาง</span>
            <h4>${escapeHTML(route.name)}</h4>
            <p class="route-endpoints">
              ${escapeHTML(getPlaceName(route.fromId))}
              → ${escapeHTML(getPlaceName(route.toId))}
            </p>
            ${route.description
              ? `<p>${escapeHTML(route.description)}</p>`
              : ""}
            ${embedUrl
              ? `<iframe class="video-frame"
                  src="${escapeHTML(embedUrl)}"
                  title="${escapeHTML(route.name)}"
                  loading="lazy"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write;
                    encrypted-media; gyroscope; picture-in-picture;
                    web-share"
                  allowfullscreen></iframe>`
              : `<p>ไม่สามารถฝังวิดีโอนี้ได้</p>`
            }
            <a class="button button-light" target="_blank"
              rel="noopener noreferrer"
              href="${escapeHTML(route.videoUrl)}">
              เปิดวิดีโอใน YouTube
            </a>
            ${renderReviewSection(route.id)}
          </article>
        `;
      }).join("")
    : `<p class="helper-text">ยังไม่มีวิดีโอเส้นทางสำหรับสถานที่นี้</p>`;

  const safeMapUrl = isValidHttpUrl(place.mapUrl) ? place.mapUrl : "";

  detailPanel.innerHTML = `
    <div class="detail-heading">
      <span class="category-label">${escapeHTML(place.category)}</span>
      <h3>${escapeHTML(place.name)}</h3>
    </div>
    <p class="detail-description">
      ${escapeHTML(place.description || "ยังไม่มีคำอธิบายสถานที่")}
    </p>
    <div class="detail-actions">
      ${safeMapUrl
        ? `<a class="button button-primary" target="_blank"
            rel="noopener noreferrer" href="${escapeHTML(safeMapUrl)}">
            เปิดแผนที่
          </a>`
        : ""}
      <button class="button button-light" type="button"
        data-route-to="${escapeHTML(place.id)}">
        ดูเส้นทางมาที่นี่
      </button>
    </div>
    <h4>วิดีโอแนะนำเส้นทาง</h4>
    ${routeCards}
  `;
}

detailPanel.addEventListener("click", event => {
  const button = event.target.closest("[data-route-to]");
  if (!button) return;

  document.getElementById("routeTo").value = button.dataset.routeTo;
  document.getElementById("routeFrom").value = "";
  document.getElementById("routeResults").innerHTML = "";
  document.getElementById("routeFrom").focus();

  document.querySelector(".route-section").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

/* =========================================
   5. ระบบค้นหาวิดีโอจากต้นทางไปปลายทาง
========================================= */

const routeFrom = document.getElementById("routeFrom");
const routeTo = document.getElementById("routeTo");
const routeResults = document.getElementById("routeResults");

function fillPlaceSelect(select, placeholder) {
  if (!select) return;

  const previousValue = select.value;

  select.innerHTML = `
    <option value="">${escapeHTML(placeholder)}</option>
    ${data.places.map(place => `
      <option value="${escapeHTML(place.id)}">
        ${escapeHTML(place.name)}
      </option>
    `).join("")}
  `;

  if (data.places.some(place => place.id === previousValue)) {
    select.value = previousValue;
  }
}

function refreshPlaceSelects() {
  fillPlaceSelect(routeFrom, "เลือกจุดเริ่มต้น");
  fillPlaceSelect(routeTo, "เลือกจุดหมายปลายทาง");

  fillPlaceSelect(
    document.getElementById("adminRouteFrom"),
    "เลือกจุดเริ่มต้น"
  );

  fillPlaceSelect(
    document.getElementById("adminRouteTo"),
    "เลือกจุดหมายปลายทาง"
  );
}

function findMatchingRoutes(fromId, toId) {
  return data.routes.filter(route =>
    route.fromId === fromId && route.toId === toId
  );
}

const swapRouteButton = document.getElementById("swapRoute");

if (swapRouteButton) {
  swapRouteButton.addEventListener("click", () => {
    const oldFrom = routeFrom.value;
    routeFrom.value = routeTo.value;
    routeTo.value = oldFrom;
    routeResults.innerHTML = "";
  });
}

document.getElementById("findRoute").addEventListener("click", () => {
  const fromId = routeFrom.value;
  const toId = routeTo.value;

  if (!fromId || !toId) {
    routeResults.innerHTML =
      '<p class="error-text">กรุณาเลือกทั้งจุดเริ่มต้นและจุดหมายปลายทาง</p>';
    return;
  }

  if (fromId === toId) {
    routeResults.innerHTML =
      '<p class="error-text">จุดเริ่มต้นและจุดหมายปลายทางต้องไม่ใช่จุดเดียวกัน</p>';
    return;
  }

  const routes = findMatchingRoutes(fromId, toId);

  if (!routes.length) {
    routeResults.innerHTML = `
      <div class="empty-state">
        <h3>ยังไม่มีวิดีโอเส้นทางนี้</h3>
        <p>แอดมินสามารถเพิ่มวิดีโอสำหรับเส้นทางนี้ได้ในระบบจัดการ</p>
      </div>
    `;
    return;
  }

  routeResults.innerHTML = routes.map(route => {
    const embedUrl = getYouTubeEmbedUrl(route.videoUrl);

    return `
      <article class="route-result-item">
        <span class="route-badge">พบวิดีโอเส้นทาง</span>
        <h3>${escapeHTML(route.name)}</h3>
        <div class="route-endpoints">
          ${escapeHTML(getPlaceName(route.fromId))}
          → ${escapeHTML(getPlaceName(route.toId))}
        </div>
        ${route.description
          ? `<p>${escapeHTML(route.description)}</p>`
          : ""}
        ${embedUrl
          ? `<iframe class="video-frame"
              src="${escapeHTML(embedUrl)}"
              title="${escapeHTML(route.name)}"
              loading="lazy"
              referrerpolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write;
                encrypted-media; gyroscope; picture-in-picture;
                web-share"
              allowfullscreen></iframe>`
          : ""}
        <p>
          <a class="button button-primary" target="_blank"
            rel="noopener noreferrer"
            href="${escapeHTML(route.videoUrl)}">
            เปิดวิดีโอ
          </a>
        </p>
        ${renderReviewSection(route.id)}
      </article>
    `;
  }).join("");
});

/* =========================================
   6. ระบบเปิด-ปิดหน้าต่างและเข้าสู่ระบบ
========================================= */

const loginDialog = document.getElementById("loginDialog");
const adminDialog = document.getElementById("adminDialog");

document.getElementById("adminOpen").addEventListener("click", () => {
  if (isAdmin) {
    renderAdminLists();
    adminDialog.showModal();
  } else {
    document.getElementById("loginError").textContent = "";
    loginDialog.showModal();
  }
});

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => {
    document.getElementById(button.dataset.close).close();
  });
});

document.getElementById("loginForm").addEventListener("submit", event => {
  event.preventDefault();

  const username = document.getElementById("adminUsername").value;
  const password = document.getElementById("adminPassword").value;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    isAdmin = true;
    loginDialog.close();
    document.getElementById("loginForm").reset();
    document.getElementById("loginError").textContent = "";

    renderAdminLists();
    adminDialog.showModal();
  } else {
    document.getElementById("loginError").textContent =
      "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
  }
});

document.getElementById("adminLogout").addEventListener("click", () => {
  isAdmin = false;
  adminDialog.close();
  resetPlaceForm();
  resetRouteForm();
});

document.querySelectorAll(".admin-tab").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".admin-tab").forEach(tab => {
      tab.classList.toggle("active", tab === button);
    });

    document.querySelectorAll(".admin-content").forEach(section => {
      section.classList.toggle("hidden", section.id !== button.dataset.tab);
    });
  });
});

function requireAdmin() {
  if (!isAdmin) {
    alert("กรุณาเข้าสู่ระบบแอดมินก่อน");
    return false;
  }

  return true;
}

/* =========================================
   7. เพิ่ม แก้ไข และลบสถานที่
========================================= */

const placeForm = document.getElementById("placeForm");

function resetPlaceForm() {
  placeForm.reset();
  document.getElementById("editPlaceId").value = "";
  document.getElementById("placeFormTitle").textContent = "เพิ่มสถานที่ใหม่";
}

document.getElementById("cancelPlaceEdit").addEventListener("click", resetPlaceForm);

placeForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!requireAdmin()) return;

  const editId = document.getElementById("editPlaceId").value;
  const name = document.getElementById("placeName").value.trim();
  const category = document.getElementById("placeCategory").value;
  const description = document.getElementById("placeDescription").value.trim();
  const mapUrl = document.getElementById("placeMap").value.trim();

  if (!name) {
    alert("กรุณากรอกชื่อสถานที่");
    return;
  }

  if (mapUrl && !isValidHttpUrl(mapUrl)) {
    alert("ลิงก์แผนที่ต้องเป็น URL ที่ถูกต้อง");
    return;
  }

  if (editId) {
    const place = getPlace(editId);
    if (!place) return;

    Object.assign(place, { name, category, description, mapUrl });
  } else {
    data.places.push({
      id: createId("place"),
      name,
      category,
      description,
      mapUrl
    });
  }

  if (!saveData()) return;

  resetPlaceForm();
  refreshAll();
  renderAdminLists();
});

function editPlace(placeId) {
  if (!requireAdmin()) return;

  const place = getPlace(placeId);
  if (!place) return;

  document.getElementById("editPlaceId").value = place.id;
  document.getElementById("placeName").value = place.name;
  document.getElementById("placeCategory").value = place.category;
  document.getElementById("placeDescription").value = place.description || "";
  document.getElementById("placeMap").value = place.mapUrl || "";
  document.getElementById("placeFormTitle").textContent = "แก้ไขสถานที่";

  document.getElementById("placesTab").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function deletePlace(placeId) {
  if (!requireAdmin()) return;

  const place = getPlace(placeId);
  if (!place) return;

  const confirmed = confirm(
    `ต้องการลบ "${place.name}" ใช่หรือไม่?\nวิดีโอที่เชื่อมกับสถานที่นี้จะถูกลบด้วย`
  );

  if (!confirmed) return;

  data.places = data.places.filter(item => item.id !== placeId);
  data.routes = data.routes.filter(route =>
    route.fromId !== placeId && route.toId !== placeId
  );

  if (selectedPlaceId === placeId) {
    selectedPlaceId = null;

    detailPanel.innerHTML = `
      <div class="detail-placeholder">
        <span class="placeholder-icon">⌖</span>
        <h3>เลือกสถานที่ที่ต้องการ</h3>
        <p>รายละเอียดและวิดีโอแนะนำเส้นทางจะแสดงที่นี่</p>
      </div>
    `;
  }

  if (!saveData()) return;

  resetPlaceForm();
  resetRouteForm();
  refreshAll();
  renderAdminLists();
}

/* =========================================
   8. เพิ่ม แก้ไข และลบวิดีโอเส้นทาง
========================================= */

const routeForm = document.getElementById("routeForm");

function resetRouteForm() {
  routeForm.reset();
  document.getElementById("editRouteId").value = "";
  document.getElementById("routeFormTitle").textContent =
    "เพิ่มวิดีโอเส้นทาง";
}

document.getElementById("cancelRouteEdit").addEventListener("click", resetRouteForm);

routeForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!requireAdmin()) return;

  const editId = document.getElementById("editRouteId").value;
  const name = document.getElementById("routeName").value.trim();
  const fromId = document.getElementById("adminRouteFrom").value;
  const toId = document.getElementById("adminRouteTo").value;
  const videoUrl = document.getElementById("routeVideo").value.trim();
  const description = document.getElementById("routeDescription").value.trim();

  if (!name || !fromId || !toId || !videoUrl) {
    alert("กรุณากรอกข้อมูลที่จำเป็นให้ครบ");
    return;
  }

  if (fromId === toId) {
    alert("จุดเริ่มต้นและจุดหมายปลายทางต้องไม่ใช่จุดเดียวกัน");
    return;
  }

  if (!getPlace(fromId) || !getPlace(toId)) {
    alert("ไม่พบสถานที่ต้นทางหรือปลายทาง");
    return;
  }

  if (!isValidHttpUrl(videoUrl)) {
    alert("กรุณากรอกลิงก์วิดีโอที่ถูกต้อง");
    return;
  }

  if (editId) {
    const route = data.routes.find(item => item.id === editId);
    if (!route) return;

    Object.assign(route, {
      name,
      fromId,
      toId,
      videoUrl,
      description
    });
  } else {
    data.routes.push({
      id: createId("route"),
      name,
      fromId,
      toId,
      videoUrl,
      description
    });
  }

  if (!saveData()) return;

  resetRouteForm();
  refreshAll();
  renderAdminLists();
});

function editRoute(routeId) {
  if (!requireAdmin()) return;

  const route = data.routes.find(item => item.id === routeId);
  if (!route) return;

  document.getElementById("editRouteId").value = route.id;
  document.getElementById("routeName").value = route.name;
  document.getElementById("adminRouteFrom").value = route.fromId;
  document.getElementById("adminRouteTo").value = route.toId;
  document.getElementById("routeVideo").value = route.videoUrl;
  document.getElementById("routeDescription").value = route.description || "";
  document.getElementById("routeFormTitle").textContent = "แก้ไขวิดีโอเส้นทาง";

  document.getElementById("routesTab").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function deleteRoute(routeId) {
  if (!requireAdmin()) return;

  const route = data.routes.find(item => item.id === routeId);
  if (!route) return;

  if (!confirm(`ต้องการลบวิดีโอ "${route.name}" ใช่หรือไม่?`)) return;

  data.routes = data.routes.filter(item => item.id !== routeId);

  if (!saveData()) return;

  refreshAll();
  renderAdminLists();
}

/* =========================================
   9. แสดงรายการจัดการในหน้าแอดมิน
========================================= */

const adminPlaceList = document.getElementById("adminPlaceList");
const adminRouteList = document.getElementById("adminRouteList");

function renderAdminLists() {
  if (!isAdmin) return;

  adminPlaceList.innerHTML = data.places.length
    ? data.places.map(place => `
        <div class="admin-item">
          <div>
            <strong>${escapeHTML(place.name)}</strong>
            <small>${escapeHTML(place.category)}</small>
          </div>
          <div class="admin-item-actions">
            <button class="button button-light" data-edit-place="${escapeHTML(place.id)}">
              แก้ไข
            </button>
            <button class="button danger-button" data-delete-place="${escapeHTML(place.id)}">
              ลบ
            </button>
          </div>
        </div>
      `).join("")
    : '<p class="helper-text">ยังไม่มีสถานที่</p>';

  adminRouteList.innerHTML = data.routes.length
    ? data.routes.map(route => `
        <div class="admin-item">
          <div>
            <strong>${escapeHTML(route.name)}</strong>
            <small>
              ${escapeHTML(getPlaceName(route.fromId))}
              → ${escapeHTML(getPlaceName(route.toId))}
            </small>
          </div>
          <div class="admin-item-actions">
            <button class="button button-light" data-edit-route="${escapeHTML(route.id)}">
              แก้ไข
            </button>
            <button class="button danger-button" data-delete-route="${escapeHTML(route.id)}">
              ลบ
            </button>
          </div>
        </div>
      `).join("")
    : '<p class="helper-text">ยังไม่มีวิดีโอเส้นทาง</p>';
}

adminPlaceList.addEventListener("click", event => {
  const editButton = event.target.closest("[data-edit-place]");
  const deleteButton = event.target.closest("[data-delete-place]");

  if (editButton) editPlace(editButton.dataset.editPlace);
  if (deleteButton) deletePlace(deleteButton.dataset.deletePlace);
});

adminRouteList.addEventListener("click", event => {
  const editButton = event.target.closest("[data-edit-route]");
  const deleteButton = event.target.closest("[data-delete-route]");

  if (editButton) editRoute(editButton.dataset.editRoute);
  if (deleteButton) deleteRoute(deleteButton.dataset.deleteRoute);
});

/* =========================================
   10. ส่งออกและนำเข้าข้อมูล JSON
========================================= */

document.getElementById("exportData").addEventListener("click", () => {
  if (!requireAdmin()) return;

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = "tu-rangsit-map-backup.json";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);

  document.getElementById("dataMessage").textContent =
    "ส่งออกข้อมูลเรียบร้อย";
});

document.getElementById("importData").addEventListener("change", async event => {
  if (!requireAdmin()) {
    event.target.value = "";
    return;
  }

  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const imported = JSON.parse(await file.text());

    if (!Array.isArray(imported.places) || !Array.isArray(imported.routes)) {
      throw new Error("รูปแบบไฟล์ไม่ถูกต้อง");
    }

    const validPlaces = imported.places.every(place =>
      place &&
      typeof place.id === "string" &&
      typeof place.name === "string" &&
      typeof place.category === "string"
    );

    const placeIds = new Set(imported.places.map(place => place.id));

    const validRoutes = imported.routes.every(route =>
      route &&
      typeof route.id === "string" &&
      typeof route.name === "string" &&
      typeof route.fromId === "string" &&
      typeof route.toId === "string" &&
      typeof route.videoUrl === "string" &&
      placeIds.has(route.fromId) &&
      placeIds.has(route.toId)
    );

    if (!validPlaces || !validRoutes) {
      throw new Error("ข้อมูลสถานที่หรือเส้นทางไม่ครบถ้วน");
    }

    if (!confirm("การนำเข้าจะเขียนทับข้อมูลปัจจุบัน ต้องการดำเนินการต่อหรือไม่?")) {
      return;
    }

    const oldData = data;

    data = {
      places: imported.places,
      routes: imported.routes
    };

    if (!saveData()) {
      data = oldData;
      return;
    }

    selectedPlaceId = null;

    resetPlaceForm();
    resetRouteForm();
    refreshAll();
    renderAdminLists();

    document.getElementById("dataMessage").textContent =
      "นำเข้าข้อมูลเรียบร้อย";
  } catch (error) {
    alert("นำเข้าไม่สำเร็จ: " + error.message);
  } finally {
    event.target.value = "";
  }
});

/* =========================================
   11. อัปเดตหน้าจอและเริ่มเว็บไซต์
========================================= */

function refreshAll() {
  refreshPlaceSelects();
  renderPlaces();

  if (selectedPlaceId && getPlace(selectedPlaceId)) {
    showPlaceDetails(selectedPlaceId);
  } else {
    selectedPlaceId = null;
  }

  routeResults.innerHTML = "";
}

function initializeWebsite() {
  refreshAll();
}

initializeWebsite();
