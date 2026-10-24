
const STORAGE_KEY = "tu-rangsit-map-v2";

const initialData = {
  places: [
    { id: "p1", name: "ยิม 4-5", category: "กีฬา", description: "อาคารกีฬาและกิจกรรม" },
    { id: "p2", name: "คณะสังคมสงเคราะห์ศาสตร์", category: "อาคารเรียน", description: "พื้นที่คณะสังคมสงเคราะห์ศาสตร์" },
    { id: "p3", name: "สระว่ายน้ำ", category: "กีฬา", description: "พื้นที่สระว่ายน้ำภายในมหาวิทยาลัย" },
    { id: "p4", name: "ลานพญานาค", category: "พื้นที่ส่วนกลาง", description: "จุดนัดพบและพื้นที่ส่วนกลาง" },
    { id: "p5", name: "SC123", category: "อาคารเรียน", description: "อาคารเรียน SC123" },
    { id: "p6", name: "คณะศึกษาศาสตร์", category: "อาคารเรียน", description: "พื้นที่คณะศึกษาศาสตร์" },
    { id: "p7", name: "ศกร", category: "อาคารเรียน", description: "สถานที่ภายในมหาวิทยาลัย" },
    { id: "p8", name: "บร.1", category: "อาคารเรียน", description: "อาคาร บร.1" },
    { id: "p9", name: "อาคารป๋วย", category: "อาคารเรียน", description: "อาคารป๋วย" },
    { id: "p10", name: "กรีน", category: "พื้นที่ส่วนกลาง", description: "พื้นที่กรีน" },
    { id: "p11", name: "หอใน", category: "หอพัก", description: "หอพักนักศึกษาภายในมหาวิทยาลัย" },
    { id: "p12", name: "อินเตอร์โซน", category: "พื้นที่ส่วนกลาง", description: "พื้นที่อินเตอร์โซน" },
    { id: "p13", name: "ทิวสน", category: "พื้นที่ส่วนกลาง", description: "บริเวณทิวสน" }
  ],
  routes: []
};

let data = loadData();

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed.places) && Array.isArray(parsed.routes)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("ไม่สามารถอ่านข้อมูลที่บันทึกไว้:", error);
  }

  return JSON.parse(JSON.stringify(initialData));
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("ไม่สามารถบันทึกข้อมูล:", error);
    showAdminMessage("บันทึกข้อมูลไม่สำเร็จ กรุณาตรวจสอบการตั้งค่าเบราว์เซอร์");
    return false;
  }
}

function makeId(prefix) {
  return prefix + "-" + Date.now().toString(36) +
    "-" + Math.random().toString(36).slice(2, 7);
}

function getPlaceName(id) {
  const place = data.places.find(item => item.id === id);
  return place ? place.name : "ไม่พบสถานที่";
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function showAdminMessage(message) {
  const element = document.getElementById("adminMessage");
  if (element) element.textContent = message;
}

function showRouteMessage(message) {
  const element = document.getElementById("routeMessage");
  if (element) element.textContent = message;
}

/* เติมตัวเลือกสถานที่ลงใน dropdown */
function fillPlaceSelect(selectId, placeholder) {
  const select = document.getElementById(selectId);
  if (!select) return;

  const previousValue = select.value;

  select.replaceChildren();

  const firstOption = document.createElement("option");
  firstOption.value = "";
  firstOption.textContent = placeholder;
  select.appendChild(firstOption);

  data.places.forEach(place => {
    const option = document.createElement("option");
    option.value = place.id;
    option.textContent = place.name;
    select.appendChild(option);
  });

  if (data.places.some(place => place.id === previousValue)) {
    select.value = previousValue;
  }
}

function refreshPlaceSelects() {
  fillPlaceSelect("routeFrom", "เลือกต้นทาง");
  fillPlaceSelect("routeTo", "เลือกปลายทาง");
  fillPlaceSelect("adminRouteFrom", "เลือกต้นทางของวิดีโอ");
  fillPlaceSelect("adminRouteTo", "เลือกปลายทางของวิดีโอ");
}

/* แปลงลิงก์ YouTube เป็นลิงก์สำหรับฝังวิดีโอ */
function getYouTubeId(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsed.pathname.split("/").filter(Boolean)[0] || null;
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }

      const match = parsed.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/);
      return match ? match[1] : null;
    }
  } catch (error) {
    return null;
  }

  return null;
}

function getSafeYouTubeId(url) {
  const id = getYouTubeId(url);
  return id && /^[a-zA-Z0-9_-]{6,20}$/.test(id) ? id : null;
}

