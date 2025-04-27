// Inicialización de productos
let products = [
	{
		"id": 1,
		"title": "Producto 1",
		"description": "Descripción 1",
		"price": 20,
		"stock": 5,
	},
	{
		"id": 2,
		"title": "Producto 2",
		"description": "Descripción 2",
		"price": 1,
		"stock": 1000,
	},
	{
		"id": 3,
		"title": "Producto 3",
		"description": "Descripción 3",
		"price": 5,
		"stock": 4,
	}
]
if (localStorage.getItem("products") == null) {
	localStorage.setItem("products", JSON.stringify(products))
} else {
	products = JSON.parse(localStorage.getItem("products"))
}

// Renderizado de productos
let productContainer = document.getElementById("product-list")
function renderProducts(products) {
	products.forEach(product => {
		const card = document.createElement("div")
		card.innerHTML = `<h3>${product.title}</h3>
							<p>Descripción: ${product.description}</p>
							<p>Precio: $${product.price}</p>
							<p>Stock: ${product.stock} unidades</p>
							<button class="buyProduct1" id="${product.id}">Comprar (1)</button>
							<button class="buyProduct5" id="${product.id}">Comprar (5)</button>
							<button class="buyProduct10" id="${product.id}">Comprar (10)</button>`
		productContainer.appendChild(card)
	});
}
renderProducts(products)

// Inicialización de fondos
let fundsFront = document.getElementById("funds-amount");
let funds = 0
if (localStorage.getItem("funds") == null) {
	localStorage.setItem("funds", funds)
} else {
	funds = Number(localStorage.getItem("funds"))
	fundsFront.innerHTML = funds;
}

// Renderizado de fondos
let addFunds10Button = document.getElementById("add-funds10")
let addFunds100Button = document.getElementById("add-funds100")
addFunds10Button.onclick = () => {
	funds = Number(localStorage.getItem("funds"))
	funds+=10;
	localStorage.setItem("funds", funds)
	fundsFront.innerHTML = funds;
}
addFunds100Button.onclick = () => {
	funds = Number(localStorage.getItem("funds"))
	funds+=100;
	localStorage.setItem("funds", funds)
	fundsFront.innerHTML = funds;
}

let historyButton = document.getElementById("history")

// Inicialización de historial de compra
let purchaseHistory = []
if (localStorage.getItem("purchaseHistory") == null) {
	localStorage.setItem("purchaseHistory", JSON.stringify(purchaseHistory))
} else {
	purchaseHistory = JSON.parse(localStorage.getItem("purchaseHistory"))
}

// Función de agregar una compra
function addToPurchaseHistory(className,quantity) {
	buyButtom = document.querySelectorAll(className)
	buyButtom.forEach(buttom => {
		buttom.onclick = (e) => {
			const productId = e.currentTarget.id
			console.log(productId,className,quantity)
			const foundProduct = products.find(product => product.id == productId)
			if (funds>=foundProduct.price*quantity && foundProduct.stock>=quantity){
				funds -= foundProduct.price*quantity
				localStorage.setItem("funds", funds)
				fundsFront.innerHTML = funds
				let productIndex = products.indexOf(foundProduct)
				foundProduct.stock -= quantity
				products[productIndex] = foundProduct
				localStorage.setItem("products", JSON.stringify(products))
				products.splice()
				const purchase = {
					"date": Date(),
					"quantity": quantity,
					"product": foundProduct
				}
				purchaseHistory.push(purchase)
				localStorage.setItem("purchaseHistory", JSON.stringify(purchaseHistory))
				e.currentTarget.innerHTML = "Comprado"
			} else {
				e.currentTarget.innerHTML = "Error"
			}
		}
	});
}
addToPurchaseHistory(".buyProduct1",1)
addToPurchaseHistory(".buyProduct5",5)
addToPurchaseHistory(".buyProduct10",10)
