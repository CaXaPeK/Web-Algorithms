function recieveData(csvText, sep = ","){

    let matrix = [];
    let csvLines = csvText.split('\n');
    for(let i = 0; i < csvLines.length - 1; i++){

        let line = csvLines[i];
        let cells = line.split(sep);
        currRow = [];
        for(let j = 0; j < cells.length; j++){
            cells[j] = cells[j].trim();
            if (cells[j].length === 0 || cells[j] === undefined) {
                alert("Загрузите, пожалуйста, файл без пропусков, будьте добры... А то как-то... Что загрузишь то и получишь... Вопросы конечно возникают к Data Scientist'у, вопросы...");
                return;
            }
            currRow.push(cells[j]);
        }
        matrix.push(currRow);   
    }
    return matrix;
}