function findClosestCluster(cluster) {
    let closestCluster;
    let minDistance = Infinity;
    let visitedClusters = new Set();
    visitedClusters.add(cluster);

    for (circle1 of circles) {
        for (circle2 of circles) {
            if (circle1.cluster === cluster && circle2.cluster !== cluster) {
                let dist = distance(circle1.x, circle1.y, circle2.x, circle2.y);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestCluster = circle2.cluster;
                }
            }
        }
    }

    return closestCluster;
}

function mergeTwoClusters(cluster1, cluster2) {
    for (circle of circles) {
        if (circle.cluster === cluster2) {
            circle.cluster = cluster1;
        }
    }
}

function mergeAllClusters() {
    let visitedClusters = new Set();
    let currentClusterCount = circles.length;

    while (currentClusterCount !== clusterCount) {
        if (visitedClusters.size >= currentClusterCount) {
            visitedClusters.clear();
        }

        let index;
        let limit = (circles.length % 2 === 0) ? circles.length + 1 : circles.length;
        for (let i = 0; i < limit; i++) {
            index = (i % 2 === 0) ? i : limit - 1 - i;
            if (index >= circles.length) {
                break;
            }
            
            if (!visitedClusters.has(circles[index].cluster)) {
                visitedClusters.add(circles[index].cluster);
                let closestCluster = findClosestCluster(circles[index].cluster);
                mergeTwoClusters(circles[index].cluster, closestCluster);
                currentClusterCount--;
                break;
            }
        }
    }
}

function removeEmptyClusters() {
    let visitedCircles = new Set();
    for (let i = 0; i < clusterCount; i++) {
        let clusterToChange = -1;
        for (let j = 0; j < circles.length; j++) {
            if (!visitedCircles.has(j)) {
                if (clusterToChange === -1) {
                    clusterToChange = circles[j].cluster;
                }
                
                if (circles[j].cluster === clusterToChange) {
                    circles[j].cluster = i;
                    visitedCircles.add(j);
                }
            }
        }
    }
}

function startHierarchial() {
    clusterCount = parseInt(document.getElementById('clusterCount').value);
    if (circles.length < clusterCount) {
        alert("Слишком мало точек для такого количества кластеров!");
        return;
    }

    if (metricsType !== "all") {
        assignDifferentClustersToAll();
        mergeAllClusters();
        removeEmptyClusters();
    }
    else {
        metricsType = "euclidian";
        assignDifferentClustersToAll();
        mergeAllClusters();
        removeEmptyClusters();
        for (circle of circles) {
            circle.euclidCluster = circle.cluster;
            circle.cluster = -1;
        }

        metricsType = "manhattan";
        assignDifferentClustersToAll();
        mergeAllClusters();
        removeEmptyClusters();
        for (circle of circles) {
            circle.manhattanCluster = circle.cluster;
            circle.cluster = -1;
        }

        metricsType = "chebyshev";
        assignDifferentClustersToAll();
        mergeAllClusters();
        removeEmptyClusters();
        for (circle of circles) {
            circle.chebyshevCluster = circle.cluster;
            circle.cluster = -1;
        }

        metricsType = "all";
    }

    assignClusterColors();
    drawClusteredCircles();
}