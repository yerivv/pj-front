import Link from "next/link";

const BasicFooter = () => {
  return (
    <footer>
      <div>Basic Footer</div>
      <Link href="/inquiry/list"><a>1:1문의하기</a></Link>
    </footer>
  )
}

export default BasicFooter;