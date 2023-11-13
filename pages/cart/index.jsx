import { useRouter } from "next/router"

const CartIndex = () => {
  const router = useRouter();
  const orderSheet = () => {
    router.push('/order/order')
  }
  return (
    <div>
      장바구니
      <button onClick={orderSheet}>주문하기</button>
    </div>
  )
}

export default CartIndex;