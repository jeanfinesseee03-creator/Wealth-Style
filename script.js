
let cart = [];

function addToCart(name, image) {

    cart.push({
        name: name,
        price: 35,
        image: image
    });

    updateCart();
}

function updateCart() {

    const cartContainer =
        document.getElementById("cart-items");

    const totalElement =
        document.getElementById("cart-total");

    if (cart.length === 0) {

        cartContainer.innerHTML =
            "<p>Your cart is empty.</p>";

        totalElement.innerHTML =
            "Total: $0";

        return;
    }

    cartContainer.innerHTML = "";

    let total = 0;

    cart.forEach(item => {

        total += item.price;

        cartContainer.innerHTML += `
            <div class="cart-item">

                <img src="${item.image}"
                     alt="${item.name}">

                <div>

                    <h4>${item.name}</h4>

                    <p>$${item.price}</p>

                </div>

            </div>
        `;
    });

    totalElement.innerHTML =
        `Total: $${total}`;
}
