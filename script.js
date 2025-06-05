// Timezone support, requires Intl API
const canvas = document.getElementById('clock-canvas');
const ctx = canvas.getContext('2d');
const CENTER = { x: canvas.width / 2, y: canvas.height / 2 };
const RADIUS = 150;
const scoreEl = document.getElementById('score');
const greetingEl = document.getElementById('greeting');
const themeBtn = document.getElementById('theme-toggle');
const tzSelect = document.getElementById('tz');
const quoteEl = document.getElementById('quote');

let score = 0;
let lastHour = null;
let timezone = tzSelect.value;

// Motivational quotes
const quotes = [
  "Keep going. Progress is perfection.",
  "Every hour is a new chance to grow.",
  "Success is built by small, smart steps.",
  "Shine your light, even on cloudy days.",
  "Be proud of your journey, not just results.",
  "The best project is YOU.",
  "Patience. Progress. Power.",
  "Challenges make you stronger.",
  "Love yourself, every hour.",
  "Your time is precious. Use it wisely."
];

// Greeting (Myanmar)
function setGreeting(now) {
  let h = now.getHours();
  let greet = "";
  if (h < 6) greet = "ညအေးအေးလေးဖြစ်ပါစေ 🌙";
  else if (h < 12) greet = "မင်္ဂလာနံနက်ခင်းပါ ☀️";
  else if (h < 17) greet = "မင်္ဂလာနေ့လယ်ခင်းပါ 🌤";
  else if (h < 20) greet = "မင်္ဂလာညနေခင်းပါ 🌇";
  else greet = "အနားယူချိန်ပါ 💤";
  greetingEl.textContent = greet;
}

// Quote changer
function setQuote() {
  quoteEl.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}
setQuote();
setInterval(setQuote, 15000); // Change every 15s

// Draw clock
function drawClock() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const now = new Date();
  // Convert to selected timezone
  const tzNow = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
  const hour = tzNow.getHours() % 12;
  const minute = tzNow.getMinutes();
  const second = tzNow.getSeconds();
  const ms = tzNow.getMilliseconds();

  // Glassy face
  drawFace();
  drawTicks();
  drawNumbers();

  // Progress gradient ring (seconds)
  drawProgressRing(second, ms);

  // Hands
  drawHand((hour + minute / 60) * 30, RADIUS * 0.56, 9, "#e9d580", 0.23); // hour
  drawHand((minute + second / 60) * 6, RADIUS * 0.78, 6, "#65d2e9", 0.22); // minute
  drawHand((second + ms / 1000) * 6, RADIUS * 0.97, 2.8, "#ffb55c", 0.2); // second

  // Center glass dot
  ctx.beginPath();
  ctx.arc(CENTER.x, CENTER.y, 10, 0, 2 * Math.PI, false);
  ctx.fillStyle = "rgba(250,255,230,0.98)";
  ctx.shadowColor = "#e9d580";
  ctx.shadowBlur = 16;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Score logic (add 10 points at every new hour)
  if (lastHour === null) lastHour = tzNow.getHours();
  if (tzNow.getHours() !== lastHour) {
    lastHour = tzNow.getHours();
    score += 10;
    scoreEl.textContent = score;
    animateScore();
  }

  setGreeting(tzNow);

  requestAnimationFrame(drawClock);
}

function drawFace() {
  // Outer gold glass ring
  let grad = ctx.createRadialGradient(CENTER.x, CENTER.y, RADIUS*0.5, CENTER.x, CENTER.y, RADIUS);
  grad.addColorStop(0, "rgba(255,255,255,0.85)");
  grad.addColorStop(0.6, "rgba(231,210,128,0.13)");
  grad.addColorStop(1, "rgba(255,231,179,0.15)");
  ctx.beginPath();
  ctx.arc(CENTER.x, CENTER.y, RADIUS, 0, 2 * Math.PI);
  ctx.fillStyle = grad;
  ctx.fill();

  // Inner ice glow
  ctx.save();
  ctx.globalAlpha = 0.13;
  ctx.beginPath();
  ctx.arc(CENTER.x, CENTER.y, RADIUS - 18, 0, 2 * Math.PI);
  ctx.strokeStyle = "#b2e3f8";
  ctx.lineWidth = 14;
  ctx.stroke();
  ctx.restore();
}

