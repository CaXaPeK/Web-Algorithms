class Circle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.cluster = -1;
        this.euclidCluster = -1;
        this.manhattanCluster = -1;
        this.chebyshevCluster = -1;
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

let circles = [];
let centroids = [];

let clusterColors = [];
let clusterCount;
let metricsType;
let clusteringMethod;
let epsilon;
let minCircles;

const colors = [
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
    "yellowgreen",
    "darkslategray"
];

function distance(x1, y1, x2, y2) {
    switch (metricsType) {
        case "euclidian":
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        case "manhattan":
            return Math.abs(x2 - x1) + Math.abs(y2 - y1);
        case "chebyshev":
            return Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
        default:
            return -1;
    }
}

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

function startKMeans() {
    clusterCount = parseInt(document.getElementById('clusterCount').value);
    if (clusterCount > 30) {
        clusterCount = 30;
        document.getElementById('clusterCount').value = '30';
    }
    if (clusterCount < 1) {
        clusterCount = 1;
        document.getElementById('clusterCount').value = '1';
    }
    if (circles.length < clusterCount) {
        alert("Слишком мало точек для такого количества кластеров!");
        return;
    }

    centroids = [];
    
    generateStartCentroids();
    let initialCentroids = centroids;

    assignClusterColors();

    if (metricsType !== "all") {
        adjustCentroids();
    }
    else {
        metricsType = "euclidian";
        adjustCentroids();
        for (circle of circles) {
            circle.euclidCluster = circle.cluster;
            circle.cluster = -1;
        }
        centroids = initialCentroids;

        metricsType = "manhattan";
        adjustCentroids();
        for (circle of circles) {
            circle.manhattanCluster = circle.cluster;
            circle.cluster = -1;
        }
        centroids = initialCentroids;

        metricsType = "chebyshev";
        adjustCentroids();
        for (circle of circles) {
            circle.chebyshevCluster = circle.cluster;
            circle.cluster = -1;
        }

        metricsType = "all";
    }
    
    drawClusteredCircles();
}

function findNeighbors(circle) {
    let neighborIds = new Set();
    
    for (let i = 0; i < circles.length; i++) {
        if (distance(circle.x, circle.y, circles[i].x, circles[i].y) <= epsilon && circle !== circles[i]) {
            neighborIds.add(i);
        }
    }
    return neighborIds;
}

function uniteSets(set1, set2) {
    let unitedSet = new Set(set1);
    for (element of set2) {
        unitedSet.add(element);
    }
    return unitedSet;
}

function unassignClusters() {
    for (circle of circles) {
        circle.cluster = -1;
    }
}

function assignClustersDBSCAN() {
    for (let i = 0; i < circles.length; i++) {
        if (circles[i].cluster !== -1) {
            continue;
        }
        
        let neighborIds = findNeighbors(circles[i]);
        if (neighborIds.size + 1 < minCircles) {    
            circles[i].cluster = "noise";
            continue;
        }
        
        circles[i].cluster = clusterCount;
        clusterCount++;

        for (j of neighborIds) {
            if (circles[j].cluster === "noise") {
                circles[j].cluster = circles[i].cluster;
            }
            if (circles[j].cluster !== -1) {
                continue;
            }
            circles[j].cluster = circles[i].cluster;

            let newNeighborIds = findNeighbors(circles[j]);
            if (newNeighborIds.size + 1 >= minCircles) {
                neighborIds = uniteSets(neighborIds, newNeighborIds);
            }
        }
    }
}

function startDBSCAN() {
    unassignClusters();
    epsilon = document.getElementById('epsilon').value;
    minCircles = document.getElementById('minCircles').value;
    clusterCount = 0;

    if (metricsType !== "all") {
        assignClustersDBSCAN();
    }
    else {
        let maxClusterCount = 0;

        metricsType = "euclidian";
        assignClustersDBSCAN();
        for (circle of circles) {
            circle.euclidCluster = circle.cluster;
            circle.cluster = -1;
        }
        maxClusterCount = Math.max(clusterCount, maxClusterCount);
        clusterCount = 0;

        metricsType = "manhattan";
        assignClustersDBSCAN();
        for (circle of circles) {
            circle.manhattanCluster = circle.cluster;
            circle.cluster = -1;
        }
        maxClusterCount = Math.max(clusterCount, maxClusterCount);
        clusterCount = 0;

        metricsType = "chebyshev";
        assignClustersDBSCAN();
        for (circle of circles) {
            circle.chebyshevCluster = circle.cluster;
            circle.cluster = -1;
        }
        clusterCount = Math.max(clusterCount, maxClusterCount);
        metricsType = "all";
    }

    if (clusterCount > 30) {
        alert("Я не умею отображать больше 30 кластеров!");
        return;
    }

    assignClusterColors();
    drawClusteredCircles();
}

function startHierarchial() {
    clusterCount = parseInt(document.getElementById('clusterCount').value);


}

document.querySelector('#algorithmStart').onclick = function() {
    clusteringMethod = document.getElementById('clusteringMethod').value;
    metricsType = document.getElementById('metricsSelector').value;

    switch (clusteringMethod) {
        case "kmeans":
            startKMeans();
            break;
        case "dbscan":
            startDBSCAN();
            break;
        case "hierarchial":
            startHierarchial();
            break;
        default:
            break;
    }
}

document.querySelector('#epsilon').addEventListener("input", (event) => {
    let value = document.querySelector('#epsilonValue');
    value.textContent = event.target.value;
    epsilon = event.target.value;
})

document.querySelector('#minCircles').addEventListener("input", (event) => {
    let value = document.querySelector('#minCirclesValue');
    value.textContent = event.target.value;
    minCircles = event.target.value;
})