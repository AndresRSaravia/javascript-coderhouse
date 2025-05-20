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
		card.innerHTML = `<div class="card">
									<div class="container">
										<h3><b>${product.title} (Id: ${product.id})</b></h3>
										<p>Descripción: ${product.description}</p>
										<p>Precio: $${product.price}</p>
										<p class="stockProduct" id="${product.id}">Stock: ${product.stock} unidades</p>
										<button class="addProduct1" id="${product.id}">Agregar (1)</button>
										<button class="addProduct5" id="${product.id}">Agregar (5)</button>
										<button class="addProduct10" id="${product.id}">Agregar (10)</button>
									</div>
								</div>`
		productContainer.appendChild(card)
	})
}
renderProducts()

// GET de fondos
function getFunds() {
	let funds = 0
	if (localStorage.getItem("funds") == null) {
		localStorage.setItem("funds", funds)
	} else {
		funds = Number(localStorage.getItem("funds"))
	}
	return funds
}

// Renderizado de fondos
async function renderFunds(id,quantity) {
	funds = getFunds()
	let fundsFront = document.getElementById("funds-amount")
	fundsFront.innerHTML = funds
	let addFundsButton = document.getElementById(id)
	addFundsButton.onclick = () => {
		funds = getFunds()
		funds += quantity
		localStorage.setItem("funds", funds)
		fundsFront.innerHTML = funds
		Swal.fire({
			title: "Transacción completada",
			text: `Has agregado $${quantity} a tu cuenta. Total: $${funds}`,
			icon: "success"
		})
	}
}
renderFunds("add-funds10",10)
renderFunds("add-funds100",100)

// GET de carrito
async function getCart() {
	try {
		let cart = {}
		if (localStorage.getItem("cart") == null) {
			localStorage.setItem("cart", JSON.stringify(cart))
		} else {
			cart = JSON.parse(localStorage.getItem("cart"))
		}
		return cart
	} catch (error) {
		console.error(error)
	}
}

// Función de agregar al carrito
async function addToCart(className,quantity) {
	const products = await getProducts()
	let addButtom = document.querySelectorAll(className)
	console.log(document.querySelectorAll(className))
	addButtom.forEach(buttom => {
		buttom.onclick = async (e) => {
			let cart = await getCart()
			const productId = e.currentTarget.id
			const foundProduct = products.find(product => product.id == productId)
			if (foundProduct && cart[productId] && foundProduct.stock>=(quantity+cart[productId])) {
				cart[productId] += quantity
				localStorage.setItem("cart", JSON.stringify(cart))
				Swal.fire({
					title: `¡${foundProduct.title} agregado!`,
					text: `Se han agregado ${quantity} unidades`,
					icon: "success"
				})
			} else if (foundProduct && !cart[productId] && foundProduct.stock>=quantity) {
				cart[productId] = quantity
				localStorage.setItem("cart", JSON.stringify(cart))
				Swal.fire({
					title: `¡${foundProduct.title} agregado!`,
					text: `Se han agregado ${quantity} unidades`,
					icon: "success"
				})
			} else {
				Swal.fire({
					title: "¡No se pudo agregar el producto!",
					text: "El producto no existe o no hay suficientes unidades",
					icon: "error"
				})
			}
		}
	})
}
addToCart(".addProduct1",1)
addToCart(".addProduct5",5)
addToCart(".addProduct10",10)
