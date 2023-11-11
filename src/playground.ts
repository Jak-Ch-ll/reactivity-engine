import { computed, reactive } from './reactive'

const product = reactive({ price: 5, quantity: 2 })
const salePrice = computed(() => product.price * 0.9)
const total = computed(() => salePrice.value * product.quantity)

console.log(`the total is '${total.value}' (expected 10)`)
console.log(`the salePrice is '${salePrice.value}' (expected 4.5)`)

product.quantity = 4
console.log(`the total is '${total.value}' (expected 18)`)
console.log(`the salePrice is '${salePrice.value}' (expected 4.5)`)

product.price = 10
console.log(`the total is '${total.value}' (expected 36)`)
console.log(`the salePrice is '${salePrice.value}' (expected 9)`)
