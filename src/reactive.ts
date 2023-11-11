type TargetMap = WeakMap<object, DependancyMap>
type DependancyMap = Map<string | number | symbol, EffectSet>
type EffectSet = Set<() => void>
type Effect = () => void

const targetMap: TargetMap = new WeakMap()

let activeEffect: Effect | null = null

export function effect(eff: Effect) {
	activeEffect = eff
	activeEffect()
	activeEffect = null
}

export function ref<T>(): { value: T | undefined }
export function ref<T>(raw: T): { value: T }
export function ref<T>(raw?: T) {
	const r = {
		get value() {
			track(r, 'value')
			return raw
		},

		set value(newVal) {
			raw = newVal
			trigger(r, 'value')
		},
	}

	return r
}

export function reactive<T extends object>(target: T) {
	return new Proxy<T>(target, {
		get(target, key, receiver) {
			track(target, key)
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

export function computed<T>(callback: () => T) {
	let result = ref<T>()

	effect(() => {
		result.value = callback()
	})

	return result as { readonly value: T }
}

function track(target: object, key: string | number | symbol) {
	if (!activeEffect) return

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

	dep.add(activeEffect)
}

function trigger(target: object, key: string | number | symbol) {
	let depsMap = targetMap.get(target)
	let dep = depsMap?.get(key)
	if (dep) {
		dep.forEach((effect) => effect())
	}
}
