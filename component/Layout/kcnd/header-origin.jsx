import { useEffect, useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';

import themeResponsive from 'styles/theme';
import theme from 'styles/theme';
import mimTheme from 'styles/mimTheme';

import { Tabs, Tab } from '@mui/material';

import styled, { css } from 'styled-components';

import { currentUser } from 'atoms/user';
import useAuth from 'hooks/useAuth';

import { getExchangeRateAPI } from 'lib/api/exchange-rate';
import { today } from 'lib/utility/today';

import FlightSearch from 'components/organisms/FlightSearch';
import Modal from 'components/organisms/Modal';
import Inform from 'components/organisms/Inform';
import Menu from 'components/organisms/Menu';
import LoginModal from 'components/views/loginView/modal';
import Img from 'components/atoms/Img';
import SelectBox from 'components/atoms/SelectBox';
import Span from 'components/atoms/Span';
import RecentProducts from 'components/popup/RecentProducts';

import { MAIN_MENUS } from 'constants';
import { getAlarmCategory, getAlarmList } from 'lib/api/alarm';
import { enLangView, krLangCode, krLangView, setCookie } from 'lib/api/index';

import { useRecoilState } from 'recoil';
import SearchBar from 'components/organisms/SearchBar';
import { exchangeRateGlobalState, alram, mimCode } from 'atoms/app';
import Loading from '../atoms/Loading';
import useResponsiveDeviceWidth from 'hooks/useResponsiveDeviceWidth';

export default function Header({
  hydrated,
  // flightLocations,
  menus,
  currentCategoryId,
  sortedBrandsByCategory,
  totalCartProductsTotalCount,
  remove,
  handleChangeCurrentCategoryId,
  recentViewProductsImg,
  recentViewProducts,
  setRecentViewProducts,
  //setLanguage,
  //setLanguageSelectValue,
}) {
  const isNotDesktop = useResponsiveDeviceWidth({ isNotDesktop: true });
  const menuRef = useRef(null);

  const user = useRecoilValue(currentUser);
  const _mimCode = useRecoilValue(mimCode);
  //const _language = useRecoilValue(language);
  const _language =
    window.localStorage.getItem('language') === enLangView()
      ? enLangView()
      : krLangView();
  const _theme = _mimCode === 'HQS' ? theme : mimTheme;

  const [exchangeRateRecoilState, setExchangeRateRecoilState] = useRecoilState(
    exchangeRateGlobalState,
  );
  const [loginCheck, setLoginCheck] = useState(false);

  const { handleGetUser, handleSignOut } = useAuth(loginCheck, setLoginCheck);
  const [triedLogout, setTriedLogout] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [activeMainTabIndex, setActiveMainTabIndex] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const [modalControl, setModalControl] = useState(false);
  const [isFlightSearchModalOpen, setIsFlightSearchModalOpen] = useState(false);
  const [loginNoticeControl, setLoginNoticeControl] = useState(false);
  const [login, setLogin] = useState(false);
  const [themeWhite, setThemeWhite] = useState(false);
  const [themeBlack, setThemeBlack] = useState(false);
  const [small, setSmall] = useState(false);
  const [notificationPopup, setNotificationPopup] = useState(false);
  const [recentProductsPopup, setRecentProductsPopup] = useState(false);
  const [exchangeRate, setExchangeRate] = useState('');
  const [searchControl, setSearchControl] = useState(false);
  // const [menuSeq, setMenuSeq] = useState(null);

  const [alramFlag, setAlramFlag] = useRecoilState(alram);
  // ===================================
  // 알람리스트 받아오기
  //  ===================================
  const [alarmList, setAlarmList] = useState([]);
  const [alarmCount, setAlarmCount] = useState(0);
  const [alarmPropList, setAlarmPropList] = useState([]);
  const [alarmPropCount, setAlarmPropCount] = useState(0);
  const [alarmCheckCount, setAlarmCheckCount] = useState(0);
  const [alarmCategory, setAlarmCategory] = useState([]);
  const [alarmParams, setAlarmParams] = useState({
    categoryCode: '',
  });
  const [moreAlarmCount, setMoreAlarmCount] = useState(10);

  const [menusGNB, setMenusGNB] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // search bar state
  const [searchResult, setSearchResult] = useState({
    products: [],
    brands: [],
    recommendedKeywords: [],
  });
  const [brandNameAutoComplete, setBrandNameAutoComplete] = useState([]);

  const router = useRouter();
  useEffect(() => {
    if (menus.length) {
      setMenusGNB(menus);
    }
  }, [menus]);

  useEffect(() => {
    if (alramFlag === 'changed') {
      (async () => {
        alarmListSetting(alarmParams);
        setAlramFlag('');
      })();
    }
  }, [alramFlag]);

  useEffect(() => {
    (async () => {
      const exchageRate = await getExchangeRateAPI(today);
      setExchangeRate(exchageRate?.data?.latestData?.exchangePrice);
      setExchangeRateRecoilState(exchageRate?.data?.latestData?.exchangePrice);
      const alarmCategoryData = await getAlarmCategory();
      setAlarmCategory(alarmCategoryData?.data);
    })();
  }, []);
  useEffect(() => {
    document.addEventListener('scroll', changeHeaderStyle);
    return () => {
      document.removeEventListener('scroll', changeHeaderStyle);
    };
  }, []);

  useEffect(() => {
    if (router.asPath === '/') {
      setActiveMainTabIndex(false);
      return;
    }

    // handle search bar
    setSearchControl(false);
  }, [router.asPath]);

  useEffect(() => {
    function menuClose(e) {
      if (menuOpen && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }

    window.addEventListener('click', menuClose);

    return () => {
      window.removeEventListener('click', menuClose);
    };
  }, [menuOpen]);

  useEffect(() => {
    const path = router.pathname;

    switch (path) {
      case '/':
        setThemeWhite(false);
        setThemeBlack(false);
        break;
      case '/liquor-store':
        setThemeWhite(false);
        setThemeBlack(true);
        break;
      default:
        setThemeWhite(true);
        setThemeBlack(false);

        break;
    }
  }, [router.pathname]);

  useEffect(() => {
    if (!loginCheck) {
      handleGetUser();
    }
    if (user) {
      setIsOpenLoginModal(false);
      return;
    }

    if (triedLogout) {
      router.push('/');
      return;
    }
  }, [handleGetUser, user, triedLogout]);

  const handleOnChangeSelectLanguageValue = e => {
    const languageOptionValue = e.target.getAttribute('langcode');
    window.localStorage.setItem('language', languageOptionValue);
    setCookie('language', languageOptionValue, 1);
    setIsLoading(true);
    router.reload();
  };

  const changeHeaderStyle = () => {
    if (window.scrollY >= 15) {
      setSmall(true);
      // setThemeWhite(true);
      return;
    } else if (window.scrollY >= 9 && window.scrollY < 15) {
      // 이 사이값이 화면 떨림을 발생시킴
      // 하여 이 사이값은 아무것도 하지 않도록
    } else {
      setSmall(false);
    }
    // setThemeWhite(false);
    //console.info('header==>', window.scrollY);
  };

  const handleToggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const handleNavigateToHome = () => {
    // TODO: This code maybe later redirect by init history stack
    router.push('/');
  };

  const handleNavigateTo = (e, displaySeqNo) => {
    displaySeqNo && window.localStorage.setItem('displaySeqNo', displaySeqNo);
    const to = e.currentTarget.id;

    router.push(to);
  };

  const handleOnClickMyInfo = e => {
    if (isLoginPage) return;

    if (user) {
      handleNavigateTo(e);

      return;
    }

    setLoginNoticeControl(true);
  };

  const handleOnClickLogout = e => {
    if (isLoginPage) return;

    if (user) {
      setAlarmCheckCount(0);
      handleSignOut();
      setTriedLogout(true);
      return;
    }

    if (!user && isMainPage) {
      handleNavigateTo(e);
      return;
    }

    setIsOpenLoginModal(true);
  };

  const handleToggleFlightSearchModal = () => {
    setNotificationPopup(false);
    setRecentProductsPopup(false);
    setIsFlightSearchModalOpen(!isFlightSearchModalOpen);
    // setSamePrevPathNameStatus(true);
  };

  const handleInitModalAndPopUpState = () => {
    setNotificationPopup(false);
    setRecentProductsPopup(false);
    setIsFlightSearchModalOpen(false);
  };

  const handleToggleRecentProductsPopUp = () => {
    handleInitModalAndPopUpState();
    // setRecentProductsPopup(!recentProductsPopup);
    setRecentProductsPopup(!recentProductsPopup);
  };

  useEffect(() => {
    setRecentProductsPopup(false);
    setMenuOpen(false);
  }, [router]);

  const handleToggleNotificationPopUp = () => {
    handleInitModalAndPopUpState();
    setNotificationPopup(!notificationPopup);
    setModalControl(true);
  };

  const isMainPage = useMemo(
    () => router.pathname === '' || router.pathname === '/',
    [router],
  );

  const isLoginPage = useMemo(() => router.pathname === '/login', [router]);

  const alarmListSetting = async alarmParams => {
    const res = await getAlarmList(alarmParams);
    const resContent = res?.data?.content?.filter(item => {
      const now = new Date();
      const startDate = new Date(now.setMonth(now.getMonth() - 2));
      const date = new Date(item.registerDateTime);
      return date >= startDate;
    });

    const count = res?.data?.content?.filter(
      item => item?.isCheck === false,
    )?.length;
    setAlarmList(resContent);
    if (alarmParams?.categoryCode === '') setAlarmCheckCount(count);

    setAlarmCount(resContent ? resContent.length : 0);
  };

  useEffect(() => {
    (async () => {
      if (!user) return;
      alarmListSetting(alarmParams);
    })();
  }, [user]);

  useEffect(() => {
    const fillterData = alarmCategory.filter(
      item => item.code === alarmParams.categoryCode,
    );
    const propsData = alarmList?.filter(item => {
      if (alarmParams.categoryCode === '') {
        return item;
      } else if (fillterData.length > 0) {
        return item.category === fillterData[0].name;
      }
    });
    setAlarmPropList(propsData);
    setAlarmPropCount(propsData?.length);
  }, [alarmParams, alarmList, alarmCategory]);

  // ===================================
  // 알람리스트 받아오기
  //  ===================================

  useEffect(() => storePathValues, [router.asPath, router?.pathname]);
  const [prevPage, setPrevPage] = useState('');

  function storePathValues() {
    const storage = globalThis?.sessionStorage;
    if (!storage) return;
    // Set the previous path as the value of the current path.
    const prevPath = storage.getItem('currentPath');
    storage.setItem('prevPath', prevPath);
    // Set the current path value by looking at the browser's location object.
    storage.setItem('currentPath', globalThis.location.pathname);
    setPrevPage(prevPath);
  }

  useEffect(() => {
    if (prevPage !== router?.pathname) {
      setShowOptions(false);
      return setIsFlightSearchModalOpen(false);
    }
  }, [router?.pathname]);

  return (
    <>
      {/* {isLoading && <Loading />} */}
      {/* {small && <div className="WhiteBg" />} */}
      <header className={`header-wrap${themeWhite ? ' themeWhite' : ''}${themeBlack ? ' themeBlack' : ''}${small ? ' small' : ''}`} ref={menuRef}>
        {small || (
          <div className="container">
            <div className="box-set">
              <h1 className="box-logo">
                <button type="button" onClick={handleNavigateToHome}>
                  <span className="logo">{_mimCode === 'HQS' ? '대한항공 기내면세점' : ''}</span>
                </button>
              </h1>
              <div className={`box-search ${searchControl ? 'searchControl' : ''}`}>
                <SearchBar
                  searchControl={searchControl}
                  setSearchControl={setSearchControl}
                  searchResult={searchResult}
                  setSearchResult={setSearchResult}
                  brandNameAutoComplete={brandNameAutoComplete}
                  setBrandNameAutoComplete={setBrandNameAutoComplete}
                />
                {searchControl || (
                  <>
                    <div className="exchange-rate">
                      오늘의 환율 $1 = {exchangeRateRecoilState}원
                    </div>
                    <div className="line"></div>
                    <div onClick={() => setShowOptions(prev => !prev)} className="lang-selectBox">
                      <button className="default-option">{_language}</button>
                      {showOptions && (
                        <ul className="option-box">
                          <li
                            value="ko"
                            langcode={krLangCode()}
                            className="option"
                            onClick={handleOnChangeSelectLanguageValue}
                          >
                            {krLangView()}
                          </li>
                          <li
                            value="en"
                            langcode={enLangView()}
                            className="option"
                            onClick={handleOnChangeSelectLanguageValue}
                          >
                            {enLangView()}
                          </li>
                        </ul>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="box-util">
              <ul className="util-menu">
              {isNotDesktop ? (
                <li className="cart">
                  <button id="/cart" onClick={handleNavigateTo} className="menu">
                    <i className="icon icon5"></i>
                    <span className="text">장바<br />구니</span>
                    {totalCartProductsTotalCount > 0 && (
                      <div className="shopNum">{totalCartProductsTotalCount}</div>
                    )}
                  </button>
                </li>
              ) : (
                <>
                <li>
                  <button id="/login" onClick={handleOnClickLogout} className="menu">
                    <i className={`icon ${user ? 'icon1-login' : 'icon1'}`}></i>
                    {user ? (<span className="text">로그<br />아웃</span>) : (<span className="text">로그<br />인</span>)}
                  </button>
                </li>
                <li>
                  <button id="/my-page" onClick={handleOnClickMyInfo}>
                    <a className="menu">
                      <i className="icon icon2"></i>
                      <span className="text">나의<br />정보</span>
                    </a>
                  </button>
                </li>
                <li>
                  <button onClick={handleToggleNotificationPopUp} className="menu">
                    <i className="icon icon3"></i>
                    <span className="text">알림<br />보기</span>
                    {alarmCheckCount > 0 && <div className="shopNum">{alarmCheckCount}</div>}
                  </button>
                </li>
                <li>
                  <button id="/cs" onClick={handleNavigateTo} className="menu">
                    <i className="icon icon4"></i>
                    <span className="text">고객<br />센터</span>
                  </button>
                </li>
                <li className="cart">
                  <button id="/cart" onClick={handleNavigateTo} className="menu">
                    <i className="icon icon5"></i>
                    <span className="text">장바<br />구니</span>
                    {totalCartProductsTotalCount > 0 && (
                      <div className="shopNum">{totalCartProductsTotalCount}</div>
                    )}
                  </button>
                </li>
                <li>
                  <button onClick={handleToggleRecentProductsPopUp} className="menu">
                    <i className="thumb" style={{backgroundImage: recentViewProductsImg ? `url(${recentViewProductsImg})` : 'none'}}></i>
                    <span className="text">최근<br />상품</span>
                  </button>
                </li>
                </>
              )}
              </ul>
            </div>
          </div>
        )}

        <div className="container-gnb">
          <div className={`box-menu${menuOpen ? ' open' : '' }`}>
            <span className="menu" onClick={handleToggleMenu}>전체메뉴</span>
          </div>
          <div className="box-logo">
            <button type="button" onClick={handleNavigateToHome}>
              <span className="logo">{_mimCode === 'HQS' ? '대한항공 기내면세점' : ''}</span>
            </button>
          </div>
          <div className="box-gnb">
            <div className="menus">
              <ul>
              {hydrated
                ? menusGNB
                    ?.filter(x => x.menuUseYn === 'Y')
                    ?.map(
                      ({
                        // menuUrl: 7개가 초과되는 메뉴분에 대한 RedirectURL 필요함 [테스트용 주석 추가]
                        displaySeqNo,
                        displayTextColor,
                        displayTextSize,
                        displayTextWidth,
                        menuName,
                        menuNameEng,
                        menuUrl,
                        menuUseYn,
                      }) => {
                        const check = MAIN_MENUS.filter(
                          menu => menu.label === menuName,
                        )[0]?.path
                          ? MAIN_MENUS.filter(
                              menu => menu.label === menuName,
                            )[0]?.path
                          : menuUrl;

                        const checkReplace = check?.replace(
                          location.origin,
                          '',
                        );

                        const color = displayTextColor === 'B'
                        ? ' blue'
                        : displayTextColor === 'R'
                        ? ' red'
                        : displayTextColor === 'J'
                        ? ' green'
                        : '';
                        const size = displayTextSize === 'S'
                        ? ' small'
                        : ' big';
                        const weight = displayTextWidth === 'R'
                        ? ' normal'
                        : ' bold';

                        const active = displaySeqNo ===
                          parseInt(
                            window.localStorage.getItem(
                              'displaySeqNo',
                            ),
                          ) && router.asPath === checkReplace;
                        

                        return (
                          menuUseYn === 'Y' && (
                <li key={displaySeqNo} className={`gnb-style-set ${active ? 'active' : ''}`}>
                  <button id={
                    MAIN_MENUS.filter(
                      menu => menu.label === menuName,
                    )[0]?.path
                      ? MAIN_MENUS.filter(
                          menu => menu.label === menuName,
                        )[0]?.path
                      : menuUrl
                  } onClick={e => handleNavigateTo(e, displaySeqNo)} className={`btn${color}${size}${weight}`}>
                  {_language === enLangView() ? menuNameEng : menuName}
                  </button>
                </li>
                          )
                        );
                      },
                    )
                : null}
              </ul>
            </div>
          </div>
          {small ? (
            user ? (
              <div className="box-util">
                <Link href="/my-page"><a>마이페이지</a></Link>
                <span className="line"></span>
                <Link href="/cart"><a>장바구니</a></Link>
              </div>
            ) : (
              <div className="box-util">
                <button
                  onClick={() => {
                    if (isLoginPage) {
                      return;
                    } else if (!user && isMainPage) {
                      router.push('/login');
                    } else {
                      setIsOpenLoginModal(true);
                    }
                  }}
                >
                  로그인
                </button>
                <span className="line"></span>
                <Link href="/register/step1"><a>회원가입</a></Link>
              </div>
            )
          ) : (
            <>
              <div className="box-util">
                {user?.staff && (
                  <Link href="/employees-mall">
                    <a className="mall-link">임직원몰</a>
                  </Link>
                )}
                <button type="button" onClick={handleToggleFlightSearchModal} className="line-search">
                  <span className="text">고객님이 탑승하는 노선 선택</span>
                </button>

                {notificationPopup && (
                  <Inform
                    alarmList={alarmPropList}
                    alarmCount={alarmPropCount}
                    alarmCheckCount={alarmCheckCount}
                    setAlarmCheckCount={setAlarmCheckCount}
                    open={modalControl}
                    setOpen={setModalControl}
                    setNotificationPopup={setNotificationPopup}
                    alarmControl={{
                      setAlarmList: setAlarmList,
                      setAlarmCount: setAlarmCount,
                      alarmParams: alarmParams,
                      setAlarmParams: setAlarmParams,
                      alarmListSetting: alarmListSetting,
                    }}
                  />
                )}
              </div>
            </>
          )}
          {recentProductsPopup && (
            <RecentProducts
              // products={RECENT_PRODUCTS}
              recentViewProducts={recentViewProducts}
              remove={remove}
              setRecentViewProducts={setRecentViewProducts}
              setRecentProductsPopup={setRecentProductsPopup}
            />
          )}
          {isFlightSearchModalOpen ? (
            <FlightSearch
              small={small}
              handleToggleFlightSearchModal={handleToggleFlightSearchModal}
              // flightLocations={flightLocations}
              // isFlightSearchModalOpen={isFlightSearchModalOpen}
              handleCloseCurrentModal={setIsFlightSearchModalOpen}
              _theme={_theme}
            />
          ) : null}
          {menuOpen ? (
            <Menu
              small={small}
              handleToggleMenu={handleToggleMenu}
              currentCategoryId={currentCategoryId}
              sortedBrandsByCategory={sortedBrandsByCategory}
              handleChangeCurrentCategoryId={handleChangeCurrentCategoryId}
            />
          ) : null}
        </div>

      {loginNoticeControl && (
        <LoginModal
          modalControl={loginNoticeControl}
          setModalControl={setLoginNoticeControl}
        />
      )}

      {!isMainPage && isOpenLoginModal && (
        <LoginModal
          modalControl={isOpenLoginModal}
          setModalControl={setIsOpenLoginModal}
        />
      )}

      {login && <Inform open={modalControl} setOpen={setModalControl} />}
      </header>

      {/* 메인인 경우 공백 넣음 - 스크롤 시 메인배너 뷰 영역 확보 */}
      {isMainPage && small && <div className="MainNullSpace"></div>}

      {/* 주류전문관 경우 공백 넣음 - 스크롤 시 메인배너 뷰 영역 확보 */}
      {router.asPath === '/liquor-store' && small && <div className="MainNullSpace"></div>}
    </>
  );
}

const StyledTabs = styled(Tabs)`
  min-height: auto;
  .MuiTabs-indicator {
    display: block;
    height: 4px;
    bottom: 0px;
    background: ${({ $themeWhite, _theme }) =>
      $themeWhite ? _theme.color.primary.main : '#fff'};

    ${themeResponsive.device.layoutTablet} {
      min-height: auto;
      overflow: scroll !important;

      .MuiTabs-scroller {
        overflow: auto !important;

        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }
  button {
    font-family: 'Pretendard';
  }
  ${theme.device.responsive} {
    min-height: fit-content !important;
    button {
      min-width: auto;
      &.MuiTab-root {
        font-size: 1.8rem !important;
        padding: 0 1rem 0 1.5rem !important;
        margin: unset !important;
      }
      &.css-f25ymk {
        font-family: 'Pretendard';
        min-width: auto;
      }
    }
  }
`;

const StyledTab = styled(Tab)`
  ${({ theme }) => `
      font-family: 'Pretendard';
      padding: 1.2rem 0.3rem;
      margin:0 2.3rem;
      min-width:auto;
      font-size: 2rem;
      ${themeResponsive.device.layoutTablet} {
        font-size: ${theme.font.size.base} !important;
        padding: 0 1.5rem !important;
        margin: 0 auto;
      }
      ${theme.device.responsive} {
      }
 `};

  ${({ $small }) =>
    $small
      ? `
      height: 80px;
      color: #fff;
      ${themeResponsive.device.layoutTablet} {
        height: 56px;
      }
      `
      : `
      height: 60px;
      color: #fff;
      ${themeResponsive.device.layoutTablet} {
        min-height: 35px !important;
        height: 100%;
        padding-bottom: 1rem;
      }
 `}

  min-width: 20px !important;
  padding: 0 !important;
  margin: 0 16px !important;

  ${({ $active, color, $themeWhite }) =>
    $active &&
    `
    border-bottom: 4px solid ${color} !important;
    // border-width: 20% important;
    border-top: 4px solid ${$themeWhite ? '#FFFFFF' : '#00000000'} !important;
    font-weight: 800 !important;
    // font-family: Pretendard-ExtraBold !important;
    box-sizing:border-box !important;
    `}

  :hover {
    text-decoration: underline;
    text-underline-position: under;
    text-decoration-thickness: 1px;
    ${themeResponsive.device.layoutTablet} {
      text-decoration: none;
    }
  }
`;