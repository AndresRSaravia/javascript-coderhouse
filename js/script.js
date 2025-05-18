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
							<button class="buyProduct1" id="${product.id}">Agregar (1)</button>
							<button class="buyProduct5" id="${product.id}">Agregar (5)</button>
							<button class="buyProduct10" id="${product.id}">Agregar (10)</button>`
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
function addToCart(className,quantity) {
	let cart = getCart()
	buyButtom = document.querySelectorAll(className)
	buyButtom.forEach(buttom => {
		console.log(222)
		buttom.onclick = (e) => {
			const productId = e.currentTarget.id
			console.log(productId,className,quantity)
			const foundProduct = products.find(product => product.id == productId)
			if (funds>=foundProduct.price*quantity && foundProduct.stock>=quantity){
				cartItem = {
					"id": productId,
					"quantity": quantity
				}
				cart.push(purchase)
				localStorage.setItem("cart", JSON.stringify(cart))
				e.currentTarget.innerHTML = "Agregado"
			} else {
				e.currentTarget.innerHTML = "Error"
			}
		}
	});
}
addToCart(".addProduct1",1)
addToCart(".addProduct5",5)
addToCart(".addProduct10",10)

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
