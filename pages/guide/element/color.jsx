const ElementColor = () => {
  return (
    <>
    <h3>Color system</h3>
    <div className="ele-color">
      <h4>Primay Color</h4>
      <p className="summary">블랙앤 화이트 컬러를 주 컬러로 사용합니다.</p>
      <ul>
        <li className="black">
          <div>Black</div>
          <div className="small">$color-black</div>
          <div className="small">#000000</div>
        </li>
        <li className="white">
          <div>White</div>
          <div className="small">$color-white</div>
          <div className="small">#ffffff</div>
        </li>
      </ul>
    </div>
    <div className="ele-color">
      <h4>Interface Color</h4>
      <p className="summary">인터페이스에 사용되는 주 색감을 나열합니다.</p>
      <ul>
        <li className="gray1">
          <div>Font</div>
          <div className="small">$color-gray1</div>
          <div className="small">#333333</div>
        </li>
        <li className="gray2">
          <div>Font</div>
          <div className="small">$color-gray2</div>
          <div className="small">#666666</div>
        </li>
        <li className="red">
          <div>Font</div>
          <div className="small">$color-red</div>
          <div className="small">#e1251b</div>
        </li>
        <li className="blue">
          <div>Font</div>
          <div className="small">$color-blue</div>
          <div className="small">#5ba6d2</div>
        </li>
        <li className="line1">
          <div>Divider</div>
          <div className="small">$color-line1</div>
          <div className="small">#dfdfdf</div>
        </li>
        <li className="bg1">
          <div>Bg</div>
          <div className="small">$color-bg1</div>
          <div className="small">#f5f5f5</div>
        </li>
        <li className="bg2">
          <div>Bg</div>
          <div className="small">$color-bg2</div>
          <div className="small">#f7f7f8</div>
        </li>
      </ul>
    </div>
    <div className="ele-color">
      <h4>ETC</h4>
      <p className="summary">기타 공용 목적 외로 사용한 컬러</p>
      <ul>
        <li className="etc1">
          <div>ETC</div>
          <div className="small">$color-etc1</div>
          <div className="small">#ffcccc</div>
        </li>
        <li className="etc2">
          <div>ETC</div>
          <div className="small">$color-etc2</div>
          <div className="small">#39457a</div>
        </li>
        <li className="etc3">
          <div>ETC</div>
          <div className="small">$color-etc3</div>
          <div className="small">#f1efe4</div>
        </li>
        <li className="etc4">
          <div>ETC</div>
          <div className="small">$color-etc4</div>
          <div className="small">#ffcc00</div>
        </li>
        <li className="etc5">
          <div>ETC</div>
          <div className="small">$color-etc5</div>
          <div className="small">#6ca5ce</div>
        </li>
        <li className="etc6">
          <div>ETC</div>
          <div className="small">$color-etc6</div>
          <div className="small">#2fb596</div>
        </li>
        <li className="etc7">
          <div>ETC</div>
          <div className="small">$color-etc7</div>
          <div className="small">#356da6</div>
        </li>
        <li className="etc8">
          <div>ETC</div>
          <div className="small">$color-etc8</div>
          <div className="small">#fcfae8</div>
        </li>
        <li className="etc9">
          <div>ETC</div>
          <div className="small">$color-etc9</div>
          <div className="small">#007898</div>
        </li>
        <li className="etc10">
          <div>ETC</div>
          <div className="small">$color-etc10</div>
          <div className="small">#e6f6ff</div>
        </li>
      </ul>
    </div>
    {/* <div className="ele-color">
      <h4>GrayScale</h4>
      <p className="summary">Gray 컬러</p>
      <ul>
        <li className="black">
          <div>Black</div>
          <div className="small">$color-black</div>
          <div className="small">#000000</div>
        </li>
        <li className="white">
          <div>White</div>
          <div className="small">$color-white</div>
          <div className="small">#ffffff</div>
        </li>
      </ul>
    </div> */}
    </>
  )
}

export default ElementColor;