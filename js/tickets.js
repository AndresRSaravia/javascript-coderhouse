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

async function renderTickets(){
	let ticketContainer = document.getElementById("ticket-list")
	let tickets = getTickets()
	let products = await getProducts()
	tickets.forEach(ticket => {
		const ticketItem = document.createElement("div")
		ticketItem.innerHTML = `<h3>Fecha de compra: ${ticket.date}</h3>`
		Object.keys(ticket.boughtProducts).forEach(productId => {
			const foundProduct = products.find(product => product.id == productId)
			if (foundProduct){
				const productItem = document.createElement("div")
				productItem.innerHTML += `<h3>Producto: ${foundProduct.title} (Id: ${foundProduct.id})</h3>
									<p>Descripción: ${foundProduct.description}</p>
									<p>Precio: $${foundProduct.price}</p>
									<p>Cantidad a comprar: ${ticket.boughtProducts[productId]}</p>
									<p>Dinero invertido: ${ticket.boughtProducts[productId]*foundProduct.price}</p>`
				ticketItem.appendChild(productItem)
			} else {
				productItem.innerHTML += `<h3>Id no encontrada: ${productId}</h3>`
				ticketItem.appendChild(productItem)
			}
		})
		ticketContainer.appendChild(ticketItem)
	})
}
renderTickets()
