const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/resources/exercises.json');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    let jsonData = JSON.parse(data);

    // Sort jsonData.results alphabetically by the 'name' field
    jsonData.results.sort((a, b) => {
        const nameA = a.name.toUpperCase(); // to ensure case-insensitive comparison
        const nameB = b.name.toUpperCase(); // to ensure case-insensitive comparison

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    });

    // Modify the IDs to go from 1 to the number of elements in the array
    jsonData.results.forEach((item, index) => {
        item.id = index + 1;
    });

    // Write the modified data back to the input file
    fs.writeFile('resources/exercises.json', JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
            console.error('Error writing the file:', err);
            return;
        }
        console.log('Data has been modified in input.json');
    });
});
