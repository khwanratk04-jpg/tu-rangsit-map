
:root {
  --maroon: #781d35;
  --maroon-dark: #501326;
  --cream: #faf5ec;
  --paper: #fffdf9;
  --text: #2d2525;
  --muted: #796f6c;
  --line: #e8ddd5;
  --gold: #d7b879;
  --radius: 18px;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--cream);
  color: var(--text);
  font-family: "Noto Sans Thai", "Tahoma", sans-serif;
  line-height: 1.65;
}

button,
input,
select,
textarea {
  font: inherit;
}

button,
a,
select,
input,
"use strict";

const STORAGE_KEY = "tu-rangsit-map-v3";

const SAMPLE_DATA = {
  places: [
    { id: "gym45", name: "ยิม 4-5", category: "กีฬา", description: "อาคารกีฬา" },
    { id: "social", name: "คณะสังคมสงเคราะห์ศาสตร์", category: "อาคารเรียน", description: "พื้นที่คณะสังคมสงเคราะห์ศาสตร์" },
    { id: "pool", name: "สระว่ายน้ำ", category: "กีฬา", description: "สระว่ายน้ำภายในมหาวิทยาลัย" },
    { id: "naga", name: "ลานพญานาค", category: "พื้นที่ส่วนกลาง", description: "ลานนัดพบ" },
    { id: "sc123", name: "SC123", category: "อาคารเรียน", description: "อาคารเรียน SC123" },
    { id: "education", name: "ศึกษาศาสตร์", category: "อาคารเรียน", description: "พื้นที่ศึกษาศาสตร์" },
    { id: "sakor", name: "ศกร", category: "อาคารเรียน", description: "สถานที่ภายในมหาวิทยาลัย" },
    { id: "bor1", name: "บร.1", category: "อาคารเรียน", description: "อาคาร บร.1" },
    { id: "puey", name: "ป๋วย", category: "อาคารเรียน", description: "อาคารป๋วย" },
    { id: "green", name: "กรีน", category: "พื้นที่ส่วนกลาง", description: "พื้นที่กรีน" },
    { id: "dorm", name: "หอใน", category: "หอพัก", description: "หอพักนักศึกษา" },
    { id: "interzone", name: "อินเตอร์โซน", category: "พื้นที่ส่วนกลาง", description: "พื้นที่อินเตอร์โซน" },
    { id: "tiewson", name: "ทิวสน", category: "พื้นที่ส่วนกลาง", description: "บริเวณทิวสน" }
  ],
  routes: []
};

function copySampleData() {
  return JSON.parse(JSON.stringify(SAMPLE_DATA));
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        Array.isArray(parsed.places) &&
        parsed.places.length > 0 &&
        Array.isArray(parsed.routes)
      ) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn("ใช้ข้อมูลตัวอย่างแทนข้อมูลเดิม", error);
  }

  return copySampleData();
}

let appData = loadData();

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    return true;
  } catch (error) {
    console.error(error);
    showAdminMessage("บันทึกไม่ได้ เบราว์เซอร์อาจปิดกั้น localStorage");
    return false;
  }
}

function byId(id) {
  return document.getElementById(id);
}

function safeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function showAdminMessage(message) {
  const el = byId("adminMessage");
  if (el) el.textContent = message;
}

function showRouteMessage(message) {
  const el = byId("routeMessage");
  if (el) el.textContent = message;
}

function placeName(id) {
  return appData.places.find(place => place.id === id)?.name || "ไม่พบสถานที่";
}

/* สร้างตัวเลือกจากรายการสถานที่ */
function populateSelect(id, placeholder) {
  const select = byId(id);
  if (!select) {
    console.error("ไม่พบ dropdown ใน HTML:", id);
    return;
  }

  const previous = select.value;
  select.replaceChildren();

  const first = document.createElement("option");
  first.value = "";
  first.textContent = placeholder;
  select.appendChild(first);

  appData.places.forEach(place => {
    const option = document.createElement("option");
    option.value = place.id;
    option.textContent = place.name;
    select.appendChild(option);
  });

  if (appData.places.some(place => place.id === previous)) {
    select.value = previous;
  }
}

