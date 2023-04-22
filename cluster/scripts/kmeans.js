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