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
   ระบบให้คะแนนและรีวิวเส้นทาง
   รีวิวเก็บใน LocalStorage ของเบราว์เซอร์นี้
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
    localStorage.setItem(
      REVIEW_STORAGE_KEY,
      JSON.stringify(routeReviews)
    );
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
    ? reviews.reduce(
        (sum, item) => sum + Number(item.rating || 0),
        0
      ) / reviews.length
    : 0;

  const stars = average
    ? "★".repeat(Math.round(average)) +
      "☆".repeat(5 - Math.round(average))
    : "☆☆☆☆☆";

  return `
    <section class="route-review"
      data-review-section="${escapeHTML(routeId)}">

      <div class="route-review-heading">
        <h4>รีวิวเส้นทางนี้</h4>

        <div class="route-review-average">
          <strong>${average ? average.toFixed(1) : "—"}</strong>
          <span class="review-stars" aria-label="คะแนนเฉลี่ย">
            ${stars}
          </span>
          <small>${reviews.length} รีวิว</small>
        </div>
      </div>

      <form class="route-review-form"
        data-review-form="${escapeHTML(routeId)}">

        <label>ให้คะแนนเส้นทาง</label>

        <div class="review-star-picker"
          role="group"
          aria-label="เลือกคะแนน 1 ถึง 5 ดาว">

          ${[1, 2, 3, 4, 5].map(n => `
            <button
              class="review-star-button ${
                Number(selectedReviewStars[routeId] || 0) >= n
                  ? "selected"
                  : ""
              }"
              type="button"
              data-review-star="${n}"
              data-review-route="${escapeHTML(routeId)}"
              aria-label="${n} ดาว"
              aria-pressed="${
                Number(selectedReviewStars[routeId] || 0) >= n
              }">★</button>
          `).join("")}
        </div>

        <label>
          ความคิดเห็น (ไม่บังคับ)
          <textarea
            name="reviewText"
            rows="3"
            maxlength="500"
            placeholder="บอกเล่าประสบการณ์การใช้เส้นทางนี้"></textarea>
        </label>

        <button class="button button-primary" type="submit">
          ส่งรีวิว
        </button>
      </form>

      <div class="route-review-list">
        ${
          reviews.length
            ? reviews.slice().reverse().map(review => `
              <article class="route-review-item">
                <div class="route-review-item-top">
                  <span class="review-stars">${
                    "★".repeat(
                      Math.max(0, Math.min(5, Number(review.rating) || 0))
                    )
                  }${
                    "☆".repeat(
                      5 - Math.max(0, Math.min(5, Number(review.rating) || 0))
                    )
                  }</span>
                  <small>${escapeHTML(review.date || "")}</small>
                </div>

                ${
                  review.text
                    ? `<p>${escapeHTML(review.text)}</p>`
                    : `<p class="helper-text">ไม่ได้เขียนความคิดเห็นเพิ่มเติม</p>`
                }
              </article>
            `).join("")
            : `<p class="helper-text">
                ยังไม่มีรีวิว เป็นคนแรกที่ให้คะแนนเส้นทางนี้ได้เลย
              </p>`
        }
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
  const text = String(
    new FormData(form).get("reviewText") || ""
  ).trim();

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

  const fromId = routeFrom.value;
  const toId = routeTo.value;

  if (selectedPlaceId && getPlace(selectedPlaceId)) {
    showPlaceDetails(selectedPlaceId);
  }

  if (fromId && toId) {
    document.getElementById("findRoute").click();
  }
});