function refreshSelects() {
  populateSelect("routeFrom", "เลือกต้นทาง");
  populateSelect("routeTo", "เลือกปลายทาง");
  populateSelect("adminRouteFrom", "เลือกต้นทางของวิดีโอ");
  populateSelect("adminRouteTo", "เลือกปลายทางของวิดีโอ");
}

/* แสดงสถานที่ */
function renderPlaces() {
  const container = byId("placeList");
  const keyword = (byId("placeSearch").value || "").trim().toLowerCase();

  const places = appData.places.filter(place =>
    [place.name, place.category, place.description]
      .join(" ")
      .toLowerCase()
      .includes(keyword)
  );

  if (!places.length) {
    container.innerHTML = '<div class="empty">ไม่พบสถานที่</div>';
    return;
  }

  container.innerHTML = places.map(place => `
    <article class="card">
      <span class="tag">${safeText(place.category)}</span>
      <h3>${safeText(place.name)}</h3>
      <p>${safeText(place.description || "ไม่มีรายละเอียดเพิ่มเติม")}</p>
      <button class="card-action" type="button"
        data-select-destination="${safeText(place.id)}">
        เลือกเป็นปลายทาง →
      </button>
    </article>
  `).join("");
}

function youtubeId(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    let id = "";

    if (host === "youtu.be") {
      id = parsed.pathname.split("/").filter(Boolean)[0] || "";
    } else if (
      ["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)
    ) {
      if (parsed.pathname === "/watch") {
        id = parsed.searchParams.get("v") || "";
      } else {
        id = parsed.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] || "";
      }
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : "";
  } catch {
    return "";
  }
}

/* ค้นหาวิดีโอตามต้นทางและปลายทาง */
function searchRoute() {
  const from = byId("routeFrom").value;
  const to = byId("routeTo").value;
  const results = byId("routeResults");

  results.replaceChildren();
  showRouteMessage("");

  if (!from || !to) {
    showRouteMessage("กรุณาเลือกต้นทางและปลายทาง");
    return;
  }

  if (from === to) {
    showRouteMessage("กรุณาเลือกคนละสถานที่");
    return;
  }

  const matches = appData.routes.filter(route =>
    route.from === from && route.to === to
  );

  if (!matches.length) {
    showRouteMessage(
      `ยังไม่มีวิดีโอจาก ${placeName(from)} ไป ${placeName(to)} คุณสามารถเพิ่มวิดีโอในส่วนจัดการข้อมูลด้านล่าง`
    );
    return;
  }

  showRouteMessage(`พบวิดีโอ ${matches.length} รายการ`);

  results.innerHTML = matches.map(route => {
    const id = youtubeId(route.url);

    return `
      <article class="card">
        <h3>${safeText(route.title)}</h3>
        <p>${safeText(placeName(route.from))} → ${safeText(placeName(route.to))}</p>
        ${
          id
            ? `<iframe class="video"
                src="https://www.youtube-nocookie.com/embed/${id}"
                title="${safeText(route.title)}"
                loading="lazy"
                allowfullscreen></iframe>`
            : "<p>ลิงก์ YouTube ไม่ถูกต้อง</p>"
        }
        <a class="video-link" href="${safeText(route.url)}"
          target="_blank" rel="noopener noreferrer">เปิดบน YouTube ↗</a>
      </article>
    `;
  }).join("");
}

/* เพิ่มสถานที่ */
byId("placeForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = byId("placeName").value.trim();
  const category = byId("placeCategory").value;
  const description = byId("placeDescription").value.trim();

  if (!name) return;

  if (appData.places.some(place => place.name.toLowerCase() === name.toLowerCase())) {
    showAdminMessage("มีสถานที่ชื่อนี้อยู่แล้ว");
    return;
  }

  appData.places.push({
    id: "place-" + Date.now(),
    name,
    category,
    description
  });

  if (!saveData()) return;

  event.target.reset();
  refreshSelects();
  renderPlaces();
  showAdminMessage("เพิ่มสถานที่แล้ว");
});

