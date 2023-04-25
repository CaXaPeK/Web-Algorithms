document.querySelector('#executeAlgorithm').onclick = function() {
    let map = [[]];
    map = initializeMap();
    let iterations = 1000;
    let bestPath = [];
    let bestPathLength = 99999999;
    let bestSmollPath = [];
    let bestSmollPathLength = 99999999;
    
    let canvas = document.querySelector('canvas'),
    context = canvas.getContext('2d');
    let canvasData = context.getImageData(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < iterations; i++) {
        let currPath = antAlgorithm(map);
        if (currPath[1] < bestPathLength) {
            bestPath = currPath[0];
            bestPathLength = currPath[1];
        }
        if (currPath[3] < bestSmollPathLength) {
            bestSmollPath = currPath[2];
            bestSmollPathLength = currPath[3];
        }
    }

    context.canvas.width = context.canvas.width;
    context.putImageData(canvasData, 0, 0);
    for (let i = 1; i < bestPath.length; i++) {
        drawLine(circlesX[bestPath[i-1]], circlesY[bestPath[i-1]], circlesX[bestPath[i]], circlesY[bestPath[i]], "cyan");
        console.log(bestSmollPath, bestSmollPathLength);
        drawLine(circlesX[bestSmollPath[i-1]], circlesY[bestSmollPath[i-1]], circlesX[bestSmollPath[i]], circlesY[bestSmollPath[i]], "red");
    }

    document.getElementById("executeAlgorithm").hidden = "hidden";
}


function initializeMap() {
    let size = circlesX.length
    let map = new Array(size);
    for (let i = 0; i < size; ++i) {
        map[i] = new Array(size);
        for (let j = 0; j < size; ++j) {
            map[i][j] = circlesDistance(circlesX[i], circlesY[i], circlesX[j], circlesY[j]);
        }
        map[i][i] = 0;
    }  
    return map;
}





