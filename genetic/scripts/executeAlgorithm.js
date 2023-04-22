let algorithmIsWorking = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function rand_num(start, end)
{
    return start + Math.floor(Math.random() * (end - start));
}

function repeat(gnome, number)
{
    for (let i of gnome) {
        if (i === number)
            return true;
    }
    return false;
}

function createGnome() {
    let gnome = new Array(circlesX.length + 1);
    gnome[0] = 0;
    let i = 1;
    while (true) {
        if (i == gnome.length - 1) {
            gnome[i] = 0;
            break;
        }
        let temp = rand_num(1, circlesX.length);
        if (!repeat(gnome, temp)) {
            gnome[i] = temp;
            ++i;
        }
    }
    return gnome;
}

function mutatedGene(gnome)
{
    while (true) {
        let r = rand_num(1, circlesX.length);
        let r1 = rand_num(1, circlesX.length);
        if (r1 != r) {
            let temp = gnome[r1];
            gnome[r1] = gnome[r];
            gnome[r] = temp;
            break;
        }
    }
    return gnome;
}

function calculateFitness(gnome, map)
{
    let f = 0;
    for (let i = 0; i < gnome.length - 1; i++) {
        f += map[gnome[i]][gnome[i+1]];
    }
    return f;
}

function intToHex(i) {
    let hex = parseInt(i).toString(16);
    return (hex.length < 2) ? "0" + hex : hex;
}

function sortGnomes(population) {
    let result = population;
    for (let i = 0; i < result.length - 1; ++i) {
        for (let j = i+1; j < result.length; ++j) {
            if (result[i].fitness > result[j].fitness) {
                let temp = result[i];
                result[i] = result[j];
                result[j] = temp;
            }
        }
    }
    return result;
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

function initializePopulation(populationSize, map) {
    let population = [];
    for (let i = 0; i < populationSize; ++i) {
        population.push({gnome: createGnome(), fitness: 0});
        population[i].fitness = calculateFitness(population[i].gnome, map);
    }
    return population;
}

function crossing(firstParent, secondParent, map) {
    let child = [];
    let breakPoint = rand_num(1, firstParent.length-1);
    for (let i = 0; i < breakPoint; ++i) {
        child.push(firstParent[i]);
    }
    for (let i = breakPoint; i < firstParent.length; ++i) {
        if (!repeat(child, secondParent[i])) {
            child.push(secondParent[i]);
        }
    }
    for (let i = 1; i < firstParent.length - 1; ++i) {
        if (!repeat(child, i)) {
            child.push(i);
        } 
    }
    child.push(0);
    let result = {gnome: child, fitness: 0};
    result.fitness = calculateFitness(result.gnome, map);
    return result;
}

document.querySelector('#executeAlgorithm').onclick = async function() {
    algorithmIsWorking = true;
    document.getElementById("executeAlgorithm").hidden = "hidden"; 
    changeAccesebility("disable", "some");
    let map = [[]];
    map = initializeMap();
    let gen = 1;
    let population = [];
    population = initializePopulation(populationSize, map); 
    let canvas = document.querySelector('canvas'),
    context = canvas.getContext('2d');
    let canvasData = context.getImageData(0,0,canvas.width,canvas.height);

    while (gen <= generationAmount) {
        //скрещивание
        let firstParentIndex = rand_num(1, population.length);
        let secondParentIndex = rand_num(1, population.length);
        while (firstParentIndex === secondParentIndex) {
            firstParentIndex = rand_num(1, population.length);
            secondParentIndex = rand_num(1, population.length);
        }
        let firstChild = crossing(population[firstParentIndex].gnome, population[secondParentIndex].gnome, map);
        let secondChild = crossing(population[secondParentIndex].gnome, population[firstParentIndex].gnome, map);
        //мутация
        if (rand_num(1, 101) <= mutationChance) {
            firstChild.gnome = mutatedGene(firstChild.gnome);
        }
        if (rand_num(1, 101) <= mutationChance) {
            secondChild.gnome = mutatedGene(secondChild.gnome);
        }
        //добавление новых детей в популяцию и удаление худших индивидов;
        population.push(firstChild);
        population.push(secondChild);
        population = sortGnomes(population);
        population.splice(population.length-2, 2);
        //отрисовка лучшего индивида
        context.canvas.width = context.canvas.width;
        context.putImageData(canvasData, 0, 0);
        drawMap(population[0].gnome, Math.max(gen*Math.floor(510/(generationAmount+1)), 0));
        gen++;
        await sleep(parseInt(50000/animationSpeed));
    } 
    alert("Алгоритм завершил свою работу!");
    changeAccesebility("enable", "all");
    algorithmIsWorking = false;
}
