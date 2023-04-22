function manhattanDistance(point) {
    let endPoint = document.getElementsByClassName("endPoint").item(0);
    let d1 = Math.abs (endPoint.getAttribute("pos")%size - point.getAttribute("pos")%size);
    let d2 = Math.abs (parseInt(endPoint.getAttribute("pos")/size) - parseInt(point.getAttribute("pos")/size));
    return d1 + d2;
}

function findNeighbours(point) {
    let index = point.getAttribute("pos");
    let x = index%size;
    let y = parseInt(index/size);
    let result = [];
    let changedCoordinates = [x-1, x+1, y-1, y+1]
    let possibleNeighbours = ["cell."+y+"."+(x-1), "cell."+y+"."+(x+1), "cell."+(y-1)+"."+x, "cell."+(y+1)+"."+x]
    for (let i = 0; i < 4; ++i) {
        if (changedCoordinates[i] >= 0 && changedCoordinates[i] < size && document.getElementById(possibleNeighbours[i]).className !== "wall") {
            result.push(document.getElementById(possibleNeighbours[i]));
        }
    }
    return result;
}

function initializeGrid() {
    let grid = new Array(size);
    for (let i = 0; i < size; ++i) {
        grid[i] = new Array(size);
        for (let j = 0; j < size; ++j) {
            grid[i][j] = {
            f: Infinity,//manhattanDistance(document.getElementById("cell."+i+"."+j)),
            g: Infinity,
            parent: null
            };
        }
    }
    return grid;
}

function findBestPoint(queue, grid) {
    let bestIndex = queue[0];
    let positionInQueue = 0;
    for(let i = 1; i < queue.length; i++) {
        let currentIndex = queue[i];
        if(grid[parseInt(currentIndex/size)][currentIndex%size].f < grid[parseInt(bestIndex/size)][bestIndex%size].f) { 
            bestIndex = currentIndex;
            positionInQueue = i;
        }
    }
    let result = {index: 0, position: 0};
    result.index = bestIndex;
    result.position = positionInQueue;
    return result;
}

async function finishAlgorithm(grid, bestIndex) {
    //alert("путь найден!")
    changeAccesebility("enable", "all");
    changeAccesebility("disable", "some");
    let curr = grid[parseInt(bestIndex/size)][bestIndex%size].parent.getAttribute("pos")
    while (grid[parseInt(curr/size)][curr%size].parent !== null) {
        document.getElementById("cell."+(parseInt(curr/size)+"."+(curr%size))).className = "theWay";
        await sleep(parseInt(10000/animationSpeed))
        curr = grid[parseInt(curr/size)][curr%size].parent.getAttribute("pos")
    }
}

function isElementInQueue(queue, element) {
    let result = false;
    for (let j of queue) {
        if (element === j) {
            result = true;
            break;
        }
    }
    return result;
}

document.querySelector('#findPathButton').onclick = async function() {
    changeAccesebility("disable", "all");
    let startPoint = document.getElementsByClassName("startPoint").item(0);
    let endPoint = document.getElementsByClassName("endPoint").item(0);
    let grid = initializeGrid();
    startPosition = startPoint.getAttribute("pos");
    grid[parseInt(startPosition/size)][startPosition%size].f = manhattanDistance(startPoint);
    grid[parseInt(startPosition/size)][startPosition%size].g = 0;
    let queue = [];
    queue.push(startPosition);
    while (queue.length > 0) {
        bestPoint = findBestPoint(queue, grid);
        let bestIndex = bestPoint.index;
        let positionInQueue = bestPoint.position;
        let currentPoint = document.getElementById("cell."+parseInt(bestIndex/size)+"."+(bestIndex%size));
        if (currentPoint === endPoint) {
            finishAlgorithm(grid, bestIndex);
            return;
        }
        if (currentPoint !== startPoint) {
            currentPoint.className = "currentCell";
        }
        queue.splice(positionInQueue, 1)
        let currentNeighbours = findNeighbours(currentPoint)
        for (let i of currentNeighbours) {
            let neighboursIndex = i.getAttribute("pos");
            let tentativeScore = grid[parseInt(bestIndex/size)][bestIndex%size].g + 1;
            if (tentativeScore < grid[parseInt(neighboursIndex/size)][neighboursIndex%size].g) {
                grid[parseInt(neighboursIndex/size)][neighboursIndex%size].parent = currentPoint;
                grid[parseInt(neighboursIndex/size)][neighboursIndex%size].g = tentativeScore;
                grid[parseInt(neighboursIndex/size)][neighboursIndex%size].f = tentativeScore + manhattanDistance(i);
                if (!isElementInQueue(queue, neighboursIndex)) {
                    queue.push(neighboursIndex);
                    if (i !== startPoint && i !== endPoint) {
                        i.className = "possibleWay";
                        await sleep(parseInt(2000/animationSpeed));
                    }
                }
            }
        }
        await sleep(parseInt(3000/animationSpeed));
        if (currentPoint !== startPoint && currentPoint !== endPoint) {
            currentPoint.className = "seenCell";
        }
    }
    alert("путь не найден")
    startPoint.className = "startPoint";
    endPoint.className = "endPoint";
    changeAccesebility("enable", "all");
    changeAccesebility("disable", "some");
}