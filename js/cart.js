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
	let fundsFront = document.getElementById("funds-amount");
	fundsFront.innerHTML = funds;
	let addFundsButton = document.getElementById(id)
	addFundsButton.onclick = () => {
		funds = getFunds()
		funds += quantity;
		localStorage.setItem("funds", funds)
		fundsFront.innerHTML = funds;
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

async function renderCart(){
	let cartContainer = document.getElementById("cart-list")
	let cart = await getCart()
	const products = await getProducts()
	Object.keys(cart).forEach(productId => {
		const foundProduct = products.find(product => product.id == productId)
		if (foundProduct){
			const cartItem = document.createElement("div")
			cartItem.innerHTML = `<h3>Producto: ${foundProduct.title} (Id: ${foundProduct.id})</h3>
								<p>Descripción: ${foundProduct.description}</p>
								<p>Precio: $${foundProduct.price}</p>
								<p>Cantidad a comprar: ${cart[productId]} de ${foundProduct.stock} unidades disponibles</p>
								<p>Dinero invertido: ${cart[productId]*foundProduct.price}</p>`
			cartContainer.appendChild(cartItem)
		} else {
			cartItem.innerHTML = `<h3>Id no encontrada: ${productId}</h3>`
			cartContainer.appendChild(cartItem)
		}
	})
}
renderCart()

// GET de tickets
function getTickets() {
	let tickets = []
	if (localStorage.getItem("tickets") == null) {
		localStorage.setItem("tickets", tickets)
	} else {
		tickets = JSON.parse(localStorage.getItem("tickets"))
	}
	return tickets
}

// Agregado y generación de ticket
async function buyCart() {
	buyButtom = document.getElementById("buy-cart")
	buyButtom.onclick = async (e) => {
		let cart = await getCart()
		let products = await getProducts()
		let funds = getFunds()
		let ticket = {
			"date": Date(),
			"boughtProducts": {}
		}
		Object.keys(cart).forEach(productId => {
			const foundProduct = products.find(product => product.id == productId)
			if (funds>=foundProduct.price*cart[productId] && foundProduct.stock>=cart[productId]){
				// actualización de fondos
				funds -= foundProduct.price*cart[productId]
				localStorage.setItem("funds", funds)
				// actualización de stock
				foundProduct.stock -= cart[productId]
				const productIndex = products.indexOf(foundProduct)
				products[productIndex] = foundProduct
				localStorage.setItem("products", JSON.stringify(products))
				// actualización de ticket
				ticket.boughtProducts[productId] = cart[productId]
				// actualización de carrito
				delete cart[productId]
				localStorage.setItem("cart", JSON.stringify(cart))
			}
		})
		if (JSON.stringify(ticket.boughtProducts) != "{}") {
			let tickets = getTickets()
			tickets.push(ticket)
			localStorage.setItem("tickets", JSON.stringify(tickets))
			e.currentTarget.innerHTML = "Comprado"
		}
	};
}
buyCart()
