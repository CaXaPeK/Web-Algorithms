function recieveData(csvText, sep = ","){

    let matrix = [];
    let csvLines = csvText.split('\n');
    for(let i = 0; i < csvLines.length - 1; i++){

        let line = csvLines[i];
        let cells = line.split(sep);
        currRow = [];
        for(let j = 0; j < cells.length; j++){
            cells[j] = cells[j].trim();
            currRow.push(cells[j]);
        }
        matrix.push(currRow);   
    }
    //console.log(matrix);
    return matrix;
}