function drawTicks() {
  // Major ticks (hour)
  for (let i = 0; i < 12; i++) {
    let angle = (i * Math.PI) / 6;
    let xStart = CENTER.x + Math.cos(angle) * (RADIUS - 21);
    let yStart = CENTER.y + Math.sin(angle) * (RADIUS - 21);
    let xEnd = CENTER.x + Math.cos(angle) * (RADIUS - 5);
    let yEnd = CENTER.y + Math.sin(angle) * (RADIUS - 5);

    ctx.beginPath();
    ctx.moveTo(xStart, yStart);
    ctx.lineTo(xEnd, yEnd);
    ctx.strokeStyle = "#e9d580";
    ctx.lineWidth = 5.2;
    ctx.shadowColor = "#ffe9af";
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Minor ticks (minute)
  for (let i = 0; i < 60; i++) {
    if (i % 5 === 0) continue;
    let angle = (i * Math.PI) / 30;
    let xStart = CENTER.x + Math.cos(angle) * (RADIUS - 18);
    let yStart = CENTER.y + Math.sin(angle) * (RADIUS - 18);
    let xEnd = CENTER.x + Math.cos(angle) * (RADIUS - 8);
    let yEnd = CENTER.y + Math.sin(angle) * (RADIUS - 8);

    ctx.beginPath();
    ctx.moveTo(xStart, yStart);
    ctx.lineTo(xEnd, yEnd);
    ctx.strokeStyle = "#b2e3f8";
    ctx.lineWidth = 1.5;
    ctx.shadowColor = "#f8f8ff";
    ctx.shadowBlur = 3;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

function drawNumbers() {
  ctx.save();
  ctx.font = "bold 1.6rem 'Inter', Arial, sans-serif";
  ctx.fillStyle = "#d7ae5f";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  for (let num = 1; num <= 12; num++) {
    let angle = ((num - 3) * Math.PI) / 6;
    let x = CENTER.x + Math.cos(angle) * (RADIUS - 36);
    let y = CENTER.y + Math.sin(angle) * (RADIUS - 36);
    ctx.fillText(num, x, y);
  }
  ctx.restore();
}

function drawHand(angleDeg, length, width, color, glow) {
  let angle = ((angleDeg - 90) * Math.PI) / 180;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(CENTER.x, CENTER.y);
  ctx.lineTo(
    CENTER.x + Math.cos(angle) * length,
    CENTER.y + Math.sin(angle) * length
  );
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.shadowColor = color;
  ctx.shadowBlur = 16 * glow;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawProgressRing(second, ms) {
  // Seconds progress gradient ring (ice blue to gold)
  const angle = ((second + ms / 1000) / 60) * 2 * Math.PI - Math.PI / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(
    CENTER.x,
    CENTER.y,
    RADIUS - 2,
    -Math.PI / 2,
    angle,
    false
  );
  let grad = ctx.createLinearGradient(
    CENTER.x + RADIUS * Math.cos(-Math.PI / 2),
    CENTER.y + RADIUS * Math.sin(-Math.PI / 2),
    CENTER.x + RADIUS * Math.cos(angle),
    CENTER.y + RADIUS * Math.sin(angle)
  );
  grad.addColorStop(0, "#e5f3ff");
  grad.addColorStop(0.8, "#65d2e9");
  grad.addColorStop(1, "#f8cc5c");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 9.5;
  ctx.shadowColor = "#e9d580";
  ctx.shadowBlur = 13;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.restore();
}

function animateScore() {
  scoreEl.style.transform = "scale(1.16)";
  scoreEl.style.color = "#ffb83d";
  setTimeout(() => {
    scoreEl.style.transform = "scale(1)";
    scoreEl.style.color = "";
  }, 480);
}

// Theme toggle
themeBtn.onclick = () => {
  document.body.classList.toggle('dark');
  themeBtn.textContent = document.body.classList.contains('dark') ? "☀️" : "🌙";
};

tzSelect.onchange = () => {
  timezone = tzSelect.value;
  lastHour = null; // So points add on next hour in new TZ
};

// Start
drawClock();