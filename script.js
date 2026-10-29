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
        // เติมสถานที่ตั้งต้นที่ขาด โดยไม่เขียนทับข้อมูลที่ผู้ใช้แก้ไขไว้
        const savedIds = new Set(parsed.places.map(place => place.id));
        const missingDefaults = initialPlaces
          .filter(place => !savedIds.has(place.id))
          .map(place => ({ ...place }));

        return {
          places: [...parsed.places, ...missingDefaults],
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
    const dialog = document.getElementById(button.dataset.close);
    if (dialog) dialog.close();
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
