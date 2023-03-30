var canvas = document.getElementById("makeGraph");
var ctx = canvas.getElementById('2d');

var X = [],
    Y = [],
    i = -1;
ctx.lineWidth = "5";

canvas.onmousedown = function(event) {
    var x = event.offsetX;
    var y = event.offsetY;
    ctx.fillRect(x, y, 20, 20);

    ++i;
    X[i] = x;
    Y[i] = y;
    if (i == 1) {
        ctx.moveTo(X[i-1], Y[i - 1]);
        ctx.lineTo(X[i], Y[i]);
        ctx.stroke();
    } else if (i > 1) {
        ctx.lineTo(X[i], Y[i]);
        ctx.stroke();
    }
}

