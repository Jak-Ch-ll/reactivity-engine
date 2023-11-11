import { effect, reactive } from './reactive'

const product = reactive({ price: 5, quantity: 2 })
let salePrice = 0
let total = 0

effect(() => (total = product.price * product.quantity))
effect(() => (salePrice = product.price * 0.9))

console.log(`the total is '${total}' (expected 10)`)
console.log(`the salePrice is '${salePrice}' (expected 4.5)`)

product.quantity = 4
console.log(`the total is '${total}' (expected 20)`)
console.log(`the salePrice is '${salePrice}' (expected 4.5)`)

product.price = 10
console.log(`the total is '${total}' (expected 40)`)
console.log(`the salePrice is '${salePrice}' (expected 9)`)
