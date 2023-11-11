import { effect, reactive, ref } from './reactive'

const product = reactive({ price: 5, quantity: 2 })
let salePrice = ref(0)
let total = 0

effect(() => void (salePrice.value = product.price * 0.9))
effect(() => void (total = salePrice.value * product.quantity))

console.log(`the total is '${total}' (expected 10)`)
console.log(`the salePrice is '${salePrice.value}' (expected 4.5)`)

product.quantity = 4
console.log(`the total is '${total}' (expected 18)`)
console.log(`the salePrice is '${salePrice.value}' (expected 4.5)`)

product.price = 10
console.log(`the total is '${total}' (expected 36)`)
console.log(`the salePrice is '${salePrice.value}' (expected 9)`)
