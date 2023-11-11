let price = 5
let quantity = 2
let total = 0

// store our effects
const dep = new Set<() => void>()

function effect() {
	// the code we want to save
	total = price * quantity
}

function track() {
	dep.add(effect)
}

function trigger() {
	dep.forEach((effect) => effect())
}

// save the code
track()
// run the effect initially
effect()

console.log('total', total) // 10

// update the quantity
quantity = 3
// run all effects saved
trigger()

console.log('total', total) // 15

export {}
