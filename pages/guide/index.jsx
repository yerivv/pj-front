import Link from "next/link";

export default function GuideIndex() {
  return (
    <>
      <div>111###</div>
      <Link href="/guide/element/color">
        색상이동
      </Link>
      <div style={{'paddingTop': '30px'}}>
        <Link href="/guide/merchandise">
          상품단위
        </Link>
      </div>
    </>
  )
}