let optimizeCount = 0;
function optimizeTree(node) {
    optimizeCount ++;
    let allChildrenSame = true;
    let curVal = undefined;

    if(node.children.length <= 0) {
        return;
    }

    for (let i = 0; i < node.children.length; i++) {
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
        for (let i = 0; i < node.children.length; i++) {
            optimizeTree(node.children[i]);
        }
    } else {
        if (node.children.length > 0) {
            node.value = node.children[0].value;
            node.valuePercentage = node.children[0].valuePercentage;
            node.children = [];
            node.isleaf = true;
        }
    }
}