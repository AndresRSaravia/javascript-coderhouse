let funds = 0;
let products = [
	{
		"title": "Producto 1",
		"description": "Descripción 1",
		"price": 20,
		"stock": 5,
	},
	{
		"title": "Producto 2",
		"description": "Descripción 2",
		"price": 1,
		"stock": 1000,
	}
]

isNotValidPurchase = (quantity,stock,funds,price) => {return !(Number(quantity)>0) || stock < quantity || funds < price*quantity}
isNotValidFund = (inputfund) => {return !(Number(inputfund)>0)}
productExplained = (product) => `Nombre: ${product.title}, descripción: ${product.description}, stock: ${product.stock}, precio: ${product.price}\n`

let option = undefined;
while(Number(option) !== 0){
	option = prompt("Bienvenido a la tienda. Para cargar fondos, presione 1. Para comprar productos, presione 2. Para salir del menú, presione 0. Escriba su opción.");
	console.log(`Opción elegida: ${option}.`)
	switch (Number(option)) {
		case 0:
			alert("¡Gracias, vuelva prontos!");
			break;
		case 1:
			let inputfund = prompt("Ingrese la cantidad a agregar.");
			if (isNotValidFund(inputfund)) {
				alert("Cantidad inválida.");
			} else {
				funds += Number(inputfund);
				alert("Cantidad válida.");
			}
			break;
		case 2:
			let txt = ""
			for(const product of products) {
				txt += productExplained(product);
			}
			const title = prompt("Ingrese el nombre del producto de los siguientes:\n" + txt);
			let productindex = -1;
			for (const index of products.keys()) {
				if (products[index].title === title) {
					productindex = index;
				}
			}
			if (productindex === -1) {
				alert("Producto no encontrado.");
			} else {
				const stock = products[productindex].stock;
				const price = products[productindex].price;
				let quantity = prompt(`Ingrese la cantidad a comprar.\nstock: ${stock}, precio: ${price}, fondos: ${funds}`);
				if (isNotValidPurchase(quantity,stock,funds,price)) {
					alert("Error: La cantidad es inválida, supera el stock o no tienes suficientes fondos.");
				} else {
					products[productindex].stock -= quantity;
					funds -= price*quantity;
					alert("Compra realizada.");
				}
			}
			break;
		default:
			alert("Ingrese un número válido: 0, 1, 2.");
			break;
	}
}
