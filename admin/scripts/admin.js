import readJSON from "../../scripts/import.js";

const radio = document.getElementById('radio');
const rbody = document.getElementById('rbody');
const tbody = document.getElementById('tbody');
const sbody = document.getElementById('sbody');
const preview = document.getElementById('preview');

// checks which button is selected and opens the correct page. Default is the Orders page
function check() {
    const status = document.getElementById('orders').checked;
    rbody.innerHTML = '';
    tbody.innerHTML = '';
    sbody.innerHTML = '';
    preview.src = '';
    if (status == true) {
        loadTableOrdersData();
    } else {
        const template = document.getElementById('resetAdd');
        const clone = template.content.cloneNode(true);
        rbody.appendChild(clone);
        loadTableProductsData();
    }
}

// views the orders in a table made by the users
async function loadTableOrdersData() {
    const checkOutLocal = localStorage.getItem('checkOutData');
    const checkOutArray = JSON.parse(checkOutLocal);
    tbody.innerHTML = '';
    if (checkOutArray !== null) {
        let row = tbody.insertRow(0);
        row.className = 'h6';
        row.insertCell(0).innerHTML = "ID";
        row.insertCell(1).innerHTML = "bedrag";
        row.insertCell(2).innerHTML = "datum/tijd";
        checkOutArray.forEach((item, i) => {
            row = tbody.insertRow(i + 1);
            row.insertCell(0).innerHTML = i;
            row.insertCell(1).innerHTML = item.bedrag;
            row.insertCell(2).innerHTML = item.datum_tijd;
        });
    } else {
        tbody.innerHTML = 'Geen orders aanwezig';
    }
}

// views a table of the products which can be selected by the users
// a product can be added, changed or deleted
function loadTableProductsData() {
    let productLocal = localStorage.getItem('productData');
    const productArray = JSON.parse(productLocal);
    tbody.innerHTML = '';
    if (productArray !== null) {
        let row = tbody.insertRow(0);
        row.className = 'h6';
        row.insertCell(0).innerHTML = "ID";
        row.insertCell(1).innerHTML = "naam";
        row.insertCell(2).innerHTML = "bedrag";
        row.insertCell(3).innerHTML = "afbeelding";
        row.insertCell(4);
        row.insertCell(5);
        productArray.forEach((item, i) => {
            row = tbody.insertRow(i + 1);
            row.insertCell(0).innerHTML = i;
            row.insertCell(1).innerHTML = item.naam;
            row.insertCell(2).innerHTML = item.prijs;
            row.insertCell(3).innerHTML = item.img;
            row.insertCell(4).innerHTML = `<div type="button" id="edit${i}" class="text-primary">Edit</div>`;
            const remove = row.insertCell(5);
            remove.innerHTML = `<div type="button" id="remove${i}" class="text-danger">Remove</div>`;
            const listnerRemove = document.getElementById('remove' + [i]);
            listnerRemove.addEventListener('click', () => {
                productArray.splice(i, 1);
                productLocal = JSON.stringify(productArray, null, 2);
                localStorage.setItem('productData', productLocal);
                loadTableProductsData(productArray);
            });
            const listnerEdit = document.getElementById('edit' + [i]);
            listnerEdit.addEventListener('click', () => {
                product(item, productArray);
            });
        });
    } else {
        tbody.innerHTML = 'Geen producten aanwezig';
    }
    const reset = document.getElementById('reset');
    reset.addEventListener('click', async () => {
        localStorage.removeItem('productData');
        const path = '..';
        await readJSON(path);
        loadTableProductsData();
    });
    const newProductButton = document.getElementById('newProduct');
    newProductButton.addEventListener('click', () => {
        const newProduct = {
            naam: '',
            soort: '',
            prijs: '',
            volume: '',
            img: '',
        };
        productArray.push(newProduct);
        product(newProduct, productArray);
    });
}

// views the selected product in a form, where it can be changed or added.
function product(item, productArray) {
    rbody.innerHTML = '';
    tbody.innerHTML = '';
    sbody.innerHTML = '';
    const template = document.getElementById('editProduct');
    const clone = template.content.cloneNode(true);
    clone.getElementById('naam').value = item.naam;
    clone.getElementById('soort').value = item.soort;
    clone.getElementById('prijs').value = item.prijs;
    clone.getElementById('volume').value = item.volume;
    clone.getElementById('img').value = item.img;
    tbody.appendChild(clone);
    const button = document.getElementById('button');
    button.addEventListener('click', () => {
        preview.src = '../img/' + item.img;
        preview.style = '';
        preview.height = '200';
    });
    const templateSave = document.getElementById('save');
    const cloneSave = templateSave.content.cloneNode(true);
    sbody.appendChild(cloneSave);
    const buttonSave = document.getElementById('buttonSave');
    buttonSave.addEventListener('click', () => {
        item.naam = document.getElementById('naam').value;
        item.soort = document.getElementById('soort').value;
        item.prijs = document.getElementById('prijs').value;
        item.volume = document.getElementById('volume').value;
        item.img = document.getElementById('img').value;
        const string = JSON.stringify(productArray, null, 2);
        localStorage.setItem('productData', string);
        alert('wijziging opgeslagen!');
    });
    const terug = document.getElementById('terug');
    terug.addEventListener('click', () => {
        check();
    });
}

radio.addEventListener('change', () => {
    check();
});

check();