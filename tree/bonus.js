let optimizeCount = 0;
function optimizeTree(node) {
    console.log(node, optimizeCount);
    optimizeCount ++;
    let allChildrenSame = true;
    let curVal = undefined;

    if(node.children.length <= 0) {
        return;
    }

    for (let i = 0; i < node.children.length; i++) {
        //console.log(node.children[i].isLeaf(), (node.children[i].valuePercentage === 1 && node.children[i].value === node.children[i - 1].value));
        if(node.children[i].valuePercentage < 1) {
            allChildrenSame = false;
            break;
        }
    }
    for (let i = 0; i < node.children.length; i++) {
        if(curVal!== undefined){
            if(node.children[i].value != curVal){
                allChildrenSame = false;
                break;
            }
            curVal = node.children[i].value;
        }
        else{
            curVal = node.children[i].value;
        }
    }
    

    if (!allChildrenSame) {
        //console.log(node.name, "notsameee");
        for (let i = 0; i < node.children.length; i++) {
            optimizeTree(node.children[i]);
        }
    } else {
        //console.log(node.name, "lolll");
        if (node.children.length > 0) {
            console.log('before')
            console.log(node.children)
            node.value = node.children[0].value;
            node.valuePercentage = node.children[0].valuePercentage;
            //node.name = node.children[0].name;
            node.children = [];
            node.isleaf = true;
            console.log('after')
            console.log(node.children)
            //node.children = [];
        }
    }
}