/* แสดงสถานที่ทั้งหมด */
function renderPlaces() {
  const container = document.getElementById("placeList");
  const search = document.getElementById("placeSearch");
  if (!container) return;

  const keyword = (search?.value || "").trim().toLowerCase();

  const filtered = data.places.filter(place =>
    `${place.name} ${place.category} ${place.description}`
      .toLowerCase()
      .includes(keyword)
  );

  if (!filtered.length) {
    container.innerHTML =
      '<div class="empty-state">ไม่พบสถานที่ที่ค้นหา</div>';
    return;
  }

  container.innerHTML = filtered.map(place => `
    <article class="place-card">
      <span class="category-tag">${escapeHTML(place.category)}</span>
      <h3>${escapeHTML(place.name)}</h3>
      <p>${escapeHTML(place.description || "ไม่มีรายละเอียดเพิ่มเติม")}</p>
      <button type="button" data-destination="${escapeHTML(place.id)}">
        เลือกเป็นปลายทาง →
      </button>
    </article>
  `).join("");
}

/* แสดงผลการค้นหาวิดีโอเส้นทาง */
function searchRoute() {
  const from = document.getElementById("routeFrom").value;
  const to = document.getElementById("routeTo").value;
  const container = document.getElementById("routeResults");

  container.innerHTML = "";
  showRouteMessage("");

  if (!from || !to) {
    showRouteMessage("กรุณาเลือกทั้งต้นทางและปลายทาง");
    return;
  }

  if (from === to) {
    showRouteMessage("ต้นทางและปลายทางต้องเป็นคนละสถานที่");
    return;
  }

  const matches = data.routes.filter(route =>
    route.from === from && route.to === to
  );

  if (!matches.length) {
    showRouteMessage(
      `ยังไม่มีวิดีโอเส้นทางจาก "${getPlaceName(from)}" ไป "${getPlaceName(to)}" กรุณาลองเลือกเส้นทางอื่น`
    );
    return;
  }

  showRouteMessage(`พบวิดีโอแนะนำเส้นทาง ${matches.length} รายการ`);

  container.innerHTML = matches.map(route => {
    const videoId = getSafeYouTubeId(route.url);

    return `
      <article class="route-card">
        <h3>${escapeHTML(route.title)}</h3>
        <div class="route-points">
          <span class="point-tag">${escapeHTML(getPlaceName(route.from))}</span>
          <span aria-hidden="true">→</span>
          <span class="point-tag">${escapeHTML(getPlaceName(route.to))}</span>
        </div>
        ${
          videoId
            ? `<div class="video-frame">
                 <iframe
                   src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}"
                   title="${escapeHTML(route.title)}"
                   loading="lazy"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                   referrerpolicy="strict-origin-when-cross-origin"
                   allowfullscreen>
                 </iframe>
               </div>`
            : '<p class="muted">ลิงก์วิดีโอไม่ถูกต้อง</p>'
        }
        <a class="video-link"
          href="${escapeHTML(route.url)}"
          target="_blank"
          rel="noopener noreferrer">เปิดวิดีโอบน YouTube ↗</a>
      </article>
    `;
  }).join("");
}

/* เพิ่มสถานที่ใหม่ */
document.getElementById("placeForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("placeName").value.trim();
  const category = document.getElementById("placeCategory").value;
  const description = document.getElementById("placeDescription").value.trim();

  if (!name) {
    showAdminMessage("กรุณากรอกชื่อสถานที่");
    return;
  }

  const duplicate = data.places.some(
    place => place.name.toLowerCase() === name.toLowerCase()
  );

  if (duplicate) {
    showAdminMessage("มีชื่อสถานที่นี้อยู่แล้ว");
    return;
  }

  data.places.push({
    id: makeId("place"),
    name,
    category,
    description
  });

  if (!saveData()) return;

  event.target.reset();
  refreshPlaceSelects();
  renderPlaces();
  showAdminMessage("เพิ่มสถานที่เรียบร้อยแล้ว");
});

/* เพิ่มวิดีโอโดยผูกกับต้นทางและปลายทาง */
document.getElementById("routeForm").addEventListener("submit", event => {
  event.preventDefault();

  const from = document.getElementById("adminRouteFrom").value;
  const to = document.getElementById("adminRouteTo").value;
  const title = document.getElementById("videoTitle").value.trim();
  const url = document.getElementById("videoUrl").value.trim();

  if (!from || !to) {
    showAdminMessage("กรุณาเลือกต้นทางและปลายทางของวิดีโอ");
    return;
  }

  if (from === to) {
    showAdminMessage("ต้นทางและปลายทางต้องเป็นคนละสถานที่");
    return;
  }

  if (!getSafeYouTubeId(url)) {
    showAdminMessage("กรุณาใส่ลิงก์ YouTube ที่ถูกต้อง");
    return;
  }

  data.routes.push({
    id: makeId("route"),
    from,
    to,
    title,
    url
  });

  if (!saveData()) return;

  event.target.reset();
  showAdminMessage(
    `เพิ่มวิดีโอเส้นทาง ${getPlaceName(from)} → ${getPlaceName(to)} แล้ว`
  );
});

