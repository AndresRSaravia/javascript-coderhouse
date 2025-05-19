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

