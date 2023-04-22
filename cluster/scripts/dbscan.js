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
        alert("Я не умею отображать более 30 кластеров!");
        return;
    }

    assignClusterColors();
    drawClusteredCircles();
}