/* ปุ่มค้นหาเส้นทาง */
document.getElementById("searchRoute").addEventListener("click", searchRoute);

document.getElementById("swapRoute").addEventListener("click", () => {
  const fromSelect = document.getElementById("routeFrom");
  const toSelect = document.getElementById("routeTo");

  const oldFrom = fromSelect.value;
  const oldTo = toSelect.value;

  fromSelect.value = oldTo;
  toSelect.value = oldFrom;

  showRouteMessage("");
  document.getElementById("routeResults").innerHTML = "";
});

/* ค้นหาสถานที่แบบทันที */
document.getElementById("placeSearch").addEventListener("input", renderPlaces);

/* เลือกสถานที่จากการ์ดให้เป็นปลายทาง */
document.getElementById("placeList").addEventListener("click", event => {
  const button = event.target.closest("[data-destination]");
  if (!button) return;

  document.getElementById("routeTo").value = button.dataset.destination;
  document.getElementById("route").scrollIntoView({ behavior: "smooth" });
  showRouteMessage("เลือกปลายทางแล้ว กรุณาเลือกต้นทางและค้นหาเส้นทาง");
});

/* ส่งออกข้อมูลเป็นไฟล์ JSON */
document.getElementById("exportData").addEventListener("click", () => {
  const file = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "tu-rangsit-map-data.json";
  link.click();
  URL.revokeObjectURL(url);

  showAdminMessage("ส่งออกข้อมูลแล้ว");
});

/* นำเข้าข้อมูล JSON */
document.getElementById("importFile").addEventListener("change", async event => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const imported = JSON.parse(await file.text());

    if (!Array.isArray(imported.places) || !Array.isArray(imported.routes)) {
      throw new Error("รูปแบบข้อมูลไม่ถูกต้อง");
    }

    const validPlaces = imported.places.every(place =>
      place &&
      typeof place.id === "string" &&
      typeof place.name === "string" &&
      typeof place.category === "string"
    );

    const validRoutes = imported.routes.every(route =>
      route &&
      typeof route.id === "string" &&
      typeof route.from === "string" &&
      typeof route.to === "string" &&
      typeof route.title === "string" &&
      typeof route.url === "string"
    );

    if (!validPlaces || !validRoutes) {
      throw new Error("ข้อมูลสถานที่หรือเส้นทางไม่ครบถ้วน");
    }

    const placeIds = new Set(imported.places.map(place => place.id));

    const validRouteReferences = imported.routes.every(route =>
      placeIds.has(route.from) &&
      placeIds.has(route.to) &&
      Boolean(getSafeYouTubeId(route.url))
    );

    if (!validRouteReferences) {
      throw new Error("มีเส้นทางที่อ้างถึงสถานที่ที่ไม่มีอยู่ หรือมีลิงก์วิดีโอไม่ถูกต้อง");
    }

    const previousData = data;
    data = imported;

    if (!saveData()) {
      data = previousData;
      return;
    }

    refreshPlaceSelects();
    renderPlaces();
    document.getElementById("routeResults").innerHTML = "";
    showAdminMessage("นำเข้าข้อมูลเรียบร้อยแล้ว");
  } catch (error) {
    showAdminMessage("นำเข้าข้อมูลไม่สำเร็จ: " + error.message);
  } finally {
    event.target.value = "";
  }
});

/* คืนค่าข้อมูลตัวอย่าง */
document.getElementById("resetData").addEventListener("click", () => {
  const confirmed = window.confirm(
    "ต้องการคืนค่าข้อมูลตัวอย่างหรือไม่? สถานที่และวิดีโอที่เพิ่มไว้ในเบราว์เซอร์นี้จะถูกแทนที่"
  );

  if (!confirmed) return;

  data = JSON.parse(JSON.stringify(initialData));

  if (!saveData()) return;

  refreshPlaceSelects();
  renderPlaces();
  document.getElementById("routeResults").innerHTML = "";
  showRouteMessage("");
  showAdminMessage("คืนค่าข้อมูลตัวอย่างแล้ว");
});

/* เริ่มต้นเว็บไซต์ */
function initializeWebsite() {
  refreshPlaceSelects();
  renderPlaces();
}

initializeWebsite();
