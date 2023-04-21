
function makeEverythingWalls() {
    for (let i = 0; i < size; ++i) {
        for (let j = 0; j < size; ++j) {
            document.getElementById("cell."+i+"."+j).className = "wall";
        }
    }
}

function determineStartPosition() {
    if (size % 2 === 1) {
        return size+1;
    }
    else {
        return rand_num(0, size*size);
    }
}

function checkCardinalPoints(x, y) {
    let directions = ["north", "south", "east", "west"];
    while (directions.length > 0) {
        let directionIndex = rand_num(0, directions.length);
        let direction = directions[directionIndex];
        if (direction === "north") {
            if (y-2 >= 0 && document.getElementById("cell."+(y-2)+"."+x).className === "blankCell") {
                document.getElementById("cell."+(y-1)+"."+x).className = "blankCell";
                break;
            }
        }
        else if (direction === "south") {
            if (y+2 < size && document.getElementById("cell."+(y+2)+"."+x).className === "blankCell") {
                document.getElementById("cell."+(y+1)+"."+x).className = "blankCell";
                break;
            }
        }
        else if (direction === "east") {
            if (x-2 >= 0 && document.getElementById("cell."+y+"."+(x-2)).className === "blankCell") {
                document.getElementById("cell."+y+"."+(x-1)).className = "blankCell";
                break;
            }
        }
        else if (direction === "west") {
            if (x+2 < size && document.getElementById("cell."+y+"."+(x+2)).className === "blankCell") {
                document.getElementById("cell."+y+"."+(x+1)).className = "blankCell";
                break;
            }
        }
        directions.splice(directionIndex, 1);
    } 
}

function pushSuitablePoints(input, x, y) {
    let queue = input;
    if (y-2 >= 0 && document.getElementById("cell."+(y-2)+"."+x).className === "wall") {
        queue.push((y-2)*size + x);
    }
    if (y+2 < size && document.getElementById("cell."+(y+2)+"."+x).className === "wall") {
        queue.push((y+2)*size + x);
    }
    if (x-2 >= 0 && document.getElementById("cell."+y+"."+(x-2)).className === "wall") {
        queue.push(y*size + (x-2));
    }
    if (x+2 < size && document.getElementById("cell."+y+"."+(x+2)).className === "wall") {
        queue.push(y*size + (x+2));
    }
    return queue;
}

function randomizeNewPoints() {
    while (true) {
        let startIndex = rand_num(0, size*size);
        let newStartPoint = document.getElementById("cell."+parseInt(startIndex/size)+"."+(startIndex%size));
        let endIndex = rand_num(0, size*size);
        let newEndPoint = document.getElementById("cell."+parseInt(endIndex/size)+"."+(endIndex%size));
        if (newStartPoint !== newEndPoint && newStartPoint.className === "blankCell" && newEndPoint.className === "blankCell") {
            newStartPoint.className = "startPoint";
            newEndPoint.className = "endPoint";
            break;
        }
    }
}

document.querySelector('#generateLabirynth').onclick = async function() {
    changeAccesebility("disable", "all");
    makeEverythingWalls();
    let startPosition = determineStartPosition();
    document.getElementById("cell."+(parseInt(startPosition/size)+"."+(startPosition%size))).className = "blankCell";
    let queue = [];
    queue.push(startPosition);
    while (queue.length > 0) {
        let index = rand_num(0, queue.length);
        let currentCellPosition = queue[index];
        let y = parseInt(currentCellPosition/size);
        let x = currentCellPosition%size;
        document.getElementById("cell."+y+"."+x).className = "blankCell";
        await sleep(parseInt(1000/animationSpeed));
        queue.splice(index, 1)
        checkCardinalPoints(x, y);
        queue = pushSuitablePoints(queue, x, y);
    }
    randomizeNewPoints();
    changeAccesebility("enable", "all");
}