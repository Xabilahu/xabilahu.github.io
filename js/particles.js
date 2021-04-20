const canvas = document.getElementById('canvas');
const toggle = document.getElementById('toggle');
const circleDegrees = Math.PI * 2;
const minParticles = 90;
const maxParticles = 150;
const nParticles = Math.floor(Math.random() * (maxParticles - minParticles + 1) + minParticles);
const fpsInterval = 1000 / 60;

var canvasSupported = true;
var ctx, connectDist, elapsed, now, last, animationID = undefined;
var particles = [];

class Particle {
    constructor(x, y, radius, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this. x < 0 || this.x >= ctx.canvas.width) {
            this.speedX = -this.speedX;
        }

        if (this.y < 0 || this.y >= ctx.canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    distance(otherParticle) {
        return ((this.x - otherParticle.x) ** 2) + ((this.y - otherParticle.y) ** 2);
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, circleDegrees);
        ctx.fill();
    }
}

function initParticles() {
    for (let idx = 0; idx < nParticles; idx++) {
        let randomX = Math.floor(Math.random() * ctx.canvas.width);
        let randomY = Math.floor(Math.random() * ctx.canvas.height);
        let randomRadius = 2 + Math.floor((Math.random() * 3));
        let randomSpeedX = 0.15 + (Math.random() * 0.65);
        let randomSpeedY = 0.05 + (Math.random() * 0.35);

        if (Math.random() < 0.5) randomSpeedX *= -1;
        if (Math.random() < 0.5) randomSpeedY *= -1;

        let p = new Particle(randomX, randomY, randomRadius, randomSpeedX, randomSpeedY, '#6c757d');
        particles.push(p);
    }
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            if (particles[i].distance(particles[j]) < connectDist) {
                ctx.beginPath();
                ctx.strokeStyle = '#343a40';
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
}

function drawParticles() {
    animationID = window.requestAnimationFrame(drawParticles);

    now = Date.now();
    elapsed = now - last;

    if (elapsed > fpsInterval) {
        last = now - (elapsed % fpsInterval);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        connectParticles();
        for (let p of particles) {
            p.draw();
            p.update();
        }
    }
}

function updateCanvasSize() {
    ctx = canvas.getContext('2d');
    ctx.canvas.width = canvas.offsetWidth;
    ctx.canvas.height = canvas.offsetHeight;
    connectDist = (ctx.canvas.width / 8) * (ctx.canvas.height / 8);
}

function toggleCanvasAnimation(force=false) {
    if (canvasSupported) {
        let state = canvas.style.display;
        if (state == 'none' || force || animationID == undefined) {
            if (! toggle.classList.contains('on')) {
                toggle.classList.remove('off');
                toggle.classList.add('on');
            } 
            canvas.style.display = "block";
            last = Date.now();
            animationID = window.requestAnimationFrame(drawParticles);
        } else {
            if (animationID != undefined) {
                window.cancelAnimationFrame(animationID);
                animationID = undefined;
            }
            if (! toggle.classList.contains('off')) {
                toggle.classList.remove('on');
                toggle.classList.add('off');
            }
            canvas.style.display = "none";
        }
    }
}

if (canvas.getContext){
    updateCanvasSize();
    document.addEventListener('resize', updateCanvasSize);

    initParticles();
    toggleCanvasAnimation(true);
} else {
    canvas.remove();
    canvasSupported = false;
    console.log('[ERROR] Canvas not supported. No particle will be rendered.');
}
