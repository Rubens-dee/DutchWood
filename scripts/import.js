// imports the dedault dat from the JSON file
async function readJSON(path) {
    const stookhoutData = await fetch(`${path}/JSON/stookhout.json`);
    const objectArray = await stookhoutData.json();
    const string = JSON.stringify(objectArray, null, 2);
    localStorage.setItem('productData', string);
    return objectArray;
}

export default readJSON;