// ========================
// Fireworks Animation
// ========================
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
let fireworks = [], particles = [];
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize); resize();
function random(min, max) { return Math.random() * (max - min) + min; }

class Firework {
    constructor() { this.x = random(canvas.width * 0.2, canvas.width * 0.8); this.y = canvas.height; this.targetY = random(canvas.height * 0.2, canvas.height * 0.5); this.speed = random(7, 9); this.color = `hsl(${random(0, 360)},100%,60%)`; this.exploded = false; }
    update() { this.y -= this.speed; if (this.y <= this.targetY && !this.exploded) { this.explode(); this.exploded = true; } }
    explode() { for (let i = 0; i < 80; i++) { particles.push(new Particle(this.x, this.y, this.color)); } }
    draw() { ctx.beginPath(); ctx.arc(this.x, this.y, 2, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.fill(); }
}

class Particle {
    constructor(x, y, color) { this.x = x; this.y = y; this.color = color; this.angle = random(0, Math.PI * 2); this.speed = random(1, 6); this.life = 100; }
    update() { this.x += Math.cos(this.angle) * this.speed; this.y += Math.sin(this.angle) * this.speed + 0.2; this.speed *= 0.98; this.life -= 1.5; }
    draw() { ctx.beginPath(); ctx.arc(this.x, this.y, 2, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.globalAlpha = Math.max(this.life / 100, 0); ctx.fill(); ctx.globalAlpha = 1; }
}

function animate() { ctx.fillStyle = "rgba(0,0,0,0.2)"; ctx.fillRect(0, 0, canvas.width, canvas.height); if (Math.random() < 0.05) fireworks.push(new Firework()); fireworks.forEach((f, i) => { f.update(); f.draw(); if (f.exploded) fireworks.splice(i, 1); }); particles.forEach((p, i) => { p.update(); p.draw(); if (p.life <= 0) particles.splice(i, 1); }); requestAnimationFrame(animate); }
animate();

// ========================
// Music 3 Loops
// ========================
const music = document.getElementById("bg-music");
const playBtn = document.getElementById("playMusicBtn");
let playCount = 0, MAX_PLAYS = 3;
playBtn.addEventListener("click", async () => {
    playBtn.style.display = "none"; playCount = 0; await music.play();
});
music.loop = false;
music.addEventListener("ended", async () => {
    playCount++; if (playCount < MAX_PLAYS) { music.currentTime = 0; await music.play(); } else { music.pause(); music.currentTime = 0; }
});

// ========================
// Bottom Wish Feature
// ========================
const nameDisplay = document.getElementById("nameDisplay");
const createOwnBtn = document.getElementById("createOwnBtn");
const nameInputDiv = document.getElementById("nameInputDiv");
const userNameInput = document.getElementById("userNameInput");
const submitNameBtn = document.getElementById("submitNameBtn");
const shareWishBtn = document.getElementById("shareWishBtn");

// Display name from URL if available
const urlParams = new URLSearchParams(window.location.search);
let userNameFromURL = urlParams.get("name");
if (userNameFromURL) {
    nameDisplay.textContent = `🪔 Deepavali wish from ${decodeURIComponent(userNameFromURL)} 🪔`;
    nameDisplay.classList.remove("hidden");
}

// Click Create Your Own
createOwnBtn.addEventListener("click", () => {
    nameInputDiv.style.display = "block";
    createOwnBtn.style.display = "none";
    if (userNameFromURL) nameDisplay.classList.add("hidden");
});

// Submit new name
submitNameBtn.addEventListener("click", () => {
    const name = userNameInput.value.trim();
    if (!name) { alert("Please enter your name ✨"); return; }
    nameDisplay.textContent = `🪔 Deepavali wish from ${name} 🪔`;
    nameDisplay.classList.remove("hidden");
    shareWishBtn.classList.remove("hidden");
    nameInputDiv.style.display = "none";
});

// Share button
shareWishBtn.addEventListener("click", () => {
    const name = userNameInput.value.trim();
    if (!name) return;
    const shareURL = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(name)}`;
    if (navigator.share) { navigator.share({ title: "Happy Deepavali!", text: "Check out my Deepavali greeting!", url: shareURL }).catch(err => console.log(err)); }
    else { navigator.clipboard.writeText(shareURL); alert("📋 Link copied! Share it with your friends!"); }
});
