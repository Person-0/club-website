const canvas = document.getElementById("cursor");
const ctx = canvas.getContext("2d");

function resize_canvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize_canvas();
window.onresize = resize_canvas();

const MAX_TRAILS = 50;
const cursor = {
    x: -Infinity,
    y: -Infinity,
    r: 50
}

let lastRecords = [];

canvas.addEventListener("mousemove", ({ clientX, clientY }) => {
    cursor.x = clientX;
    cursor.y = clientY;

    lastRecords.push({x: cursor.x, y: cursor.y});    
})

function drawCircle(x, y) {
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.arc(x, y, cursor.r, 0, Math.PI * 2);
    ctx.stroke();
}

function removeLastCursorInstance() {
    const len = lastRecords.length;
    if(len > 0) {
        if(len > MAX_TRAILS) {
            lastRecords = lastRecords.slice(MAX_TRAILS, len);
            return;
        }
        lastRecords.shift();
    }
}

let lastTime = performance.now();
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(const record of lastRecords) {
        drawCircle(record.x, record.y);
    }

    const now = performance.now();
    if(now - lastTime >= 7) {
        removeLastCursorInstance();
        lastTime = now;
    }
    
    requestAnimationFrame(animate);
}
animate();