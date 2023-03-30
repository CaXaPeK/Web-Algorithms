var canvas = document.getElementById("fieldCanvas");
canvas.width = 500;
canvas.height = 500;

function getPosition(event) {
    var posX = 0;
    var posY = 0;

    if (!event) var event = window.event;

    if (event.pageX || event.pageY) {
        posX = event.pageX;
        posY = event.pageY;
    }
    else if (event.clientX || event.clientY) {
        posX = event.clientX + document.body.scrollLeft
            + document.documentElement.scrollLeft;
        posY = event.clientY + document.body.scrollTop
            + document.documentElement.scrollTop;
    }

    return {
        x: posX,
        y: posY
    }
}

function drawCircle(x, y) {
    var circle = canvas.getContext("2d");
    circle.beginPath();
    circle.arc(x, y, 10, 0, 2 * Math.PI);
    circle.fill();
}

function draw(event) {
    var x = getPosition(event).x - canvas.offsetLeft;
    var y = getPosition(event).y - canvas.offsetTop;
    drawCircle(x, y);
}

function drawStart() {
    document.addEventListener('mousemove', draw);
}

function drawStop() {
    document.removeEventListener('mousemove', draw);
}

document.addEventListener('mousedown', drawStart);
document.addEventListener('mouseup', drawStop);
document.addEventListener('mouseleave', drawStop);