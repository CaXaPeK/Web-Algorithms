let canvas = document.getElementById("fieldCanvas");
canvas.width = 500;
canvas.height = 500;

let circlesX = [];
let circlesY = [];
let RADIUS = 10;

let deleteModeOn = false;

document.querySelector('#modeSelector').onclick = function() {
    if (deleteModeOn) {
        document.getElementById('modeSelector').textContent = '🧽 Удалить точки';
        deleteModeOn = false;
    }
    else {
        document.getElementById('modeSelector').textContent = '✏️ Рисовать точки';
        deleteModeOn = true;
    }
}

document.querySelector('#clearCanvas').onclick = function() {
    let clearing = canvas.getContext("2d");
    clearing.clearRect(0, 0, canvas.width, canvas.height);
    circlesX = [];
    circlesY = [];
    document.getElementById("executeAlgorithm").hidden = "";
}

function getPosition(event) {
    let posX = 0;
    let posY = 0;

    if (!event) var event = window.event;

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

function drawCircle(x, y, color) {
    var circle = canvas.getContext("2d");
    circle.beginPath();
    circle.arc(x, y, RADIUS, 0, 2 * Math.PI);
    circle.fillStyle = color;
    circle.fill();
}

function drawLine(firstX, firstY, secondX, secondY, color) {
    var line = canvas.getContext('2d');
    line.strokeStyle = color;
    line.lineWidth = 5;
    line.beginPath();
    line.moveTo(firstX, firstY);
    line.lineTo(secondX, secondY);
    line.stroke();
}

function drawMap(gnome, colorInInteger) {
    let redValue;
    let greenValue;
    if (colorInInteger < 255) {
        redValue = 255;
        greenValue = Math.sqrt(colorInInteger) * 16;
        greenValue = Math.round(greenValue);
    } else {
        greenValue = 255;
        colorInInteger = colorInInteger - 255;
        redValue = 255 - (colorInInteger * colorInInteger / 255)
        redValue = Math.round(redValue);
    }
    for (let i = 0; i < gnome.length - 1; ++i) {
        let firstCity = gnome[i];
        let secondCity = gnome[i+1];
        drawLine(circlesX[firstCity], circlesY[firstCity], circlesX[secondCity], circlesY[secondCity], "#"+intToHex(redValue)+intToHex(greenValue)+"00");
    }
}

function circlesDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) - RADIUS * 2;
}

function distanceToCircle(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) - RADIUS;
}

function isNoCirclesNearby(x, y) {
    for (let i = 0; i < circlesX.length; i++) {
        if (circlesDistance(x, y, circlesX[i], circlesY[i]) < 0) {
            return false;
        }
    }
    return true;
}

function findSelectedCircle(x, y) {
    for (let i = 0; i < circlesX.length; i++) {
        if (distanceToCircle(x, y, circlesX[i], circlesY[i]) < 0) {
            return i;
        }
    }
    return -1;
}

function isWithinCanvas(x, y) {
    if (x - canvas.offsetLeft >= RADIUS && canvas.offsetLeft + canvas.offsetWidth - x >= RADIUS &&
        y - canvas.offsetTop >= RADIUS && canvas.offsetTop + canvas.offsetHeight - y >= RADIUS) {
        return true;
    }
    return false;
}

function drawOrErase(event) {
    let absoluteX = getPosition(event).x;
    let absoluteY = getPosition(event).y;
    let x = absoluteX - canvas.offsetLeft;
    let y = absoluteY - canvas.offsetTop;
    if (!algorithmIsWorking) {
        if (!deleteModeOn) {
            if (isNoCirclesNearby(x, y) && isWithinCanvas(absoluteX, absoluteY)) {
                drawCircle(x, y, "black");
                circlesX.push(x);
                circlesY.push(y);
            }
        }
        else {
            let i = findSelectedCircle(x, y);
            if (i >= 0) {
                for (j = 0; j < 5; j++) {
                    drawCircle(circlesX[i], circlesY[i], "#fdff8b");
                }
                circlesX.splice(i, 1);
                circlesY.splice(i, 1);
            }
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