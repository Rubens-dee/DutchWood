const emptyCart = document.getElementById('trashcan');
const afrekenen = document.getElementById('afrekenen');
const terug = document.getElementById('terug');
const cartLocal = localStorage.getItem('cartData');
const cartArray = JSON.parse(cartLocal);

// loads data from localstorage which have been placed in the shopping cart
// makes an overview table of the ordered products and gives the sum
function loadTableData() {
    let sum = 0;
    const table = document.getElementById("table");
    if (localStorage.getItem('cartData') !== null) {
        cartArray.forEach(item => {
            const row = table.insertRow(0);
            row.insertCell(0).innerHTML = item.naam;
            row.insertCell(1).innerHTML = item.aantal;
            row.insertCell(2).innerHTML = item.prijs;
            const totaal = row.insertCell(3);
            totaal.innerHTML = item.aantal * item.prijs;
            totaal.align = 'right';
            sum += Number(totaal.innerHTML);
        });
        const tableTotaal = document.getElementById("tableTotaal");
        const row = tableTotaal.insertRow(0);
        row.insertCell(0).innerHTML = 'Totaal';
        row.insertCell(1);
        row.insertCell(2);
        const totaal = row.insertCell(3);
        totaal.id = 'sum';
        totaal.innerHTML = sum;
        totaal.align = 'right';
        const buttonAfrekenen = document.createElement('button');
        buttonAfrekenen.type = 'button';
        buttonAfrekenen.className = 'btn btn-primary container-fluid';
        buttonAfrekenen.innerText = 'Afrekenen';
        afrekenen.appendChild(buttonAfrekenen);
    } else {
        afrekenen.className = 'text-center h4';
        afrekenen.innerText = 'Nog geen producten in je winkelwagen';
    }
}

// writes the order to the local storage
function checkOut() {
    if (localStorage.getItem('checkOutData') !== null) {
        const checkOutLocal = localStorage.getItem('checkOutData');
        const checkOutArray = JSON.parse(checkOutLocal);
        print(checkOutArray);
    } else {
        const checkOutArray = [];
        print(checkOutArray);
    }
    function print(checkOutArray) {
        const totaal = document.getElementById('sum').innerHTML;
        const now = new Date().toLocaleString();
        const object = {
            bedrag: totaal,
            datum_tijd: now,
        };
        checkOutArray.push(object);
        const checkOutLocal = JSON.stringify(checkOutArray, null, 2);
        localStorage.setItem('checkOutData', checkOutLocal);
    }
}
// remove orders from shopping cart
emptyCart.addEventListener('click', () => {
    localStorage.removeItem('cartData');
    document.getElementById('tables').innerHTML = "";
    afrekenen.className = 'text-center h4';
    afrekenen.innerText = 'Nog geen producten in je winkelwagen';
});

afrekenen.addEventListener('click', () => {
    checkOut();
    localStorage.removeItem('cartData');
    document.getElementById('tables').innerHTML = "";
    afrekenen.className = 'text-center h3';
    afrekenen.innerText = 'Dank je wel voor je bestelling!';
    setTimeout(() => {
        afrekenen.innerText = '';
    }, 3000);
});

terug.addEventListener('click', () => {
    window.location.replace("../index.html");
});

loadTableData();