//помимо функций изменения основных параметров в этом файле находятся вспомогательные функции (вроде rand_num и sleep)

let animationSpeed = 30;
let size = document.getElementById("gridSizeText").textContent;

document.querySelector("#animationSpeedSlider").addEventListener("input", (event) => {
    animationSpeed = event.target.value
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function rand_num(start, end)
{
    return start + Math.floor(Math.random() * (end - start));
}

document.querySelector('#getInfo').onclick = function() {
    alert("Данный алгоритм ищет путь от начальной точки до конечной, применяя алгоритм А*\n" + 
        "Цветовые обозначения клеток:\n" +
        "Жёлтый - начальная точка;\n" +
        "Тёмно-зелёный - конечная точка;\n" + 
        "Чёрный - стена;\n" + 
        "Синий - точка, проверяемая алгоритмом сейчас;\n" + 
        "Розовый - уже проверенная точка;\n" + 
        "Фиолетовый - точка, рассматриваемая алгоритмом, но ещё не проверенная;\n" + 
        "Светло-зелёный - найденный путь.");
}

function changeCellType() {
    if (this.className === "startPoint" || this.className === "endPoint") {
        alert("Не перекрашивайте начальную и конечную точки!");
        return;
    }
    else if (document.getElementById("selectorCellType").style.pointerEvents === "none") {
        return;
    }
    var selectedType = document.getElementById("selectorCellType").value;
    if (selectedType !== "wall") {
        document.getElementsByClassName(selectedType).item(0).className = "blankCell";
        this.className = selectedType;
    }
    else if (selectedType === "wall" && this.className ==="wall") {
        this.className = "blankCell";
    }
    else {
        this.className = "wall";
    }
}
  
function clearLabirynth() {
    let rows = document.getElementsByClassName("row");
    for (let i = 0; i < rows.length; ) {
        rows.item(i).remove();
    }
}
  
function changeAccesebility(action, amount) {
    if (action === "enable") {
        document.getElementById("findPathButton").hidden = "";
        document.getElementById("generateLabirynth").hidden = "";
        document.getElementById("selectorCellType").style.pointerEvents = "all";
        if (amount === "all") {
            //document.getElementById("initializeLabirynth").hidden = "";
            document.getElementById("gridSizeSlider").style.pointerEvents = "all";
        }
    }
    else if (action === "disable") {
        document.getElementById("findPathButton").hidden = "hidden";
        document.getElementById("generateLabirynth").hidden = "hidden";
        document.getElementById("selectorCellType").style.pointerEvents = "none";
        if (amount === "all") {
            //document.getElementById("initializeLabirynth").hidden = "hidden";
            document.getElementById("gridSizeSlider").style.pointerEvents = "none";
        }
    }
}

function initializeLabirynth() {
    clearLabirynth()
    size = document.getElementById("gridSizeText").textContent;
    let x_start = document.getElementById("toolbar").getBoundingClientRect().right + 20;
    for (let i = 0; i < size; ++i) {
        let row = document.createElement('div');
        row.className = "row";
        for (let j = 0; j < size; ++j) {
            let temp = document.createElement('span');
            temp.id = "cell." + i + "." + j;
            temp.style.left = x_start+20*(j+1)+'px';
            temp.style.top = 150+20*(i+1)+'px';
            temp.className = "blankCell";
            temp.setAttribute("pos", i*size + j);
            row.appendChild(temp);
            temp.onclick = changeCellType;
        }
        document.body.append(row);
    }
    document.getElementById("cell.0.0").className = "startPoint";
    document.getElementById("cell."+(size-1)+"."+(size-1)).className = "endPoint";
    changeAccesebility("enable", "some");
}

document.querySelector("#gridSizeSlider").addEventListener("input", (event) => {
    document.querySelector("#gridSizeText").textContent = event.target.value;
    initializeLabirynth();
})

initializeLabirynth();
//document.querySelector('#initializeLabirynth').onclick = initializeLabirynth;