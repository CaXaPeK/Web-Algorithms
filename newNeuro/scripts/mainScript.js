function sigmoidActivation(input) {
    return (1 / (1 + Math.exp(-input)));
}

function findHiddenLayerOutput(input, hiddenLayerWeights, hiddenLayerBias) {
    let result = [];
    for (let i = 0; i < hiddenLayerWeights.length; ++i) {
        result[i] = hiddenLayerBias[i];
        for (let j = 0; j < hiddenLayerWeights[i].length; ++j) {
            result[i] += input[j] * hiddenLayerWeights[i][j];
        }
        result[i] = sigmoidActivation(result[i]);
    }
    return result;
}

function findOutputLayerActivation(input, outputLayerWeights, outputLayerBias) {
    let result = [];
    for (let i = 0; i < outputLayerWeights.length; ++i) {
        result[i] = outputLayerBias[i];
        for (let j = 0; j < outputLayerWeights[i].length; ++j) {
            result[i] += outputLayerWeights[i][j] * input[j];
        }
    }
    return result;
}

function findBiggestElement(input) {
    result = -999999999;
    for (let i = 0; i < input.length; ++i) {
        if (input[i] > result) {
            result = input[i];
        }
    }
    return result;
}

function findDenominator(input, difference) {
    let result = 0;
    for (let i = 0; i < input.length; ++i) {
        result += Math.exp(input[i] - difference);
    }
    return result;
}

function nn(input, hiddenLayerWeights, hiddenLayerBias, outputLayerWeights, outputLayerBias) {
    let hiddenLayerOutput = findHiddenLayerOutput(input, hiddenLayerWeights, hiddenLayerBias);
    let outputLayerActivation = findOutputLayerActivation(hiddenLayerOutput, outputLayerWeights, outputLayerBias);
    let biggestOutput = findBiggestElement(outputLayerActivation);
    let denominator = findDenominator(outputLayerActivation, biggestOutput); 
    let result = [];
    for (let i = 0; i < outputLayerActivation.length; ++i) {
        result[i] = (Math.exp(outputLayerActivation[i] - biggestOutput))/denominator;
    }
    return result;
}

function closerImage(input, flag) {
    let result = {startX: input[0].length, endX: -1, startY: input.length, endY: -1};
    for (let i = 0; i < input.length; ++i) {
        for (let j = 0; j < input[0].length; ++j) {
            if (input[i][j] < flag) {
                result.startX = Math.min(result.startX, j);
                result.startY = Math.min(result.startY, i);
                result.endX = Math.max(result.endX, j);
                result.endY = Math.max(result.endY, i);
            }
        }
    }
    return result;
}

function findCenterMass(input) {
    let result = {x: 0, y: 0};
    let sumX = 0;
    let sumY = 0;
    let sumPixels = 0;
    for (let i = 0; i < input.length; ++i) {
        for (let j = 0; j < input[0].length; ++j) {
            let pixel = (1 - input[i][j]);
            sumPixels += pixel;
            sumY += i * pixel;
            sumX += j * pixel;
        }
    }
    result.y = Math.round(input.length / 2 - sumY/sumPixels);
    result.x = Math.round(input[0].length / 2 - sumX/sumPixels);
    return result;
}

function imageToGrayscale(input) {
    let result = [];
    for (let i = 0; i < input.height; ++i) {
        result[i] = [];
        for (let j = 0; j < input.width; ++j) {
            let currentIndex = i * 4 * input.width + j * 4;
            let alpha = input.data[currentIndex + 3];
            if (alpha === 0) {
                input.data[currentIndex] = 255;
                input.data[currentIndex + 1] = 255;
                input.data[currentIndex + 2] = 255;
            }
            input.data[currentIndex + 3] = 255;
            result[i][j] = input.data[i * 4 * input.width + j * 4] / 255;
        }
    }
    return result;
}

function imageIn784Pixels(input) {
    let context = canvas.getContext("2d");
    let imageInGrayscale = imageToGrayscale(input);
    let imageEdges = closerImage(imageInGrayscale, 0.01);
    let massCenter = findCenterMass(imageInGrayscale);
    let canvasCopy = document.createElement("canvas");
    canvasCopy.width = input.width;
    canvasCopy.height = input.height;
    let copyContext = canvasCopy.getContext("2d");
    let scaling = 350 / Math.max(imageEdges.endX + 1 - imageEdges.startX, imageEdges.endY + 1 - imageEdges.startY);
    copyContext.translate(canvas.width / 2, canvas.height / 2);
    copyContext.scale(scaling, scaling);
    copyContext.translate(-canvas.width / 2, -canvas.height / 2);
    copyContext.translate(massCenter.x, massCenter.y);
    copyContext.drawImage(context.canvas, 0, 0);
    let realDigit = copyContext.getImageData(0, 0, canvas.width, canvas.height);
    imageInGrayscale = imageToGrayscale(realDigit);
    canvasCopy.remove();
    return imageInGrayscale;
}

function initializeNNInput(input) {
    let result = new Array(28*28);
    for (let i = 0; i < 28; i++) {
        for (let j = 0; j < 28; j++) {
            let middle = 0;
            for (let a = 0; a < 18; a++) {
                for (let b = 0; b < 18; b++) {
                    middle += input[Math.min(499, i * 18 + a)][Math.min(499, j * 18 + b)];
                }
            }
            middle = (1 - middle / 400);
            result[j * 28 + i] = (middle - 0.5) / 0.5;
        }
    }
    return result;
}

function defineDigit() {
    let ctx = canvas.getContext("2d");
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    imageData = imageIn784Pixels(imageData);
    let nnInput = initializeNNInput(imageData);
    let maxIndex = 0;
    let bestCompatability = 0;
    let nnOutput = nn(nnInput, hiddenLayerWeights, hiddenLayerBias, outputLayerWeights, outputLayerBias);
    for (let i = 0; i < nnOutput.length; ++i) {
        if (nnOutput[i] >= bestCompatability) {
            bestCompatability = nnOutput[i];
            maxIndex = i;
        }
    }
    console.log(maxIndex);
    document.getElementById("answer").textContent = "Это " + maxIndex + "!";
}