function antAlgorithm(map) {
    
    let vertCount = map.length;
    let pheromones = new Array(vertCount);
    let visited = new Array(vertCount);

    for (let i = 0; i < vertCount; i++) {
        visited[i] = 0;
        pheromones[i] = new Array(vertCount);
        for (let j = 0; j < vertCount; j++) {
            if (i === j) {
                pheromones[i][j] = 0;
            } else {
                pheromones[i][j] = 10;
            } 
        }
    }

    let currentBestPath = [];
    let currentBestPathLength = 9999999;

    let alpha = 1;
    let beta = 2.5;
    let sustainability = 0.5;
    let antsCount = 30;


    for (let i = 0; i < antsCount; i++) {
        visited.fill(0);
        let pathLength = 0;
        let path = [];
        let result = antGo(path, pathLength);
        pathLength = result[1];
        path = result[0];
        updatePheromones(path, pathLength);
    }

    findBestPath();
    return [currentBestPath, currentBestPathLength]


    function antGo(path, pathLength){
        let current = 0; 
        for (let i = 0; i < vertCount; i++) {
            visited[current] = 1;
            path.push(current);
            current = decideNextVertex(current);
        }
        path.push(0);
        for (let j = 1; j < path.length;j++) {
            pathLength += map[path[j]][path[j-1]];
        }

        return [path, pathLength];
    }  

    function decideNextVertex(vertex) {
        let sumProb = 0;
        let adjProbs = [];
        let adjNum = [];
        let decision = Math.random();
     
        for (let i = 0; i < vertCount; ++i) {
            if (pheromones[vertex][i] !== 0 && visited[i] === 0 && i !== vertex) {
                adjProbs.push(Math.pow(pheromones[vertex][i], alpha) * Math.pow(1 / map[vertex][i], beta));
                adjNum.push(i);
            }
        }
    
        for (let i = 0; i < adjProbs.length; ++ i) {
            sumProb += adjProbs[i];
        }

        calculateProbabilities(sumProb, adjProbs);

        for (let i = 1; i < adjProbs.length; ++i) {
            
            if (decision > adjProbs[i] && decision <= adjProbs[i-1]) {
                return adjNum[i - 1];
            }
        }
        return adjNum[adjNum.length - 1];
    }
    
    function calculateProbabilities(sumProb, adj) {
        let probs0To1 = new Array(adj.length);

        probs0To1[0] = 1;
        for (let i = 1; i < adj.length; i++ ) {
            probs0To1[i] = probs0To1[i-1] - adj[i - 1] / sumProb;
        }

        for (let i = 0; i < adj.length; i++) {
            adj[i] = probs0To1[i];
        }
    }



    function updatePheromones(path, pathLength) {
         fadePheromones();
         applyPheromones(path, pathLength);
    }

    function fadePheromones() {
        for (let i = 0; i < pheromones.length; i++) {            
            for (let j = 0; j < pheromones[i].length; j++) {      
                if (i != j) {
                    pheromones[i][j] = pheromones[i][j] * sustainability;  
                }
            }
        }
    }

    function findBestPath() {
        visited.fill(0);
        let current = 0;
        let next = -1;

        currentBestPath.push(current);
        visited[current] = 1;

        for (let k = 0; k < vertCount; ++k) {
            let maxPher = 0;
            for (let m = 0; m < vertCount; ++ m) {
                if (pheromones[current][m] > maxPher && visited[m] === 0) {
                    next = m;
                    maxPher = pheromones[current][m];
                }
            }
            if (next !== -1) {
                visited[next] = 1;
                current = next;
                currentBestPath.push(next);
                next = -1;
            }

        }
        

        currentBestPath.push(0);

        currentBestPathLength = 0;

        for (let i = 1; i < currentBestPath.length; ++i) {
            currentBestPathLength += map[currentBestPath[i]][currentBestPath[i - 1]];
        }

    }

    function applyPheromones(path, pathLength) {
        for (let i = 1; i < path.length; ++i) {
            pheromones[path[i]][path[i-1]] += 1 / pathLength;
            pheromones[path[i - 1]][path[i]] += 1 / pathLength;
        }
    }
    
}

