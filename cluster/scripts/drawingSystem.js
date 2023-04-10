let canvas = document.getElementById("fieldCanvas");
canvas.width = 500;
canvas.height = 500;

let RADIUS = 10;

let deleteModeOn = false;

document.querySelector('#modeSelector').onclick = function() {
    if (deleteModeOn) {
        document.getElementById('modeSelector').textContent = '🧽 Ластик';
        deleteModeOn = false;
    }
    else {
        document.getElementById('modeSelector').textContent = '✏️ Карандаш';
        deleteModeOn = true;
    }
}

function clearCanvas() {
    let clearing = canvas.getContext("2d");
    clearing.clearRect(0, 0, canvas.width, canvas.height);
}

document.querySelector('#clearCanvas').onclick = function() {
    clearCanvas();
    circles = [];
}

function getPosition(event) {
    let posX = 0;
    let posY = 0;

    if (!event) {
        let event = window.event;
    }

    if (event.pageX || event.pageY) {
        posX = event.pageX;
        posY = event.pageY;
    }
    else if (event.clientX || event.clientY) {
        posX = event.clientX + document.body.scrollLeft
            + document.documentElement.scrollLeft;
        posY = event.clientY + document.body.scrollTop
            + document.documentElement.scrollTop;
    }

    return {
        x: posX,
        y: posY
    }
}

function drawCircle(circle, color) {
    let circleDraw = canvas.getContext("2d");
    circleDraw.beginPath();
    circleDraw.arc(circle.x, circle.y, RADIUS, 0, 2 * Math.PI);
    circleDraw.fillStyle = color;
    circleDraw.fill();
}

function circlesDistance(circle1, circle2) {
    return Math.sqrt(Math.pow(circle2.x - circle1.x, 2) + Math.pow(circle2.y - circle1.y, 2)) - RADIUS * 2;
}

function distanceToCircle(x, y, circle) {
    return Math.sqrt(Math.pow(circle.x - x, 2) + Math.pow(circle.y - y, 2)) - RADIUS;
}

function findSelectedCircle(x, y) {
    for (let i = 0; i < circles.length; i++) {
        if (distanceToCircle(x, y, circles[i]) < 0) {
            return i;
        }
    }
    return -1;
}

function drawOrErase(event) {
    let absoluteX = getPosition(event).x;
    let absoluteY = getPosition(event).y;
    let x = absoluteX - canvas.offsetLeft;
    let y = absoluteY - canvas.offsetTop;

    if (!deleteModeOn) {
        if (new Circle(x, y).isNoCirclesNearby() && new Circle(x, y).isWithinCanvas()) {
            circles.push(new Circle(x, y));
            clearCanvas();
            for (circle of circles) {
                drawCircle(circle, "black");
            }
        }
    }
    else {
        let i = findSelectedCircle(x, y);
        if (i >= 0) {
            circles.splice(i, 1);
            clearCanvas();
            for (circle of circles) {
                drawCircle(circle, "black");
            }
        }
    }
}

function drawCross(x, y) {
    let crossDraw = canvas.getContext("2d");
    crossDraw.beginPath();
    crossDraw.lineWidth = 5;

    crossDraw.moveTo(x - 10, y - 10);
    crossDraw.lineTo(x + 10, y + 10);
    crossDraw.moveTo(x + 10, y - 10);
    crossDraw.lineTo(x - 10, y + 10);
    crossDraw.stroke();
}

function drawClusteredCircles() {
    clearCanvas();

    for (circle of circles) {
        if (circle.cluster === "noise") {
            drawCross(circle.x, circle.y);
        }
        else {
            drawCircle(circle, clusterColors[circle.cluster]);
        }
        
    }
    
    if (clusteringMethod === "kmeans") {
        for (centroid of centroids) {
            drawCross(centroid.x, centroid.y);
        }
    }
}

function drawStart() {
    document.addEventListener('click', drawOrErase);
    document.addEventListener('mousemove', drawOrErase);
}

function drawStop() {
    document.removeEventListener('mousemove', drawOrErase);
}

document.addEventListener('mousedown', drawStart);
document.addEventListener('mouseup', drawStop);
document.addEventListener('mouseleave', drawStop);