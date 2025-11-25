const canvas = document.getElementById("cursor");
const ctx = canvas.getContext("2d");

function resize_canvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize_canvas();
window.onresize = resize_canvas();

const GRAVITY = 1.5;
const MAX_TRAILS = 10;
const gravitylerpfac = 0.00045;

const cursor = {
    x: -Infinity,
    y: -Infinity,
    r: 10
}
const androidLogo = new Image();
androidLogo.src = "./assets/icon.png";

let lastRecords = [];
let clickRecords = [];

window.addEventListener("mousemove", ({ clientX, clientY }) => {
    cursor.x = clientX;
    cursor.y = clientY;

    lastRecords.push({x: cursor.x, y: cursor.y});    
})

window.addEventListener("click", () => {
    clickRecords.push({...cursor, velocity: 0});
})

function drawCircle(x, y) {
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.arc(x, y, cursor.r, 0, Math.PI * 2);
    ctx.fill();
}

function removeLastCursorInstance() {
    if(lastRecords.length > 0) {
        while(lastRecords.length > MAX_TRAILS) {
            lastRecords.shift();
        }
        lastRecords.shift();
    }
}

let lastRemoveTime = performance.now();
let lastFrameTime = 0;
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = performance.now();
    const delta = Math.min(now - lastFrameTime, 100);

    for(const record of lastRecords) {
        drawCircle(record.x, record.y);
    }
    drawCircle(cursor.x, cursor.y);

    for(const clickRecord of clickRecords){
        if(clickRecord.y > window.innerHeight){
            clickRecords = clickRecords.filter(e => e.x !== clickRecord.x && e.y !== clickRecord.y);
            continue;
        }
        ctx.drawImage(androidLogo, clickRecord.x, clickRecord.y, 25, 25);

        clickRecord.velocity = clickRecord.velocity + (clickRecord.velocity + GRAVITY) * (delta * gravitylerpfac);
        clickRecord.y += clickRecord.velocity;
    }

    if(now - lastRemoveTime >= delta / 5) {
        removeLastCursorInstance();
        lastRemoveTime = now;
    }
    
    requestAnimationFrame(animate);
}
animate();