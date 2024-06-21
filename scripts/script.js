import Cart from "./cart.js";
import readJSON from "./import.js";

const pbody = document.getElementById('pbody');
const fbody = document.getElementById('fbody');

// read data from JSON file
async function read() {
    const path = ('.');
    const objectArray = await readJSON(path);
    filterProducts(objectArray);
}

// creates a filter in the left bar by the products which are available in the local storage
async function filterProducts(objectArray) {
    const productLocal = localStorage.getItem('productData');
    const productArray = await JSON.parse(productLocal);
    let filterArray = [];
    productArray.forEach(object => {
        if (!filterArray.includes(object.soort)) {
            filterArray.push(object.soort);
        }
    });
    let iArray = [];
    filterArray.forEach((f, i) => {
        const template = document.getElementById('filter');
        const clone = template.content.cloneNode(true);
        clone.getElementById('checkbox').setAttribute('id', 'checkbox-' + [f]);
        clone.getElementById('soort').innerText = f;
        clone.getElementById('soort').setAttribute('id', f);
        fbody.appendChild(clone);
        iArray.push(i);
    });
    checkFilter(objectArray, filterArray);
    change(objectArray, filterArray, iArray);
}

// checks which product(s) from the filter are checked and send the product array to the function addProduct
async function checkFilter(objectArray, soortArray) {
    pbody.innerHTML = '';
    let filteredObjecArray = [];
    objectArray.forEach(object => {
        soortArray.forEach(soort => {
            if (soort == object.soort) {
                filteredObjecArray.push(object);
            }
        });
    });
    addProduct(filteredObjecArray);
}

// views the product(s) from the filter on the website
function addProduct(objectArray) {
    objectArray.forEach((product, i) => {
        const template = document.getElementById('product');
        const clone = template.content.cloneNode(true);
        clone.getElementById('img').src = './img/' + product.img;
        clone.getElementById('img').alert = product.naam;
        clone.getElementById('naam').innerText = product.naam;
        clone.getElementById('prijs').innerText = 'ƒ' + product.prijs + ',-';
        clone.getElementById('volume').innerText = product.volume + ' m3';
        clone.getElementById('naam').setAttribute('id', 'naam' + [i]);
        clone.getElementById('plus').setAttribute('id', 'plus' + [i]);
        clone.getElementById('minus').setAttribute('id', 'minus' + [i]);
        clone.getElementById('amount').setAttribute('id', 'amount' + [i]);
        clone.getElementById('cart').setAttribute('id', 'cart' + [i]);
        clone.getElementById('added').setAttribute('id', 'added' + [i]);
        pbody.appendChild(clone);
        const plus = document.getElementById('plus' + i);
        const minus = document.getElementById('minus' + i);
        let cart = document.getElementById('cart' + i);
        plus.addEventListener('click', () => {
            let amount = Number(document.getElementById('amount' + i).value);
            amount += 1;
            document.getElementById('amount' + i).value = amount;
        });
        minus.addEventListener('click', () => {
            let amount = Number(document.getElementById('amount' + i).value);
            if (amount !== 0) {
                amount -= 1;
                document.getElementById('amount' + i).value = amount;
            }
        });
        function add() {
            document.getElementById('added' + [i]).className = 'text-success invisible';
        }
        // send the amount of product(s) to the cart
        cart.addEventListener('click', () => {
            const amount = document.getElementById('amount' + i).value;
            if (amount !== '' && amount > 0) {
                cart = new Cart(product.naam, product.prijs, amount);
                document.getElementById('added' + [i]).className = 'text-success visible';
                setTimeout(add, 2000);
                cart.check();
            } else {
                alert(`${amount} is geen geldige waarde`);
            }
            document.getElementById('amount' + i).value = 0;
        });
    });
    checkOut();
}

// makes an new list of product(s) after a change in the filter checkboxes
async function change(objectArray, filterArray, iArray) {
    document.getElementById('alles').addEventListener('change', () => {
        const checkboxes = document.querySelectorAll('input[class="soort form-check-input"]');
        filterArray = [];
        if (document.getElementById('alles').checked == true) {
            checkboxes.forEach(checkbox => {
                checkbox.checked = true;
                const f = checkbox.id.slice(9);
                filterArray.push(f);
            });
        } else {
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
        }
        checkFilter(objectArray, filterArray);
    });
    filterArray.forEach(filter => {
        document.getElementById('checkbox-' + filter).addEventListener('change', () => {
            if (document.getElementById('checkbox-' + filter).checked == true) {
                filterArray.push(filter);
                filterArray = filterArray.sort();
                let fArray = [];
                filterArray.forEach(f => {
                    fArray.push(document.getElementById('checkbox-' + filter).checked);
                    if (fArray.length == iArray.length) {
                        document.getElementById('alles').checked = true;
                    }
                });
            } else {
                filterArray = filterArray.filter(f => f !== filter).sort();
                document.getElementById('alles').checked = false;
            }
            checkFilter(objectArray, filterArray);
        });
    });
}

function checkOut() {
    document.getElementById('check-out').addEventListener('click', () => {
        window.location.replace("./pages/order.html");
        const cart = new Cart();
        cart.loadTableData();
    });
}

// Checks if there is data in local storage
function check() {
    if (localStorage.getItem('productData') == null) {
        read();
    } else {
        const productLocal = localStorage.getItem('productData');
        const productArray = JSON.parse(productLocal);
        filterProducts(productArray);
    }
}

check();