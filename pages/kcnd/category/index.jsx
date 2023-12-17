import Merchandise from "../../../component/organisms/Merchandise";

const CategoryView = () => {
  return (
    <div className="page-category">
      <div className="section">네비게이션</div>
      <div>타이틀</div>
      <div className="section">배너1개 (슬라이드)</div>
      <div className="section">베스트상품</div>
      <div className="section">신상품</div>
      <div className="section">배너2개 (슬라이드)</div>
      <div className="section">
        <div>검색필터</div>
        <div>상품정렬</div>
        <div className="section merchandise-wrap" style={{marginTop: '40px'}}>
          <Merchandise data="category" />
          <Merchandise data="category" />
        </div>
      </div>
    </div>
  )
}

export default CategoryView;