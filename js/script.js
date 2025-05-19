// GET de productos
async function getProducts() {
	try {
		let products = []
		if (localStorage.getItem("products") == null) {
			const productsRes = await fetch("./db/products.json")
			products = await productsRes.json()
			localStorage.setItem("products", JSON.stringify(products))
		} else {
			products = JSON.parse(localStorage.getItem("products"))
		}
		return products	
	} catch (error) {
		console.error(error)
	}
}

// Renderizado de productos
async function renderProducts() {
	let productContainer = document.getElementById("product-list")
	let products = await getProducts()
	products.forEach(product => {
		const card = document.createElement("div")
		card.innerHTML = `<h3>${product.title}</h3>
							<p>Descripción: ${product.description}</p>
							<p>Precio: $${product.price}</p>
							<p class="stockProduct" id="${product.id}">Stock: ${product.stock} unidades</p>
							<button class="addProduct1" id="${product.id}">Agregar (1)</button>
							<button class="addProduct5" id="${product.id}">Agregar (5)</button>
							<button class="addProduct10" id="${product.id}">Agregar (10)</button>`
		productContainer.appendChild(card)
	});
}
renderProducts()

// GET de fondos
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

// GET de carrito
async function getCart() {
	try {
		let cart = []
		if (localStorage.getItem("cart") == null) {
			localStorage.setItem("cart", JSON.stringify(cart))
		} else {
			cart = JSON.parse(localStorage.getItem("cart"))
		}
		//console.log(cart)
		return cart	
	} catch (error) {
		console.error(error)
	}
}

// Función de agregar al carrito
async function addToCart(className,quantity) {
	let cart = await getCart()
	let products = await getProducts()
	buyButtom = document.querySelectorAll(className)
	buyButtom.forEach(buttom => {
		buttom.onclick = (e) => {
			const productId = e.currentTarget.id
			console.log(productId,className,quantity)
			const foundProduct = products.find(product => product.id == productId)
			cartItem = {
				"id": productId,
				"quantity": quantity
			}
			cart.push(cartItem)
			localStorage.setItem("cart", JSON.stringify(cart))
			e.currentTarget.innerHTML = "Agregado"
		}
	});
}
addToCart(".addProduct1",1)
addToCart(".addProduct5",5)
addToCart(".addProduct10",10)
