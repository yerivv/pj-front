import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Merchandise = () => {
  const [isMouseHover, setIsMouseHover] = useState(false);
  const handleOnMouseEnter = () => {
    setIsMouseHover(true);
  };
  const handleOnMouseLeave = () => {
    setIsMouseHover(false);
  };
  return (
    <>
    <h3>웹 버전</h3>
    <div style={{'marginTop': '30px'}}>
      <h4>가로 4단일 경우(기본) - 전체 너비 1300px</h4>
      <div className="merchandise-wrap" style={{'width': '1300px', 'marginTop': '20px'}}>
        {/* 상품 1개 */}
        <div className="merchandise-item">
          <div className={`image-box`}>
            <div className="thumb-box">
              <Link href="#">
                <a className="thumb"><Image src={'/assets/sample/20210830185941677814.jpg'} width={500} height={500} priority style={{width: '100%', height: '100%'}} alt="상품명" /></a>
              </Link>
            </div>
            <Link href="#">
              <a className={`cover-box${isMouseHover ? ' hover' : ''}`} onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
                <Cover />
              </a>
            </Link>
          </div>
          <div className="info-box">
            <div className="brand">퍼지락 (일반)</div>
            <div className="name">수정 퍼지락 자일리톨 크리스탈 캔디 선물세트</div>
            <div className="price-info">
              <div className="discount">11%</div>
              <div className="origin">$36</div>
              <div className="price"><strong>$325</strong> (413,400원)</div>
            </div>
            <div className="label">
              <span className="text">신상품</span>
              <span className="text">세일</span>
              <span className="text">쿠폰</span>
            </div>
          </div>
        </div>
        {/* //상품 1개 - merchandise-item */}
        {/* 상품 1개 */}
        <div className="merchandise-item">
          <div className={`image-box${isMouseHover ? ' hover' : ''}`} onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
            <div className="thumb-box">
              <Link href="#none">
                <a className="thumb"><Image src={'/assets/sample/20220728141909320277.jpg'} width={500} height={500} priority style={{width: '100%', height: '100%'}} alt="상품명" /></a>
              </Link>
            </div>
            <Link href="#">
              <a className="cover-box">
                <div className="function">
                  <ul className="sold-out-restock">
                    <li className="sold-out">일시품절</li>
                    <li className="wish"><i className="ico"></i><span>찜하기</span></li>
                    <li className="restock">재입고 알람신청</li>
                  </ul>
                </div>
              </a>
            </Link>
          </div>
          <div className="info-box">
            <div className="brand">퍼지락 (품절-재입고)</div>
            <div className="name">수정 퍼지락 자일리톨 크리스탈 캔디 선물세트</div>
            <div className="price-info">
              <div className="discount">11%</div>
              <div className="origin">$36</div>
              <div className="price"><strong>$325</strong> (413,400원)</div>
            </div>
            <div className="label">
              <span className="text">신상품</span>
              <span className="text">세일</span>
              <span className="text">쿠폰</span>
            </div>
          </div>
        </div>
        {/* //상품 1개 - merchandise-item */}
        {/* 상품 1개 */}
        <div className="merchandise-item">
          <div className={`image-box${isMouseHover ? ' hover' : ''}`} onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
            <div className="thumb-box">
              <Link href="#">
                <a className="thumb"><Image src={'/assets/sample/20191030090159403032.png'} width={500} height={500} priority style={{width: '100%', height: '100%'}} alt="상품명" /></a>
              </Link>
            </div>
            <Link href="#">
              <a className="cover-box white">
                <div className="function">
                  <ul className="sold-out">
                    <li className="sold-out">일시품절</li>
                  </ul>
                </div>
              </a>
            </Link>
          </div>
          <div className="info-box">
            <div className="brand">퍼지락 (품절)</div>
            <div className="name">수정 퍼지락 자일리톨 크리스탈 캔디 선물세트</div>
            <div className="price-info">
              <div className="discount">11%</div>
              <div className="origin">$36</div>
              <div className="price"><strong>$325</strong> (413,400원)</div>
            </div>
            <div className="label">
              <span className="text">신상품</span>
              <span className="text">세일</span>
              <span className="text">쿠폰</span>
            </div>
          </div>
        </div>
        {/* //상품 1개 - merchandise-item */}
        {/* 상품 1개 */}
        <div className="merchandise-item">
          <div className={`image-box${isMouseHover ? ' hover' : ''}`} onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
            <div className="thumb-box">
              <Link href="#">
                <a className="thumb"><Image src={'/assets/sample/20230731104817108569.png'} width={500} height={500} priority style={{width: '100%', height: '100%'}} alt="상품명" /></a>
              </Link>
            </div>
            <Link href="#">
              <a className="cover-box white">
                <div className="function">
                  <ul className="adult">
                    <li className="badge"><Image src={'/assets/images/19.png'} width={500} height={500} priority style={{width: '100%', height: '100%'}} alt="상품명" /></li>
                  </ul>
                </div>
              </a>
            </Link>
          </div>
          <div className="info-box">
            <div className="brand">퍼지락 (주류-로그인 전)</div>
            <div className="name">수정 퍼지락 자일리톨 크리스탈 캔디 선물세트</div>
            <div className="price-info">
              <div className="discount">11%</div>
              <div className="origin">$36</div>
              <div className="price"><strong>$325</strong> (413,400원)</div>
            </div>
            <div className="label">
              <span className="text">신상품</span>
              <span className="text">세일</span>
              <span className="text">쿠폰</span>
            </div>
          </div>
        </div>
        {/* //상품 1개 - merchandise-item */}
        {/* 상품 1개 */}
        <div className="merchandise-item">
          <div className={`image-box${isMouseHover ? ' hover' : ''}`} onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
            <div className="thumb-box">
              <Link href="#">
                <a className="thumb"><Image src={'/assets/sample/20210830185941677814.jpg'} width={500} height={500} priority style={{width: '100%', height: '100%'}} alt="상품명" /></a>
              </Link>
            </div>
            <Link href="#">
              <a className="cover-box">
                <div className="function">
                  <ul className="default">
                    <li className="wish"><i className="ico"></i><span>찜하기</span></li>
                    <li className="cart"><i className="ico"></i><span>장바구니</span></li>
                    <li className="purchase"><i className="ico"></i><span>바로구매</span></li>
                  </ul>
                </div>
              </a>
            </Link>
          </div>
          <div className="info-box">
            <div className="brand">퍼지락 (주류-로그인 후)</div>
            <div className="name">수정 퍼지락 자일리톨 크리스탈 캔디 선물세트</div>
            <div className="price-info">
              <div className="discount">11%</div>
              <div className="origin">$36</div>
              <div className="price"><strong>$325</strong> (413,400원)</div>
            </div>
            <div className="label">
              <span className="text">신상품</span>
              <span className="text">세일</span>
              <span className="text">쿠폰</span>
            </div>
          </div>
        </div>
        {/* //상품 1개 - merchandise-item */}
      </div>
    </div>
    </>
  )
}

const Cover = () => {
  return (
    <>
    <div className="function">
      <ul className="default">
        <li className="wish"><i className="ico"></i><span>찜하기</span></li>
        <li className="gift"><i className="ico"></i><span>선물하기</span></li>
        <li className="cart"><i className="ico"></i><span>장바구니</span></li>
        <li className="purchase"><i className="ico"></i><span>바로구매</span></li>
      </ul>
    </div>
    </>
  )
}

export default Merchandise;