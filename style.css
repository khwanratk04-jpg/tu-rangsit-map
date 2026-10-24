
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
textarea {
  -webkit-tap-highlight-color: transparent;
}

a {
  color: inherit;
  text-decoration: none;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 16px clamp(20px, 6vw, 84px);
  background: var(--paper);
  border-bottom: 1px solid var(--line);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  background: var(--maroon);
  color: white;
  border-radius: 14px;
  font-weight: 800;
  letter-spacing: -1px;
}

.brand strong,
.brand small {
  display: block;
}

.brand strong {
  color: var(--maroon);
  font-size: 17px;
}

.brand small {
  color: var(--muted);
  font-size: 11px;
}

.nav-link {
  color: var(--maroon);
  font-weight: 700;
}

.hero {
  padding: 76px clamp(22px, 9vw, 130px) 84px;
  color: white;
  background:
    radial-gradient(ellipse at 85% 20%, #9a465b 0%, transparent 36%),
    linear-gradient(125deg, var(--maroon-dark), var(--maroon));
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--gold);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.7px;
}

.hero h1 {
  margin: 12px 0;
  font-size: clamp(42px, 7vw, 76px);
  line-height: 1.2;
  letter-spacing: -1.5px;
}

.hero h1 span {
  color: var(--gold);
}

.hero > p:not(.eyebrow) {
  max-width: 540px;
  color: #f0e4e3;
  margin-bottom: 28px;
}

.primary-button,
.secondary-button,
.danger-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 10px 18px;
  border: 0;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, background 0.15s;
}

.primary-button {
  background: var(--maroon);
  color: white;
}

.hero .primary-button {
  background: var(--gold);
  color: var(--maroon-dark);
}

.primary-button:hover,
.secondary-button:hover,
.danger-button:hover {
  transform: translateY(-1px);
}

.section {
  width: min(1100px, calc(100% - 40px));
  margin: 0 auto;
  padding: 58px 0;
}

.section + .section {
  border-top: 1px solid var(--line);
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
  margin-bottom: 24px;
}

.section-heading .eyebrow {
  color: var(--maroon);
}

.section-heading h2 {
  margin: 0;
  color: var(--maroon-dark);
  font-size: clamp(25px, 4vw, 34px);
}

.muted {
  color: var(--muted);
  margin: 5px 0 0;
}

.route-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto;
  align-items: end;
  gap: 14px;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--paper);
  box-shadow: 0 10px 35px #4a1b1710;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.field label {
  color: var(--maroon-dark);
  font-size: 13px;
  font-weight: 700;
}

.field input,
.field select,
.field textarea,
.search-box input {
  width: 100%;
  min-width: 0;
  padding: 11px 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: white;
  color: var(--text);
  outline: none;
}

.field input:focus,
.field select:focus,
.field textarea:focus,
.search-box input:focus {
  border-color: var(--maroon);
  box-shadow: 0 0 0 3px #781d3515;
}

.swap-button {
  width: 42px;
  height: 42px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--cream);
  color: var(--maroon);
  font-size: 24px;
  cursor: pointer;
}

.route-results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
  margin-top: 20px;
}

.route-card,
.place-card,
.admin-card {
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--paper);
}

.route-card h3,
.place-card h3,
.admin-card h3 {
  margin: 0 0 8px;
  color: var(--maroon-dark);
}

.route-points {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
  font-size: 13px;
}

.point-tag {
  padding: 4px 10px;
  border-radius: 99px;
  background: #f2e5e5;
  color: var(--maroon);
  font-weight: 700;
}

.video-frame {
  position: relative;
  width: 100%;
  margin-top: 14px;
  overflow: hidden;
  border-radius: 12px;
  background: #21181b;
  aspect-ratio: 16 / 9;
}

.video-frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.video-link {
  display: inline-block;
  margin-top: 12px;
  color: var(--maroon);
  font-size: 13px;
  font-weight: 700;
  text-decoration: underline;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 4px 12px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: white;
  color: var(--maroon);
}

.search-box input {
  border: 0;
  box-shadow: none !important;
}

.place-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.place-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.place-card h3 {
  overflow-wrap: anywhere;
}

.place-card p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.category-tag {
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 99px;
  background: #f4eadb;
  color: #76562b;
  font-size: 11px;
  font-weight: 800;
}

.place-card button {
  align-self: flex-start;
  margin-top: auto;
  padding: 7px 0 0;
  border: 0;
  background: transparent;
  color: var(--maroon);
  font-weight: 700;
  cursor: pointer;
}

.admin-section {
  padding-bottom: 68px;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.admin-card h3 {
  margin-bottom: 18px;
}

.admin-card .field {
  margin-bottom: 16px;
}

.admin-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}

.secondary-button,
.file-label {
  border: 1px solid var(--line);
  background: var(--paper);
  color: var(--maroon);
}

.file-label {
  cursor: pointer;
}

.danger-button {
  background: #f7e5e5;
  color: #922c2c;
}

.message {
  min-height: 0;
  color: var(--maroon);
  font-size: 14px;
  font-weight: 700;
}

.message:empty {
  display: none;
}

.notice {
  padding: 12px 15px;
  border-left: 3px solid var(--gold);
  background: #f3eadb;
  color: #675b4d;
  font-size: 12px;
}

.empty-state {
  grid-column: 1 / -1;
  padding: 24px;
  border: 1px dashed #d5c5bc;
  border-radius: var(--radius);
  color: var(--muted);
  text-align: center;
}

footer {
  padding: 28px 20px;
  background: var(--maroon-dark);
  color: white;
  text-align: center;
}

footer p {
  margin: 4px 0 0;
  color: #e5d4d5;
  font-size: 12px;
}

@media (max-width: 800px) {
  .route-panel {
    grid-template-columns: 1fr;
  }

  .swap-button {
    justify-self: center;
    transform: rotate(90deg);
  }

  .place-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .topbar {
    padding: 12px 16px;
  }

  .brand small {
    max-width: 200px;
  }

  .nav-link {
    font-size: 12px;
  }

  .hero {
    padding: 55px 24px 62px;
  }

  .section {
    width: calc(100% - 28px);
    padding: 40px 0;
  }

  .section-heading {
    align-items: start;
  }

  .place-grid,
  .admin-grid {
    grid-template-columns: 1fr;
  }

  .route-panel {
    padding: 16px;
  }
}
