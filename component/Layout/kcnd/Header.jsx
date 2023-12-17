import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import useResizeWidth from "../../../hooks/useResizeWidth";
import SearchBar from "../../organisms/SearchBar";
import Menu from "./Menu";

const KcndHeader = ({ pageName }) => {
  const router = useRouter();
  const {isTablet} = useResizeWidth();
  //테마 및 스크롤
  const [themeWhite, setThemeWhite] = useState(false);
  const [themeBlack, setThemeBlack] = useState(false);
  const [small, setSmall] = useState(false);
  
  //최근 상품 이미지
  const recentViewProductsImg = '';

  //search
  const [searchControl, setSearchControl] = useState(false);
  const [searchResult, setSearchResult] = useState({
    products: [],
    brands: [],
    recommendedKeywords: [],
  });
  const [brandNameAutoComplete, setBrandNameAutoComplete] = useState([]);


  const changeHeaderStyle = () => {
    const stMax = 120;
    const stMin = 8;
    if (window.scrollY >= stMax) {
      setSmall(true);
      return
    } else if (window.scrollY >= stMin && window.scrollY < stMax) {
    } else {
      setSmall(false);
    }
  };

  useEffect(() => {
    const path = router.pathname;
    setThemeWhite(path === '/');
    setThemeBlack(path === '/liq');
  }, [router.pathname]);

  useEffect(() => {
    document.addEventListener('scroll', changeHeaderStyle);
    return () => {
      document.removeEventListener('scroll', changeHeaderStyle);
    };
  }, []);

  return (
    <>
    <header className={`header-wrap${themeWhite ? ' themeWhite' : ''}${themeBlack ? ' themeBlack' : ''}${small ? ' small' : ''}`}>
    {small || (
      <div className="container">
        <div className="box-set">
          <h1 className="box-logo">
            <Link href="#"><a className="logo">대한항공 기내면세점</a></Link>
          </h1>
          <div className={`box-search ${searchControl ? 'searchControl' : ''}`}>
            <SearchBar
              searchControl={searchControl}
              setSearchControl={setSearchControl}
              themeWhite={themeWhite}
              small={small}
              searchResult={searchResult}
              setSearchResult={setSearchResult}
              brandNameAutoComplete={brandNameAutoComplete}
              setBrandNameAutoComplete={setBrandNameAutoComplete}
            />
          {searchControl || (
            <>
            <div className="exchange-rate">
              오늘의 환율 $1 = 1,356원
            </div>
            <div className="line"></div>
            <div className="lang-selectBox">
              <button className="default-option">한국어</button>
            </div>
            </>
          )}
          </div>
        </div>
        <div className={`box-util`}>
          <ul className="util-menu">
            <li>
              <Link href="#">
                <a className="menu">
                  <i className="icon icon1"></i>
                  <span className="text">로그<br />인</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a className="menu">
                  <i className="icon icon2"></i>
                  <span className="text">나의<br />정보</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a className="menu">
                  <i className="icon icon3"></i>
                  <span className="text">알림<br />보기</span>
                  <div className="shopNum">5</div>
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a className="menu">
                  <i className="icon icon4"></i>
                  <span className="text">고객<br />센터</span>
                </a>
              </Link>
            </li>
            <li className="cart">
              <Link href="#">
                <a className="menu">
                  <i className="icon icon5"></i>
                  <span className="text">장바<br />구니</span>
                  <div className="shopNum">5</div>
                </a>
              </Link>
            </li>
            <li>
              <Link href="#">
                <a className="menu">
                  <i className="thumb" style={{backgroundImage: recentViewProductsImg ? `url(${recentViewProductsImg})` : 'none',}}></i>
                  <span className="text">최근<br />상품</span>
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    )}
      <div className="container-gnb">
        <div className={`box-menu`}>
          {isTablet || <Menu small={small} />}
        </div>
        <div className="box-logo">
          <Link href="#"><a className="logo">대한항공 기내면세점</a></Link>
        </div>
        <div className="box-gnb">
          <div className="menus">
            <ul>
              <li className="active">
                <Link href="/kcnd/best"><a className="btn">베스트</a></Link>
              </li>
              <li>
                <Link href="#"><a className="btn">세일</a></Link>
              </li>
              <li>
                <Link href="#"><a className="btn">선물하기</a></Link>
              </li>
              <li>
                <Link href="#"><a className="btn">주류전문관</a></Link>
              </li>
              <li>
                <Link href="#"><a className="btn">스토리</a></Link>
              </li>
              <li>
                <Link href="#"><a className="btn">이벤트</a></Link>
              </li>
              <li>
                <Link href="#"><a className="btn">혜택</a></Link>
              </li>
              <li>
                <Link href="#"><a className="btn">카탈로그</a></Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="box-util">
      {small ? (
        <>
          <Link href="#"><a>로그인</a></Link>
          <span className="line"></span>
          <Link href="#"><a>회원가입</a></Link>
        </>
      ) : (
        <>
          <Link href="/employees-mall">
            <a className="mall-link">임직원몰</a>
          </Link>
          <button type="button" className="line-search">
            <span className="text">고객님이 탑승하는 노선 선택</span>
          </button>
        </>
      )}
        </div>
      </div>
    </header>
    </>
  )
}

export default KcndHeader;