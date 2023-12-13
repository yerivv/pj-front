import Link from "next/link";

const MenuMo = ({ moMenu }) => {
  return(
    <>
    {moMenu && (
      <div className="menu-wrap-mo">
        메뉴오픈
        <Link href="/category"><a>카테고리 이동</a></Link>
      </div>
    )}
    </>
  )
}

export default MenuMo;