type TargetMap = WeakMap<object, DependancyMap>
type DependancyMap = Map<string | number | symbol, EffectSet>
type EffectSet = Set<() => void>
type Effect = () => void

const targetMap: TargetMap = new WeakMap()

const product = reactive({ price: 5, quantity: 2 })
let total = 0

const effect = () => (total = product.price * product.quantity)

effect()
console.log('total', total)

product.quantity = 4
console.log('total', total)

function reactive<T extends object>(target: T) {
	return new Proxy<T>(target, {
		get(target, key, receiver) {
			track(target, key, effect)
			return Reflect.get(target, key, receiver)
		},

		set(target, key, value, receiver) {
			const oldValue = target[key as keyof T]

			const result = Reflect.set(target, key, value, receiver)

			if (result && oldValue !== value) {
				trigger(target, key)
			}

			return result
		},
	})
}

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
