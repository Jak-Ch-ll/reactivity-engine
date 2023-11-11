import { effect, ref } from './reactive'

export function setupCounter(element: HTMLButtonElement) {
	let counter = ref(0)

	effect(() => {
		element.innerHTML = `count is ${counter.value}`
	})

	element.addEventListener('click', () => counter.value++)
}
