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

// Inicialización de historial de compra
let purchaseHistory = []
if (localStorage.getItem("purchaseHistory") == null) {
	localStorage.setItem("purchaseHistory", JSON.stringify(purchaseHistory))
} else {
	purchaseHistory = JSON.parse(localStorage.getItem("purchaseHistory"))
}

let purchaseContainer = document.getElementById("purchase-list")
function renderLogs(purchaseHistory){
	products.forEach(product => {
		const filteredProducts = purchaseHistory.filter((p) => p.product.id == product.id)
		const quantitySum = filteredProducts.reduce((accumulator, currentValue) => accumulator + currentValue.quantity,0)
		const totalSum = filteredProducts.reduce((accumulator, currentValue) => accumulator + currentValue.quantity*currentValue.product.price,0)
		const allDates = filteredProducts.map((p) => Date.parse(p.date))
		if (quantitySum!=0){
			const purchaseItem = document.createElement("div")
			purchaseItem.innerHTML = `<h3>Producto: ${product.id}</h3>
								<p>Información del producto: ${JSON.stringify(product)}</p>
								<p>Cantidad comprada: ${quantitySum}</p>
								<p>Dinero invertido: ${totalSum}</p>
								<p>Última compra: ${new Date(Math.max(...allDates))}</p>`
			purchaseContainer.appendChild(purchaseItem)
		}
	})
}
renderLogs(purchaseHistory)

purchaseHistory.forEach(purchase => {
	console.log(purchase.product.id)
})


// Función de agregar una compra
async function addToPurchaseHistory(className,quantity) {
	let products = await getProducts()
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
