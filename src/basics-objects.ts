// ### preparation ###
type TargetMap = WeakMap<object, DependancyMap>
type DependancyMap = Map<string | number | symbol, EffectSet>
type EffectSet = Set<() => void>
type Effect = () => void

const targetMap: TargetMap = new WeakMap()

// ### first object ###
const product = { price: 5, quantity: 2 }
let total = 0

const productEffect = () => (total = product.price * product.quantity)

track(product, 'quantity', productEffect)
productEffect()

console.log('total', total) // 10

// update the quantity
product.quantity = 3
// run all effects saved
trigger(product, 'quantity')

console.log('total', total) // 15

// ### second object ###
const user = { firstname: 'John', lastname: 'Doe' }
let fullname = ''

const userEffect = () => (fullname = `${user.firstname} ${user.lastname}`)

track(user, 'firstname', userEffect)
userEffect()

console.log('fullname', fullname) // John Doe

// update the firstname
user.firstname = 'Jane'
// run all effects saved
trigger(user, 'firstname')

console.log('fullname', fullname) // Jane Doe

// ### implementation ###
function track(target: object, key: string | number | symbol, effect: Effect) {
	let depsMap = targetMap.get(target)
	if (!depsMap) {
		depsMap = new Map()
		targetMap.set(target, depsMap)
	}

	let dep = depsMap.get(key)
	if (!dep) {
		dep = new Set()
		depsMap.set(key, dep)
	}

	dep.add(effect)
}

function trigger(target: object, key: string | number | symbol) {
	let depsMap = targetMap.get(target)
	let dep = depsMap?.get(key)
	if (dep) {
		dep.forEach((effect) => effect())
	}
}

export {}
