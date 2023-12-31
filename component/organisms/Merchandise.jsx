import Image from "next/image";
import Link from "next/link";
import useResizeWidth from "../../hooks/useResizeWidth";
import { useState } from "react";

const Merchandise = ({ type, data }) => {
  const {isTablet} = useResizeWidth();
  const [imageClass, setImageClass] = useState('image-box');
  if(type === undefined) {
    console.log('상품유형 : ', '기본')
  } else {
    console.log('상품유형 : ', type)
  }
  const handleOnClickCover = () => {
    alert('아아아')
  }
  const handleOnCover = () => {
    setImageClass('image-box hover')
  }
  const handleOffCover = () => {
    setImageClass('image-box')
  }
  const handleAddWishList = () => {
    alert('찜')
  }
  const handleGift = () => {
    alert('선물')
  }
  const handleCart = () => {
    alert('장바구니')
  }
  const handlePurchase = () => {
    alert('바로구매')
  }
  //품절
  const backOrdered = false;
  const adultOnly = false;
  const isSoldOut = false;
  return (
    <div className="merchandise-item">
      <div className={imageClass} onMouseEnter={handleOnCover} onMouseLeave={handleOffCover}>
        <div className="thumb-box" onClick={handleOnClickCover}>
          <div className="thumb"><Image src={'/assets/sample/20220331000317730878.jpg'} width={500} height={500} priority style={{width: '100%', height: '100%'}} alt="상품명" /></div>
        </div>
        <div className="label-box">
          <span className="label">단하루</span>
          <span className="label">핫딜</span>
        </div>
        <div className="rank-box">
          <span className="label top">1</span>
        </div>
        <div className="other-label-box">
          <Image src={'/assets/sample/202306141800223069641.png'} width={108} height={42} priority alt="이름" />
        </div>
      {isTablet || (
        <div className="cover-box">
          <div className="default">
            <div className="function">
        {adultOnly ? (
              <div className="adult-only">
                <div className="text">
                  <strong>19</strong>
                  <span>Adult only</span>
                </div>
              </div>
        ) : !backOrdered && !isSoldOut ? (
            <>
              <ul>
                <li>
                  <button type="button" onClick={handleAddWishList} data-id="functional-button">
                    <i className="icon heart"></i>
                    <span className="text">찜하기</span>
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handleGift}>
                    <i className="icon gift"></i>
                    <span className="text">선물하기</span>
                  </button>
                </li>
              </ul>
              <ul>
                <li>
                  <button type="button" onClick={handleCart}>
                    <i className="icon cart"></i>
                    <span className="text">장바구니</span>
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handlePurchase}>
                    <i className="icon purchase"></i>
                    <span className="text">바로구매</span>
                  </button>
                </li>
              </ul>
            </>
        ) : null}
        {isSoldOut ? (
              <div className="sold-out"><span>일시 품절</span></div>
        ) : null}
            </div>
          {!adultOnly ? (
            <div className="more">
              <button type="button" onClick={e => handleBtnClick(e)} className={`btn ${backOrdered ? 'restock' : 'detail'}`}>{backOrdered ? '재입고 알림신청' : '상세보기'}</button>
            </div>
          ) : null}
          </div>
        </div>
      )}
      </div>
      <div className="info-box">
        <div className="brand">산타마리아노벨라</div>
        <div className="name">산타 마리아 노벨라 프리지아 오드코롱</div>
        <div className="price-info">
          <div className="origin">$325</div>
          <div className="discount">20%</div>
          <div className="price"><strong>$325</strong> (413,400원)</div>
        </div>
        <div className="label">
          <span className="text">신상품</span>
          <span className="text">세일</span>
          <span className="text">쿠폰</span>
        </div>
      </div>
    </div>
  )
}

export default Merchandise;