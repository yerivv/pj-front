import Link from "next/link";
import BackButton from "../../BackButton";

const BasicHeader = ({ pageName }) => {
  return (
    <header className="basic-header">
      <h1 className="blind">대한항공 기내면세점</h1>
      <BackButton />
      <h2>{pageName}</h2>
      <Link href="/cart"><a>장바구니</a></Link>
    </header>
  )
}

export default BasicHeader;