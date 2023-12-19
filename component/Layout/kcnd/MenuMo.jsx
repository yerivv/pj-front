import Link from "next/link";

const MenuMo = ({ moMenu, closeModal }) => {
  return(
    <>
    {moMenu && (
      <div className="menu-wrap-mo">
        메뉴오픈
        <Link href="/category"><a>카테고리 이동</a></Link>

        <div className="close" onClick={closeModal}>닫기</div>
      </div>
    )}
    </>
  )
}

export default MenuMo;