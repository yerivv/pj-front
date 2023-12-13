import Link from "next/link";

const MenuMo = ({ moMenu }) => {
  return(
<<<<<<< HEAD
    <>
    {moMenu && (
      <div className="menu-wrap-mo">
        메뉴오픈
        <Link href="/category"><a>카테고리 이동</a></Link>
      </div>
    )}
    </>
=======
    <div className="menu-wrap">
      <div>카테고리.브랜드</div>
      <div>추천메뉴</div>
      <div>고정 메뉴</div>
    </div>
>>>>>>> e73220e4f8165a77dd27cc852bfa944ca7495804
  )
}

export default MenuMo;