class Circle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.cluster = -1;
    }

    isNoCirclesNearby() {
        for (circle of circles) {
            if (circlesDistance(this, circle) < 0) {
                return false;
            }
        }
        return true;
    }

    isWithinCanvas() {
        if (this.x >= RADIUS && canvas.offsetWidth - this.x >= RADIUS &&
            this.y >= RADIUS && canvas.offsetHeight - this.y >= RADIUS) {
            return true;
        }
        return false;
    }
}

let circles = [];
let centroids = [];

let clusterColors = [];
let clusterCount;

let colors = [
    "aqua",
    "aquamarine",
    "black",
    "burlywood",
    "cadetblue",
    "chartreuse",
    "chocolate",
    "crimson",
    "darkblue",
    "deeppink",
    "forestgreen",
    "gold",
    "firebrick",
    "green",
    "indigo",
    "lightgray",
    "lightgreen",
    "lightseagreen",
    "limegreen",
    "magenta",
    "mediumpurple",
    "mistyrose",
    "olive",
    "orange",
    "purple",
    "red",
    "slategray",
    "tomato",
    "yellow",
    "yellowgreen"
];

function assignClusterColors() {
    clusterColors = [];
    for (let i = 0; i < clusterCount; i++) {
        clusterColors.push("samplecolor");
        let isUniqueColor = false;

        while(!isUniqueColor) {
            isUniqueColor = true;
            clusterColors[i] = randomColor();

            for (let j = 0; j < i; j++) {
                if (clusterColors[i] === clusterColors[j]) {
                    isUniqueColor = false;
                    break;
                }
            }
        }
    }
}

function randomColor() {
    return colors[Math.floor(Math.random() * (colors.length - 1))];
}

//Выбор k точек без повторений
function generateStartCentroids() {
    let circleIds = [];
    for (let i = 0; i < circles.length; i++) {
        circleIds.push(i);
    }

    for (let i = 0; i < clusterCount; i++) {
        let randomId = Math.floor(Math.random() * (circleIds.length - 1));
        centroids.push(circles[circleIds[randomId]]);
        circleIds.splice(randomId, 1);
    }
}

function closestCentroid(circle) {
    let closestCentroidId = -1;
    let minDistance = Infinity;
    for (let i = 0; i < centroids.length; i++) {
        let distanceToCentroid = distance(circle.x, circle.y, centroids[i].x, centroids[i].y);
        if (distanceToCentroid < minDistance) {
            minDistance = distanceToCentroid;
            closestCentroidId = i;
        }
    }
    return closestCentroidId;
}

function newCentroid(clusterId) {
    let xSum = 0;
    let ySum = 0;
    let circleCount = 0;
    for (circle of circles) {
        if (circle.cluster === clusterId) {
            xSum += circle.x;
            ySum += circle.y;
            circleCount++;
        }
    }

    return new Circle(Math.floor(xSum / circleCount), Math.floor(ySum / circleCount));
}

function adjustCentroids() {
    let oldCentroids = [];
    while (oldCentroids.toString() !== centroids.toString()) {
        oldCentroids = centroids;
        for (circle of circles) {
            circle.cluster = closestCentroid(circle);
        }

        for (let i = 0; i < centroids.length; i++) {
            centroids[i] = newCentroid(i);
        }
    }
}

document.querySelector('#algorithmStart').onclick = function() {
    clusterCount = parseInt(document.getElementById('clusterCount').value);
    if (circles.length < clusterCount) {
        alert("Слишком мало точек для такого количества кластеров!");
        return;
    }
    centroids = [];
    
    generateStartCentroids();
    assignClusterColors();
    adjustCentroids();
    drawClusteredCircles();
}