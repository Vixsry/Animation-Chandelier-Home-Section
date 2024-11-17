const canvas = document.getElementById('chandelier-canvas');
const ctx = canvas.getContext('2d');

// Mouse/Touch position
let pointer = {
    x: 0,
    y: 0,
    radius: 100,
    isActive: false
};

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class LightPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.speed = 0.01 + Math.random() * 0.02;
        this.amplitude = 2 + Math.random() * 3;
        this.phase = Math.random() * Math.PI * 2;
        this.brightness = 0.5 + Math.random() * 0.5;
        this.velocity = { x: 0, y: 0 };
        this.friction = 0.95;
        this.springFactor = 0.05;
    }

    update(time) {
        // Natural swaying motion
        const naturalY = this.baseY + Math.sin(time * this.speed + this.phase) * this.amplitude;

        // Interactive physics
        if (pointer.isActive) {
            const dx = pointer.x - this.x;
            const dy = pointer.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < pointer.radius) {
                const force = (pointer.radius - distance) / pointer.radius;
                const angle = Math.atan2(dy, dx);
                const repelX = Math.cos(angle) * force * 5;
                const repelY = Math.sin(angle) * force * 5;
                this.velocity.x -= repelX;
                this.velocity.y -= repelY;
            }
        }

        // Spring force towards base position
        const dx = this.baseX - this.x;
        const dy = naturalY - this.y;
        this.velocity.x += dx * this.springFactor;
        this.velocity.y += dy * this.springFactor;

        // Apply velocity with friction
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(78, 158, 255, ${this.brightness})`;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x, 0);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = 'rgba(78, 158, 255, 0.1)';
        ctx.stroke();
    }
}

const points = [];
const numPoints = 50;
let spacing = canvas.width / numPoints;

function createPoints() {
    points.length = 0;
    spacing = canvas.width / numPoints;
    for (let i = 0; i < numPoints; i++) {
        const x = spacing * i + spacing / 2;
        const y = 100 + Math.random() * 100;
        points.push(new LightPoint(x, y));
    }
}

// Mouse/Touch event handlers
function updatePointer(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    pointer.x = x;
    pointer.y = y;
}

canvas.addEventListener('mousedown', (e) => {
    pointer.isActive = true;
    updatePointer(e);
});

canvas.addEventListener('mousemove', (e) => {
    if (pointer.isActive) updatePointer(e);
});

canvas.addEventListener('mouseup', () => {
    pointer.isActive = false;
});

canvas.addEventListener('mouseleave', () => {
    pointer.isActive = false;
});

// Touch events
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    pointer.isActive = true;
    updatePointer(e);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (pointer.isActive) updatePointer(e);
});

canvas.addEventListener('touchend', () => {
    pointer.isActive = false;
});

function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.forEach(point => {
        point.update(time / 1000);
        point.draw();
    });
    requestAnimationFrame(animate);
}

createPoints();
animate(0);
window.addEventListener('resize', createPoints);

// Typed.js initialization
const typed = new Typed('.typed-text', {
    strings: ['Web Developer', 'UI/UX Designer', 'Freelancer'],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 2000,
    loop: true
});