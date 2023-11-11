let product = { price: 5, quantity: 2 }
let total = 0

const effect = () => (total = product.price * product.quantity)

track('quantity')
effect()

const depsMap = new Map<string | number | symbol, Set<() => void>>()

function track(key: string | number | symbol) {
	let dep = depsMap.get(key)

	if (!dep) {
		dep = new Set()
		depsMap.set(key, dep)
	}

	dep.add(effect)
}

function trigger(key: string | number | symbol) {
	let dep = depsMap.get(key)
	if (dep) {
		dep.forEach((effect) => effect())
	}
}

console.log('total', total) // 10

// update the quantity
product.quantity = 3
// run all effects saved
trigger('quantity')

console.log('total', total) // 15

export {}
