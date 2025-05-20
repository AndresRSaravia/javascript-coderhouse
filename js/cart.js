// GET de productos
async function getProducts() {
	try {
		let products = []
		if (localStorage.getItem("products") == null) {
			const productsRes = await fetch("../db/products.json")
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

// Renderizado de carrito
async function renderCart(){
	let cartContainer = document.getElementById("cart-list")
	let cart = await getCart()
	const products = await getProducts()
	Object.keys(cart).forEach(productId => {
		const foundProduct = products.find(product => product.id == productId)
		if (foundProduct){
			const cartItem = document.createElement("div")
			cartItem.innerHTML = `<div class="card">
									<div class="container">
										<h3><b>${foundProduct.title} (Id: ${productId})</b></h3>
										<p>Descripción: ${foundProduct.description}</p>
										<p>Precio: $${foundProduct.price}</p>
										<p class="quantity${productId}">Cantidad: ${cart[productId]} de ${foundProduct.stock} disponibles</p>
										<p>Costo: ${cart[productId]*foundProduct.price}</p>
										<button class="add1Product" id="${productId}">(+)</button>
										<button class="sub1Product" id="${productId}">(-)</button>
										<button class="removeProduct" id="${productId}">Eliminar</button>
									</div>
								</div>`
			cartContainer.appendChild(cartItem)
		} else {
			cartItem.innerHTML = `<div class="card">
									<div class="container">
										<h3><b>Id no encontrada: ${productId}</b></h3>
									</div>
								</div>`

			cartContainer.appendChild(cartItem)
		}
	})
}
renderCart()

// Función de modificar el carrito
async function modifyCart(className,quantity) {
	const products = await getProducts()
	let addButtom = ''
	setTimeout(() => {
		addButtom = document.querySelectorAll(className)
		addButtom.forEach(buttom => {
			buttom.onclick = async (e) => {
				let cart = await getCart()
				const productId = e.currentTarget.id
				const foundProduct = products.find(product => product.id == productId)
				if (foundProduct) {
					let quantityFront = document.querySelectorAll(`.quantity${productId}`)
					if ((!(quantity<0) || cart[productId]>0) && foundProduct.stock>=(cart[productId]+quantity)) {
						cart[productId] += quantity
						quantityFront.innerHTML = cart[productId]
					} else {
						e.currentTarget.innerHTML = "Error"
					}
					if (cart[productId] == 0) {
						delete cart[productId]
					}
					localStorage.setItem("cart", JSON.stringify(cart))
				} else {
					e.currentTarget.innerHTML = "Error"
				}
				window.location.reload() // los innerHTML no se están actualizando :/
			}
		})
	}, "500")

}
modifyCart(".add1Product",+1)
modifyCart(".sub1Product",-1)

// Función de remover del carrito
async function removeFromCart(className) {
	let addButtom = ''
	setTimeout(() => {
		addButtom = document.querySelectorAll(className)
		addButtom.forEach(buttom => {
			buttom.onclick = async (e) => {
				let cart = await getCart()
				const productId = e.currentTarget.id
				delete cart[productId]
				localStorage.setItem("cart", JSON.stringify(cart))
				window.location.reload() // los innerHTML no se están actualizando :/
			}
		})
	}, "500")

}
removeFromCart(".removeProduct")

// Función de vaciar el carrito
async function emptyCart() {
	let emptyButtom = document.getElementById("empty-cart")
	emptyButtom.onclick = async (e) => {
		const cart = {}
		localStorage.setItem("cart", JSON.stringify(cart))
		Swal.fire({
			title: "¡Carrito vaciado!",
			text: "Se han quitado todos los productos",
			icon: "success"
		})
		setTimeout(() => {
			window.location.reload() // los innerHTML no se están actualizando :/
		}, 1000)
	}
}
emptyCart()

// GET de tickets
function getTickets() {
	let tickets = []
	if (localStorage.getItem("tickets") == null) {
		localStorage.setItem("tickets", JSON.stringify(tickets))
	} else {
		tickets = JSON.parse(localStorage.getItem("tickets"))
	}
	return tickets
}

// Agregado y generación de ticket
async function buyCart() {
	buyButtom = document.getElementById("buy-cart")
	buyButtom.onclick = async (e) => {
		const { value: formValues } = await Swal.fire({
			title: "Para completar la compra, ingrese su email, contraseña y datos bancarios",
			html: `<input id="swal-input1" class="swal2-input" type="email" placeholder="Email">
					<input id="swal-input2" class="swal2-input" type="password" placeholder="Contraseña">
					<input id="swal-input3" class="swal2-input" placeholder="Datos bancarios">`,
			focusConfirm: false,
			preConfirm: () => {
				return [
				document.getElementById("swal-input1").value,
				document.getElementById("swal-input2").value,
				document.getElementById("swal-input3").value
				]
			}
		})
		if (formValues) {
			Swal.fire(JSON.stringify(formValues))
		}
		let cart = await getCart()
		let products = await getProducts()
		let funds = getFunds()
		let ticket = {
			"date": Date(),
			"boughtProducts": {}
		}
		productTitles = []
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
				productTitles.push(foundProduct.title)
			}
		})
		if (JSON.stringify(ticket.boughtProducts) != "{}") {
			let tickets = getTickets()
			tickets.push(ticket)
			localStorage.setItem("tickets", JSON.stringify(tickets))
			Swal.fire({
				title: "¡Compra realizada!",
				text: `Se han comprado los productos ${productTitles.join(", ")}`,
				icon: "success"
			})
		} else {
			Swal.fire({
				title: "¡Compra no realizada!",
				text: "El carrito está vacío",
				icon: "error"
			})
		}
		setTimeout(() => {
			window.location.reload()
		}, 1000);
	}
}
buyCart()


async function fooo2() {

}
//fooo2()