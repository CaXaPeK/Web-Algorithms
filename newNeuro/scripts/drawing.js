class Circle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.cluster = -1;
        this.euclidCluster = -1;
        this.manhattanCluster = -1;
        this.chebyshevCluster = -1;
    }

    isWithinCanvas() {
        if (this.x >= RADIUS && canvas.offsetWidth - this.x >= RADIUS &&
            this.y >= RADIUS && canvas.offsetHeight - this.y >= RADIUS) {
            return true;
        }
        return false;
    }

    neighborCount() {
        let count = 0;
        for (circle of circles) {
            if (distance(this, circle) <= epsilon) {
                count++;
            }
        }
        count--;
        return count;
    }
}

let canvas = document.getElementById("fieldCanvas");
canvas.width = 500;
canvas.height = 500;

let RADIUS = 10;

function clearCanvas() {
    let clearing = canvas.getContext("2d");
    clearing.clearRect(0, 0, canvas.width, canvas.height);
}

document.querySelector('#clearCanvas').onclick = function() {
    clearCanvas();
    document.getElementById("answer").textContent = "Нарисуйте цифру.";
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
    circleDraw.lineTo(circle.x, circle.y);
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
    if (new Circle(x, y).isWithinCanvas())  {
        drawCircle(new Circle(x,y), "black");
    }
}

function drawStart() {
    document.addEventListener('click', drawOrErase);
    document.addEventListener('mousemove', drawOrErase);
}

function drawStop() {
    document.removeEventListener('mousemove', drawOrErase);
    defineDigit();
}

document.addEventListener('mousedown', drawStart);
document.addEventListener('mouseup', drawStop);