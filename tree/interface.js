start_button.addEventListener('click', start);
reset_button.addEventListener('click', reset);
getFile1_button.addEventListener('click', chooseIndex0);
getFile2_button.addEventListener('click', chooseIndex1);
getFile3_button.addEventListener('click', chooseIndex2);
getFile_button.addEventListener('click', createTree);
optimize_button.addEventListener('click', optimize);
const FILE = document.getElementById('file_input');
let flag = true;
let root;

document.getElementById('input_data').value = "Hair, Legs, Toothed, Breathes";
let index = 0;

function chooseIndex0() {
    document.getElementById('input_data').value = "Hair, Legs, Toothed, Breathes";
    index = 0;
    createTree();
}

function chooseIndex1() {
    document.getElementById('input_data').value = "Выше,     Нет,    На месте";
    index = 1;
    createTree();
}

function chooseIndex2() {
    document.getElementById('input_data').value = "TANG,ON DINH,CAO,TB";
    index = 2;
    createTree();
}

startTreeBuilding(getData(index));

let treeRoot = document.getElementById("root");

function createTree() {
    treeRoot = removeTree();
    if(FILE.value === '') {
        startTreeBuilding(getData(index));
        drawTree(root, treeRoot);
    }
    else {
        let dataBase = FILE.files[0];
        let reader = new FileReader();
        reader.readAsText(dataBase);
        reader.onload = function () {
            dataBase = recieveData(reader.result);
            startTreeBuilding(dataBase);
            drawTree(root, treeRoot);
        }
    }
    flag = true;
} 

function start() {
    if(flag) {
        makeDecision();
    }
}

function reset() {
    treeRoot = removeTree(treeRoot);
}



function drawTree(currentNode, treeElement) {
    let li = document.createElement("li");
    let a = document.createElement("a");
    currentNode.a = a;
    a.href = "#";
    let nodeName = currentNode.name;
    if(nodeName === "root") {
        a.textContent = nodeName;
    }
    else {
        let feature = currentNode.parent.decisionMaker;
        a.textContent = feature + " : " + nodeName;
    }
    
    li.appendChild(a);
    treeElement.appendChild(li);
    if(currentNode.isleaf || currentNode.isLeaf()) { 
        let finalUl = document.createElement("ul");
        let finalLi = document.createElement("li");
        let finalA = document.createElement("a");
        finalA.href = "#";
        finalA.textContent = currentNode.value;
        finalLi.appendChild(finalA);
        finalUl.appendChild(finalLi);
        li.appendChild(finalUl);

        return;
    }
    let ul = document.createElement("ul");
    li.appendChild(ul);
    for (let i = 0; i < currentNode.children.length; i++) {
        drawTree(currentNode.children[i], ul);
    }
}

function optimize() {
    if(flag) {
        if (FILE.value === '') {
            root = new TreeNode(getData(index), 'root');
        } else {
            let data = FILE.files[0];
            let reader = new FileReader();
            reader.readAsText(data);
            reader.onload = function () {
                data = recieveData(reader.result);
                root = new TreeNode(data, 'root');
            }
        }
        buildTree(root);
        optimizeTree(root);
        document.getElementById("root").innerHTML = "";
        drawTree(root, treeRoot);
    }
}

function removeTree() {
    let divTree = document.getElementById("tree");
    treeRoot.remove();
    let ul = document.createElement("ul");
    ul.setAttribute('id', 'root')
    divTree.appendChild(ul);
    return ul;
}

drawTree(root, treeRoot);

const list = document.getElementById('root');

list.addEventListener('wheel', function(event) {
	event.preventDefault();
	
	const delta = Math.sign(event.deltaY);
	const zoomValue = parseFloat(window.getComputedStyle(list).zoom) || 1;
	
	if (zoomValue - delta > 0.1 && zoomValue - delta < 5) {
		list.style.zoom = zoomValue - delta;
	}
});