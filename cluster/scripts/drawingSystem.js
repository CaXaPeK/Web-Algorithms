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
    circleDraw.lineTo(circle.x, circle.y);
    circleDraw.fillStyle = color;
    circleDraw.fill();
}

function drawPieCircle(circle, color1, color2, color3) {
    let circleDraw = canvas.getContext("2d");
    let startAngle = -5 * Math.PI / 6;
    let colors = [color1, color2, color3];

    for (let i = 0; i < 3; i++) {
        if (colors[i] !== "noise") {
            circleDraw.beginPath();
            circleDraw.arc(circle.x, circle.y, RADIUS, startAngle, startAngle + 2 * Math.PI / 3);
            circleDraw.lineTo(circle.x, circle.y);
            circleDraw.fillStyle = colors[i];
            circleDraw.fill();
        }
        
        startAngle += 2 * Math.PI / 3;
    }
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

function drawCross(x, y, lineWidth, lineLength) {
    let crossDraw = canvas.getContext("2d");
    crossDraw.beginPath();
    crossDraw.lineWidth = lineWidth;

    crossDraw.moveTo(x - lineLength, y - lineLength);
    crossDraw.lineTo(x + lineLength, y + lineLength);
    crossDraw.moveTo(x + lineLength, y - lineLength);
    crossDraw.lineTo(x - lineLength, y + lineLength);
    crossDraw.stroke();
}

function drawClusteredCircles() {
    clearCanvas();

    if (metricsType !== "all") {
        for (circle of circles) {
            if (circle.cluster === "noise") {
                drawCross(circle.x, circle.y, 5, 10);
            }
            else {
                drawCircle(circle, clusterColors[circle.cluster]);
            }
            
        }
        
        if (clusteringMethod === "kmeans") {
            for (centroid of centroids) {
                drawCross(centroid.x, centroid.y, 5, 10);
            }
        }
    }
    else {
        if (clusteringMethod === "kmeans") {
            for (circle of circles) {
                drawPieCircle(circle, clusterColors[circle.euclidCluster], clusterColors[circle.manhattanCluster], clusterColors[circle.chebyshevCluster]);
            }
            for (centroid of centroids) {
                drawCross(centroid.x, centroid.y);
            }
        }

        if (clusteringMethod === "dbscan") {
            for (circle of circles) {
                let color1, color2, color3;

                if (circle.euclidCluster === "noise") {
                    color1 = "noise";
                    drawCross(circle.x, circle.y - 5, 2.5, 5);
                }
                else {
                    color1 = clusterColors[circle.euclidCluster];
                }

                if (circle.manhattanCluster === "noise") {
                    color2 = "noise";
                    drawCross(circle.x + 5, circle.y + 5, 2.5, 5);
                }
                else {
                    color2 = clusterColors[circle.manhattanCluster];
                }

                if (circle.chebyshevCluster === "noise") {
                    color3 = "noise";
                    drawCross(circle.x - 5, circle.y + 5, 2.5, 5);
                }
                else {
                    color3 = clusterColors[circle.chebyshevCluster];
                }

                drawPieCircle(circle, color1, color2, color3);
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