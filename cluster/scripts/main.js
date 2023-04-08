class Circle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

var circles = [];
var centroidsX = [];
var centroidsY = [];
var clusterColors = [];
var clusterCount;

var colors = [
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

function generateStartCentroids() {
    for (let i = 0; i < clusterCount; i++) {
        centroidsX.push(Math.floor(Math.random() * canvas.width));
        centroidsY.push(Math.floor(Math.random() * canvas.height));
    }
}

function adjustCentroids() {
    let oldCentroidsX = [];
    let oldCentroidsY = [];
    while (oldCentroidsX.toString() !== centroidsX.toString() ||
           oldCentroidsY.toString() !== centroidsY.toString()) {
        
    }
}

document.querySelector('#algorithmStart').onclick = function() {
    if (circles.length < clusterCount) {
        alert("Слишком мало точек для такого количества кластеров!");
        return;
    }

    centroidsX = [];
    centroidsY = [];
    clusterCount = parseInt(document.getElementById('clusterCount').value);
    generateStartCentroids();
    assignClusterColors();
    console.log(clusterColors);
    //adjustCentroids();
}