
/* =========================================
   5. ค้นหาเส้นทาง + รีวิวหลังใช้งาน
========================================= */

const routeFrom = document.getElementById("routeFrom");
const routeTo = document.getElementById("routeTo");
const routeResults = document.getElementById("routeResults");

const ROUTE_REVIEW_KEY = "tuRangsitMapRouteReviews";

function loadRouteReviews() {
  try {
    const value = JSON.parse(
      localStorage.getItem(ROUTE_REVIEW_KEY) || "{}"
    );

    return value && typeof value === "object" ? value : {};
  } catch (error) {
    console.warn("ไม่สามารถอ่านข้อมูลรีวิวได้", error);
    return {};
  }
}

let routeReviews = loadRouteReviews();

function saveRouteReviews() {
  try {
    localStorage.setItem(
      ROUTE_REVIEW_KEY,
      JSON.stringify(routeReviews)
    );
    return true;
  } catch (error) {
    console.error("บันทึกรีวิวไม่สำเร็จ", error);
    alert("บันทึกรีวิวไม่สำเร็จ กรุณาลองใหม่");
    return false;
  }
}

function fillPlaceSelect(select, placeholder) {
  if (!select) return;

  const oldValue = select.value;

  select.innerHTML = `
    <option value="">${escapeHTML(placeholder)}</option>
    ${data.places.map(place => `
      <option value="${escapeHTML(place.id)}">
        ${escapeHTML(place.name)}
      </option>
    `).join("")}
  `;

  if (data.places.some(place => place.id === oldValue)) {
    select.value = oldValue;
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

function getReviews(routeId) {
  return Array.isArray(routeReviews[routeId])
    ? routeReviews[routeId]
    : [];
}

function renderRouteReviews(route) {
  const reviews = getReviews(route.id);

  const average = reviews.length
    ? reviews.reduce((total, item) => total + item.rating, 0)
        / reviews.length
    : 0;

  const stars = Math.round(average);

  return `
    <section class="route-review" data-review-section="${escapeHTML(route.id)}">
      <div class="route-review-heading">
        <h4>รีวิวเส้นทาง</h4>
        <div class="route-review-average">
          <strong>${reviews.length ? average.toFixed(1) : "—"}</strong>
          <span class="review-stars" aria-label="${stars} จาก 5 ดาว">
            ${"★".repeat(stars)}${"☆".repeat(5 - stars)}
          </span>
          <small>${reviews.length} รีวิว</small>
        </div>
      </div>

      <form class="route-review-form" data-review-form="${escapeHTML(route.id)}">
        <label>คุณให้คะแนนเส้นทางนี้เท่าไร?</label>

        <div class="review-star-picker" role="group" aria-label="เลือกคะแนน">
          ${[1, 2, 3, 4, 5].map(number => `
            <button
              type="button"
              class="review-star-button"
              data-star="${number}"
              aria-label="${number} ดาว"
              aria-pressed="false">★</button>
          `).join("")}
        </div>

        <input type="hidden" name="rating" value="">

        <label for="comment-${escapeHTML(route.id)}">
          ความคิดเห็น
        </label>

        <textarea
          id="comment-${escapeHTML(route.id)}"
          name="comment"
          rows="3"
          maxlength="500"
          placeholder="เช่น วิดีโอช่วยให้เดินทางได้ง่ายขึ้น..."
          required></textarea>

        <button type="submit" class="button button-primary">
          ส่งรีวิว
        </button>
      </form>

      <div class="route-review-list">
        ${
          reviews.length
            ? reviews.slice().reverse().map(item => `
                <article class="route-review-item">
                  <div class="route-review-item-top">
                    <span class="review-stars">
                      ${"★".repeat(item.rating)}${"☆".repeat(5 - item.rating)}
                    </span>
                    <small>${escapeHTML(item.date || "")}</small>
                  </div>
                  <p>${escapeHTML(item.comment)}</p>
                </article>
              `).join("")
            : '<p class="helper-text">ยังไม่มีรีวิวสำหรับเส้นทางนี้</p>'
        }
      </div>
    </section>
  `;
}

function renderMatchingRoutes() {
  const fromId = routeFrom.value;
  const toId = routeTo.value;

  if (!fromId || !toId) {
    routeResults.innerHTML =
      '<p class="error-text">กรุณาเลือกทั้งต้นทางและปลายทาง</p>';
    return;
  }

  if (fromId === toId) {
    routeResults.innerHTML =
      '<p class="error-text">ต้นทางและปลายทางต้องเป็นคนละสถานที่</p>';
    return;
  }

  const routes = data.routes.filter(route =>
    route.fromId === fromId && route.toId === toId
  );

  if (!routes.length) {
    routeResults.innerHTML = `
      <div class="empty-state">
        <h3>ยังไม่มีวิดีโอเส้นทางนี้</h3>
        <p>กรุณาลองเลือกเส้นทางอื่น หรือเพิ่มวิดีโอผ่านระบบแอดมิน</p>
      </div>
    `;
    return;
  }

  routeResults.innerHTML = routes.map(route => {
    const embedUrl = getYouTubeEmbedUrl(route.videoUrl);

    return `
      <article class="route-result-item">
        <span class="route-badge">วิดีโอแนะนำเส้นทาง</span>

        <h3>${escapeHTML(route.name)}</h3>

        <div class="route-endpoints">
          ${escapeHTML(getPlaceName(route.fromId))}
          → ${escapeHTML(getPlaceName(route.toId))}
        </div>

        ${
          route.description
            ? `<p>${escapeHTML(route.description)}</p>`
            : ""
        }

        ${
          embedUrl
            ? `<iframe
                class="video-frame"
                src="${escapeHTML(embedUrl)}"
                title="${escapeHTML(route.name)}"
                loading="lazy"
                referrerpolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen></iframe>`
            : '<p class="helper-text">ไม่สามารถแสดงตัวอย่างวิดีโอได้ กรุณากดปุ่มเปิดวิดีโอ</p>'
        }

        <p>
          <a class="button button-primary"
             href="${escapeHTML(route.videoUrl)}"
             target="_blank"
             rel="noopener noreferrer">
            เปิดวิดีโอ
          </a>
        </p>

        ${renderRouteReviews(route)}
      </article>

/* =========================================
   5. ระบบค้นหาเส้นทางและรีวิว
   ไม่แก้ไขระบบแสดงการ์ดสถานที่
========================================= */

const routeFrom = document.getElementById("routeFrom");
const routeTo = document.getElementById("routeTo");
const routeResults = document.getElementById("routeResults");
const findRouteButton = document.getElementById("findRoute");

const REVIEW_KEY = "tuRangsitMapRouteReviews";

function readRouteReviews() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(REVIEW_KEY) || "{}"
    );

    return saved && typeof saved === "object" ? saved : {};
  } catch {
    return {};
  }
}

let routeReviews = readRouteReviews();

function persistRouteReviews() {
  try {
    localStorage.setItem(
      REVIEW_KEY,
      JSON.stringify(routeReviews)
    );
    return true;
  } catch (error) {
    console.error("ไม่สามารถบันทึกรีวิวได้", error);
    alert("บันทึกรีวิวไม่สำเร็จ กรุณาลองอีกครั้ง");
    return false;
  }
}

function populateRouteSelect(select, placeholder) {
  if (!select || !Array.isArray(data.places)) return;

  const previousValue = select.value;

  select.innerHTML = [
    `<option value="">${escapeHTML(placeholder)}</option>`,
    ...data.places.map(place => `
      <option value="${escapeHTML(place.id)}">
        ${escapeHTML(place.name)}
      </option>
    `)
  ].join("");

  if (data.places.some(place => place.id === previousValue)) {
    select.value = previousValue;
  }
}

function refreshRouteSelects() {
  populateRouteSelect(routeFrom, "เลือกจุดเริ่มต้น");
  populateRouteSelect(routeTo, "เลือกจุดหมายปลายทาง");

  populateRouteSelect(
    document.getElementById("adminRouteFrom"),
    "เลือกจุดเริ่มต้น"
  );

  populateRouteSelect(
    document.getElementById("adminRouteTo"),
    "เลือกจุดหมายปลายทาง"
  );
}

function getRouteReviews(routeId) {
  return Array.isArray(routeReviews[routeId])
    ? routeReviews[routeId]
    : [];
}

function renderRouteReviews(route) {
  const reviews = getRouteReviews(route.id);

  const average = reviews.length
    ? reviews.reduce((sum, item) => sum + item.rating, 0)
        / reviews.length
    : 0;

  const rounded = Math.round(average);

  return `
    <section class="route-review">
      <h4>คะแนนและความคิดเห็น</h4>

      <div class="route-review-average">
        <strong>${reviews.length ? average.toFixed(1) : "—"}</strong>
        <span class="review-stars">
          ${"★".repeat(rounded)}${"☆".repeat(5 - rounded)}
        </span>
        <small>${reviews.length} รีวิว</small>
      </div>

      <form class="route-review-form"
            data-route-id="${escapeHTML(route.id)}">

        <label>ให้คะแนนเส้นทางนี้</label>

        <div class="review-star-picker">
          ${[1, 2, 3, 4, 5].map(star => `
            <button type="button"
                    class="review-star-button"
                    data-rating="${star}"
                    aria-label="${star} ดาว"
                    aria-pressed="false">★</button>
          `).join("")}
        </div>

        <input type="hidden" name="rating" value="">

        <label>
          ความคิดเห็น
          <textarea name="comment"
                    rows="3"
                    maxlength="500"
                    placeholder="แบ่งปันประสบการณ์การเดินทางของคุณ"
                    required></textarea>
        </label>

        <button type="submit" class="button button-primary">
          ส่งรีวิว
        </button>
      </form>

      <div class="route-review-list">
        ${
          reviews.length
            ? [...reviews].reverse().map(item => `
                <article class="route-review-item">
                  <div class="review-stars">
                    ${"★".repeat(item.rating)}${"☆".repeat(5 - item.rating)}
                  </div>
                  <small>${escapeHTML(item.date || "")}</small>
                  <p>${escapeHTML(item.comment)}</p>
                </article>
              `).join("")
            : '<p class="helper-text">ยังไม่มีรีวิวสำหรับเส้นทางนี้</p>'
        }
      </div>
    </section>
  `;
}

function renderMatchingRoutes() {
  if (!routeFrom || !routeTo || !routeResults) return;

  const fromId = routeFrom.value;
  const toId = routeTo.value;

  if (!fromId || !toId) {
    routeResults.innerHTML =
      '<p class="error-text">กรุณาเลือกต้นทางและปลายทาง</p>';
    return;
  }

  if (fromId === toId) {
    routeResults.innerHTML =
      '<p class="error-text">กรุณาเลือกคนละสถานที่</p>';
    return;
  }

  const matches = data.routes.filter(route =>
    route.fromId === fromId && route.toId === toId
  );

  if (!matches.length) {
    routeResults.innerHTML = `
      <div class="empty-state">
        <h3>ยังไม่มีวิดีโอเส้นทางนี้</h3>
        <p>กรุณาเลือกเส้นทางอื่น หรือเพิ่มวิดีโอผ่านระบบแอดมิน</p>
      </div>
    `;
    return;
  }

  routeResults.innerHTML = matches.map(route => {
    const embedUrl = getYouTubeEmbedUrl(route.videoUrl);

    return `
      <article class="route-result-item">
        <h3>${escapeHTML(route.name)}</h3>

        <p class="route-endpoints">
          ${escapeHTML(getPlaceName(route.fromId))}
          → ${escapeHTML(getPlaceName(route.toId))}
        </p>

        ${
          route.description
            ? `<p>${escapeHTML(route.description)}</p>`
            : ""
        }

        ${
          embedUrl
            ? `<iframe class="video-frame"
                src="${escapeHTML(embedUrl)}"
                title="${escapeHTML(route.name)}"
                loading="lazy"
                allowfullscreen></iframe>`
            : ""
        }

        <p>
          <a class="button button-primary"
             href="${escapeHTML(route.videoUrl)}"
             target="_blank"
             rel="noopener noreferrer">
            เปิดวิดีโอ
          </a>
        </p>

        ${renderRouteReviews(route)}
      </article>
    `;
  }).join("");
}

/* คลิกเลือกดาว */
if (routeResults) {
  routeResults.addEventListener("click", event => {
    const button = event.target.closest("[data-rating]");
    if (!button) return;

    const form = button.closest(".route-review-form");
    if (!form) return;

    const rating = Number(button.dataset.rating);
    form.querySelector('[name="rating"]').value = String(rating);

    form.querySelectorAll("[data-rating]").forEach(star => {
      const selected = Number(star.dataset.rating) <= rating;
      star.classList.toggle("selected", selected);
      star.setAttribute(
        "aria-pressed",
        String(Number(star.dataset.rating) === rating)
      );
    });
  });

  /* ส่งรีวิว */
  routeResults.addEventListener("submit", event => {
    const form = event.target.closest(".route-review-form");
    if (!form) return;

    event.preventDefault();

    const routeId = form.dataset.routeId;
    const rating = Number(form.querySelector('[name="rating"]').value);
    const comment = form.querySelector('[name="comment"]').value.trim();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      alert("กรุณาเลือกคะแนน 1–5 ดาว");
      return;
    }

    if (!comment) {
      alert("กรุณาเขียนความคิดเห็น");
      return;
    }

    const routeExists = data.routes.some(
      route => route.id === routeId
    );

    if (!routeExists) {
      alert("ไม่พบข้อมูลเส้นทาง กรุณาค้นหาอีกครั้ง");
      return;
    }

    if (!routeReviews[routeId]) {
      routeReviews[routeId] = [];
    }

    routeReviews[routeId].push({
      rating,
      comment,
      date: new Date().toLocaleDateString("th-TH")
    });

    if (!persistRouteReviews()) {
      routeReviews[routeId].pop();
      return;
    }

    renderMatchingRoutes();
  });
}

if (findRouteButton) {
  findRouteButton.addEventListener("click", renderMatchingRoutes);
}

refreshRouteSelects();