/* เพิ่มวิดีโอเส้นทาง */
byId("routeForm").addEventListener("submit", event => {
  event.preventDefault();

  const from = byId("adminRouteFrom").value;
  const to = byId("adminRouteTo").value;
  const title = byId("videoTitle").value.trim();
  const url = byId("videoUrl").value.trim();

  if (!from || !to) {
    showAdminMessage("กรุณาเลือกต้นทางและปลายทาง");
    return;
  }

  if (from === to) {
    showAdminMessage("ต้นทางและปลายทางต้องต่างกัน");
    return;
  }

  if (!youtubeId(url)) {
    showAdminMessage("กรุณาใช้ลิงก์วิดีโอ YouTube ที่ถูกต้อง");
    return;
  }

  appData.routes.push({
    id: "route-" + Date.now(),
    from,
    to,
    title,
    url
  });

  if (!saveData()) return;

  event.target.reset();
  showAdminMessage("เพิ่มวิดีโอเส้นทางเรียบร้อยแล้ว");
});

byId("searchRoute").addEventListener("click", searchRoute);

byId("swapRoute").addEventListener("click", () => {
  const from = byId("routeFrom");
  const to = byId("routeTo");
  const oldFrom = from.value;
  const oldTo = to.value;

  from.value = oldTo;
  to.value = oldFrom;

  byId("routeResults").replaceChildren();
  showRouteMessage("");
});

byId("placeSearch").addEventListener("input", renderPlaces);

byId("placeList").addEventListener("click", event => {
  const button = event.target.closest("[data-select-destination]");
  if (!button) return;

  byId("routeTo").value = button.dataset.selectDestination;
  byId("route").scrollIntoView({ behavior: "smooth" });
  showRouteMessage("เลือกปลายทางแล้ว กรุณาเลือกต้นทาง");
});

/* ส่งออกข้อมูล */
byId("exportData").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(appData, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "tu-rangsit-map-data.json";
  link.click();
  URL.revokeObjectURL(url);
});

/* นำเข้าข้อมูล */
byId("importFile").addEventListener("change", async event => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const imported = JSON.parse(await file.text());

    if (
      !imported ||
      !Array.isArray(imported.places) ||
      imported.places.length === 0 ||
      !Array.isArray(imported.routes)
    ) {
      throw new Error("ไฟล์ต้องมีรายการ places และ routes");
    }

    const ids = new Set(imported.places.map(place => place.id));

    const validPlaces = imported.places.every(place =>
      place &&
      typeof place.id === "string" &&
      typeof place.name === "string" &&
      typeof place.category === "string"
    );

    const validRoutes = imported.routes.every(route =>
      route &&
      typeof route.from === "string" &&
      typeof route.to === "string" &&
      typeof route.title === "string" &&
      typeof route.url === "string" &&
      ids.has(route.from) &&
      ids.has(route.to) &&
      youtubeId(route.url)
    );

    if (!validPlaces || !validRoutes) {
      throw new Error("ข้อมูลสถานที่หรือวิดีโอไม่ถูกต้อง");
    }

    const oldData = appData;
    appData = imported;

    if (!saveData()) {
      appData = oldData;
      return;
    }

    refreshSelects();
    renderPlaces();
    showAdminMessage("นำเข้าข้อมูลเรียบร้อยแล้ว");
  } catch (error) {
    showAdminMessage("นำเข้าไม่สำเร็จ: " + error.message);
  }

  event.target.value = "";
});

/* คืนค่ารายชื่อสถานที่ตัวอย่าง */
byId("resetData").addEventListener("click", () => {
  if (!confirm("คืนค่าข้อมูลตัวอย่างใช่หรือไม่? ข้อมูลที่เพิ่มไว้จะถูกแทนที่")) {
    return;
  }

  appData = copySampleData();

  if (!saveData()) return;

  refreshSelects();
  renderPlaces();
  byId("routeResults").replaceChildren();
  showRouteMessage("");
  showAdminMessage("คืนค่าข้อมูลตัวอย่างแล้ว");
});

/* เริ่มต้นหลังจาก HTML โหลดครบ */
function initializeApp() {
  refreshSelects();
  renderPlaces();

  console.log("TU Rangsit Map พร้อมใช้งาน");
  console.log("จำนวนสถานที่:", appData.places.length);
  console.log("จำนวนวิดีโอ:", appData.routes.length);
}

initializeApp();

