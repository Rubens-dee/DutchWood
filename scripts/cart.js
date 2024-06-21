// add the selected items to the order and saves it in the local storage
class Cart {
    constructor(_naam, _prijs, _aantal) {
        this.naam = _naam;
        this.prijs = _prijs;
        this.aantal = _aantal;
    }
    check() {
        if (localStorage.getItem('cartData') !== null) {
            const cartLocal = localStorage.getItem('cartData');
            const cartArray = JSON.parse(cartLocal);
            this.print(cartArray);
        } else {
            const cartArray = [];
            this.print(cartArray);
        }
    }

    print(cartArray) {
        const object = {
            naam: this.naam,
            prijs: this.prijs,
            aantal: this.aantal,
        };
        cartArray.push(object);
        const cartLocal = JSON.stringify(cartArray, null, 2);
        localStorage.setItem('cartData', cartLocal);
    }
}

export default Cart;