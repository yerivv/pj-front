import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SearchBar from "../../organisms/SearchBar";

const KcndHeader = ({ pageName }) => {
  const router = useRouter();

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
    const stMax = 15;
    const stMin = 9;
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
    setThemeBlack(path === '/liquor-store');
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
      {/* {small && <div className="WhiteBg"></div>} */}
      <div className="bg">
        <div className="wrapper">
        {small || (
          <div className="container">
            <div className={`innerLeft ${searchControl ? 'searchControl' : ''}`}>
              <h1 className="logoContainer">
                <Link href="#"><a className="logoImage">대한항공 기내면세점</a></Link>
              </h1>
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
              <div className="exchangeRate">
                오늘의 환율 $1 = 1,356원
              </div>
              <div className="langSelectBox">
                <button className="default-option">한국어</button>
              </div>
              </>
            )}
            </div>
            <div className={`innerRight ${searchControl ? 'searchControl' : ''}`}>
              <ul className="utilMenu">
                <li>
                  <Link href="#">
                    <a className="menu">
                      <i className="icon1"></i>
                      <span>로그<br />인</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <a className="menu">
                      <i className="icon2"></i>
                      <span>나의<br />정보</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <a className="menu">
                      <i className="icon3"></i>
                      <span>알림<br />보기</span>
                      <div className="shopNum">5</div>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <a className="menu">
                      <i className="icon4"></i>
                      <span>고객<br />센터</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <a className="menu">
                      <i className="icon5"></i>
                      <span>장바<br />구니</span>
                      <div className="shopNum">5</div>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <a className="menu">
                      <i className="thumb" style={{backgroundImage: recentViewProductsImg ? `url(${recentViewProductsImg})` : 'none',}}></i>
                      <span>최근<br />상품</span>
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
          <div className="container2">
            <div className="innerLeftFlexEnd">
              <div className="menuIconContainer">
                <span className="menu">전체메뉴</span>
              </div>
              <div className="logoContainer logoContainer2">
                <Link href="#"><a className="logoImage">대한항공 기내면세점</a></Link>
              </div>
              <div className="gnbWrapper">
                <div className="gnbMenus">
                  <ul className="MuiTabs-scroller">
                    <li>
                      <Link href="#"><a>메뉴1</a></Link>
                    </li>
                    <li>
                      <Link href="#"><a>메뉴2</a></Link>
                    </li>
                    <li>
                      <Link href="#"><a>메뉴3</a></Link>
                    </li>
                    <li>
                      <Link href="#"><a>메뉴4</a></Link>
                    </li>
                    <li>
                      <Link href="#"><a>메뉴5</a></Link>
                    </li>
                    <li>
                      <Link href="#"><a>메뉴6</a></Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="innerRight">
            {small ? (
              <div>로그인/회원가입 or 마이페이지/장바구니</div>
            ) : (
              <>
              <Link href="/employees-mall">
                <a className="MallLink">임직원몰</a>
              </Link>
              <div className="lineSearch">
                고객님이 탑승하는 노선 선택
                <span className="planImage"></span>
              </div>
              </>
            )}
            </div>
          </div>
        </div>
      </div>
      {/* {small && <div className="MainNullSpace">공백영역</div>} */}
    </header>
    </>
  )
}

export default KcndHeader;