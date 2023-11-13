import { useRouter } from "next/router";

const OrderSheet = () => {
  const router = useRouter();
  const payment = () => {
    router.replace('success');
  }
  return (
    <div>
      주문서작성
      <button onClick={payment}>결제하기</button>
    </div>
  )
}

export default OrderSheet;