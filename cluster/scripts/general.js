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

function unassignClusters() {
    for (circle of circles) {
        circle.cluster = -1;
    }
}

function assignDifferentClustersToAll() {
    for (let i = 0; i < circles.length; i++) {
        circles[i].cluster = i;
    }
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

function unhideInfo() {
    if (document.getElementById('metricsSelector').value === "all") {
        document.getElementById('info').hidden = false;
    }
    else {
        document.getElementById('info').hidden = true;
    }
}