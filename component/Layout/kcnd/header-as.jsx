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
    const languageOptionValue = e.target.getAttribute('langCode');
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
      {isLoading && <Loading />}
      {small && <WhiteBg />}
      <Bg
        themeWhite={themeWhite}
        themeBlack={themeBlack}
        small={small}
        _theme={_theme}
        // style={{ display: 'none' }}
      >
        <Wrapper small={small} ref={menuRef} menuOpen={menuOpen}>
          {small || (
            <Container small={small}>
              <InnerLeft small={small} search>
                <LogoContainer onClick={handleNavigateToHome}>
                  <LogoImage
                    src={
                      _mimCode === 'HQS'
                        ? themeWhite
                          ? `/assets/gnb/logo-black.svg`
                          : `/icons/gnb/logo-white.svg`
                        : themeWhite
                        ? `/assets/gnb/jinair-logo-color.webp`
                        : `/assets/gnb/jinair-logo-white.webp`
                    }
                    alt="logo"
                    width="100%"
                    height="100%"
                  />
                </LogoContainer>

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
                    <ExchangeRate search>
                      오늘의 환율 $1 = {exchangeRateRecoilState}원
                    </ExchangeRate>

                    <LangSelectBox
                      onClick={() => setShowOptions(prev => !prev)}
                    >
                      <button className="default-option">{_language}</button>
                      {showOptions && (
                        <ul className="option-box">
                          <li
                            value="ko"
                            langCode={krLangCode()}
                            className="option"
                            onClick={handleOnChangeSelectLanguageValue}
                          >
                            {krLangView()}
                          </li>
                          <li
                            value="en"
                            langCode={enLangView()}
                            className="option"
                            onClick={handleOnChangeSelectLanguageValue}
                          >
                            {enLangView()}
                          </li>
                        </ul>
                      )}
                    </LangSelectBox>
                  </>
                )}
              </InnerLeft>

              <InnerRight searchControl={searchControl}>
                <SubMenu id="/login" onClick={handleOnClickLogout}>
                  {user ? <MenuIconWrap01Login /> : <MenuIconWrap01 />}
                  {user ? (
                    <SubMenuTxt>
                      로그
                      <br />
                      아웃
                    </SubMenuTxt>
                  ) : (
                    <SubMenuTxt>
                      로그
                      <br />인
                    </SubMenuTxt>
                  )}
                </SubMenu>

                <SubMenu id="/my-page" onClick={handleOnClickMyInfo}>
                  <MenuIconWrap02 />
                  <SubMenuTxt>
                    나의
                    <br />
                    정보
                  </SubMenuTxt>
                </SubMenu>

                <SubMenu onClick={handleToggleNotificationPopUp}>
                  <MenuIconWrap03 />
                  {/* <NotificationNum notificationCount={notificationCount}>
                  {notificationCount}
                </NotificationNum> */}
                  {alarmCheckCount > 0 && <ShopNum>{alarmCheckCount}</ShopNum>}
                  <SubMenuTxt>
                    알림
                    <br />
                    보기
                  </SubMenuTxt>
                </SubMenu>
                <SubMenu id="/cs" onClick={handleNavigateTo}>
                  <MenuIconWrap04 />
                  <SubMenuTxt>
                    고객
                    <br />
                    센터
                  </SubMenuTxt>
                </SubMenu>

                <SubMenu id="/cart" onClick={handleNavigateTo}>
                  <MenuIconWrap05 />
                  {totalCartProductsTotalCount > 0 && (
                    <ShopNum>{totalCartProductsTotalCount}</ShopNum>
                  )}
                  <SubMenuTxt>
                    장바
                    <br />
                    구니
                  </SubMenuTxt>
                </SubMenu>

                <SubMenu onClick={handleToggleRecentProductsPopUp}>
                  <MenuIconWrap>
                  <span
                    style={{
                      display: 'block',
                      width: 30,
                      height: 30,
                      backgroundColor: '#fff',
                      borderRadius: '50%',
                      border: '1px solid grey',
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundImage: recentViewProductsImg ? `url(${recentViewProductsImg})` : 'none',
                    }}
                  />
                  </MenuIconWrap>
                  <SubMenuTxt>
                    최근
                    <br />
                    상품
                  </SubMenuTxt>
                </SubMenu>
              </InnerRight>
            </Container>
          )}

          <Container02 small={small}>
            <InnerLeftFlexEnd>
              <MenuIconContainer
                small={small}
                themeWhite={themeWhite}
                onClick={handleToggleMenu}
              >
                <Img
                  className={!themeWhite ? 'header-icon-filter' : ''}
                  src={
                    menuOpen
                      ? '/assets/icons/header-close-icon.svg'
                      : '/assets/icons/header-menu-icon.svg'
                  }
                  pc={{ width: '45px', height: '45px' }}
                />
              </MenuIconContainer>

              <LogoContainer2 onClick={handleNavigateToHome} small={small}>
                <LogoImage2
                  src={
                    _mimCode === 'HQS'
                      ? themeWhite
                        ? `/assets/gnb/logo-black.svg`
                        : `/icons/gnb/logo-white.svg`
                      : themeWhite
                      ? `/assets/gnb/jinair-logo-color.webp`
                      : `/assets/gnb/jinair-logo-white.webp`
                  }
                  alt="logo"
                />
              </LogoContainer2>
              <StyledTabs
                value={activeMainTabIndex}
                $themeWhite={themeWhite}
                _theme={_theme}
                sx={{
                  '& .MuiTabs-scroller': {
                    overflowX: 'auto !important',
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                  },
                }}
              >
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
                          //console.log('checkReplace', checkReplace)

                          const color =
                            displayTextColor === 'B'
                              ? '#5BA6D2'
                              : displayTextColor === 'R'
                              ? '#E1251B'
                              : displayTextColor === 'J'
                              ? '#BED600'
                              : themeWhite
                              ? '#000000'
                              : '#FFFFFF';

                          return (
                            menuUseYn === 'Y' && (
                              <StyledTab
                                $active={
                                  displaySeqNo ===
                                    parseInt(
                                      window.localStorage.getItem(
                                        'displaySeqNo',
                                      ),
                                    ) && router.asPath === checkReplace
                                }
                                color={color}
                                $themeWhite={themeWhite}
                                id={
                                  MAIN_MENUS.filter(
                                    menu => menu.label === menuName,
                                  )[0]?.path
                                    ? MAIN_MENUS.filter(
                                        menu => menu.label === menuName,
                                      )[0]?.path
                                    : menuUrl
                                }
                                key={displaySeqNo}
                                $small={small}
                                label={
                                  _language === enLangView()
                                    ? menuNameEng
                                    : menuName
                                }
                                $isNormalTextWidth={displayTextWidth === 'R'}
                                $isSmallTextSize={displayTextSize === 'S'}
                                sx={{
                                  '&.MuiTab-root': {
                                    color:
                                      displayTextColor === 'B'
                                        ? '#5BA6D2 !important'
                                        : displayTextColor === 'R'
                                        ? '#E1251B !important'
                                        : displayTextColor === 'J'
                                        ? '#BED600 !important'
                                        : themeWhite
                                        ? '#000'
                                        : '#FFF',
                                    fontSize:
                                      displayTextSize === 'S'
                                        ? '2rem !important'
                                        : '2.4rem !important',
                                    fontWeight:
                                      displayTextWidth === 'R'
                                        ? 'normal'
                                        : 'bold',
                                  },
                                }}
                                onClick={e => handleNavigateTo(e, displaySeqNo)}
                              />
                            )
                          );
                        },
                      )
                  : null}
              </StyledTabs>
            </InnerLeftFlexEnd>
            {small ? (
              user ? (
                <InnerRight small={small}>
                  <Link href="/my-page">
                    <InnerRightBorder
                      as="button"
                      padding="0 1rem 0 0"
                      style={{ color: themeWhite ? '#000' : '#FFF' }}
                    >
                      마이페이지
                    </InnerRightBorder>
                  </Link>
                  <Link href="/cart">
                    <Span
                      as="a"
                      display="inline-block"
                      mgl="1rem"
                      cursorPointer
                      style={{ color: themeWhite ? '#000' : '#FFF' }}
                    >
                      장바구니
                    </Span>
                  </Link>
                </InnerRight>
              ) : (
                <InnerRight small={small}>
                  <InnerRightBorder
                    as="button"
                    padding="0 1rem 0 0"
                    onClick={() => {
                      if (isLoginPage) {
                        return;
                      } else if (!user && isMainPage) {
                        router.push('/login');
                      } else {
                        setIsOpenLoginModal(true);
                      }
                    }}
                    style={{ color: themeWhite ? '#000' : '#FFF' }}
                  >
                    로그인
                  </InnerRightBorder>
                  <Link href="/register/step1">
                    <Span
                      as="a"
                      display="inline-block"
                      mgl="1rem"
                      style={{ color: themeWhite ? '#000' : '#FFF' }}
                      cursorPointer
                    >
                      회원가입
                    </Span>
                  </Link>
                </InnerRight>
              )
            ) : (
              <>
                <InnerRight>
                  {user?.staff && (
                    <Link href="/employees-mall">
                      <a className="MallLink">임직원몰</a>
                    </Link>
                  )}

                  <LineSearch onClick={handleToggleFlightSearchModal}>
                    고객님이 탑승하는 노선 선택
                    <Img
                      pc={{ width: '1.7rem', height: '1.7rem' }}
                      src={`/icons/gnb/arrow.svg`}
                      alt="arrow icon"
                      inlineBlock
                      ml="1.2rem"
                    />
                  </LineSearch>

                  <PlaneImage
                    onClick={() => handleToggleFlightSearchModal}
                    src={`/icons/gnb/${
                      _mimCode === 'HQS' ? '' : 'jin-'
                    }plane.png`}
                    alt="plane search"
                    width={60}
                    height={60}
                  />
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
                </InnerRight>

                {recentProductsPopup && (
                  <RecentProducts
                    // products={RECENT_PRODUCTS}
                    recentViewProducts={recentViewProducts}
                    remove={remove}
                    setRecentViewProducts={setRecentViewProducts}
                    setRecentProductsPopup={setRecentProductsPopup}
                  />
                )}
              </>
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
          </Container02>

          {menuOpen ? (
            <Menu
              small={small}
              handleToggleMenu={handleToggleMenu}
              currentCategoryId={currentCategoryId}
              sortedBrandsByCategory={sortedBrandsByCategory}
              handleChangeCurrentCategoryId={handleChangeCurrentCategoryId}
            />
          ) : null}
        </Wrapper>

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
      </Bg>

      {/* 메인인 경우 공백 넣음 - 스크롤 시 메인배너 뷰 영역 확보 */}
      {isMainPage && small && <MainNullSpace />}

      {/* 주류전문관 경우 공백 넣음 - 스크롤 시 메인배너 뷰 영역 확보 */}
      {router.asPath === '/liquor-store' && small && <MainNullSpace />}
    </>
  );
}

const MainNullSpace = styled.div`
  position: fixed;
  width: 100%;
  height: 165px;
  background: #fff;
`;

const WhiteBg = styled.div`
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 80px;
  background: transparent;
  ${theme.device.layoutTablet} {
    max-height: 56px;
  }
`;

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

const Bg = styled.div`
  top: 0;
  z-index: 1005;
  width: 100%;
  position: relative;
  height: 189px;
  background: linear-gradient(to bottom, #000, rgba(0, 69, 56, 0.26) 103%);
  transition: height 300ms ease-out;

  ${({ small }) =>
    small &&
    `
      position: sticky;
      top:0px;
      height:80px;
      transition: background 300ms ease-out;
      ${themeResponsive.device.layoutTablet} {
        max-height: 56px;
      }
    `}
  ${({ themeBlack, _theme }) => {
    if (themeBlack) {
      return css`
        opacity: 1;
        background: ${_theme.color.primary.main};
      `;
    }
  }}
  ${({ themeWhite }) => {
    if (themeWhite) {
      return css`
        opacity: 1;
        background: #fff;
        border-bottom: 1px solid #ddd;
        ${InnerLeft} {
          color: #000;
        }
        ${LangSelectBox} {
          .default-option {
            color: #000;
            background-image: url('/assets/gnb/icon-arrow-select-filled-bk.svg');
          }
        }
        ${ExchangeRate} {
          border-color: #999;
        }
        ${StyledTab} {
          color: #000;
        }
        ${Search} input {
          color: #000;
          border-color: #000;
        }
        ${MenuIconWrap01} {
          background-image: url('/icons/gnb/icon-submenu-1-black.svg');
        }
        ${MenuIconWrap01Login} {
          background-image: url('/assets/gnb/icon-logout.svg');
        }
        ${MenuIconWrap02} {
          background-image: url('/icons/gnb/icon-submenu-2-black.svg');
        }
        ${MenuIconWrap03} {
          background-image: url('/icons/gnb/icon-submenu-3-black.svg');
        }
        ${MenuIconWrap04} {
          background-image: url('/icons/gnb/icon-submenu-4-black.svg');
        }
        ${MenuIconWrap05} {
          background-image: url('/icons/gnb/icon-submenu-5-black.svg');
        }
        ${StyledTab} {
          &.under {
            &:before {
              background-color: #000;
            }
          }
        }
        // & .MuiTabs-indicator {
        //   background-color: #000;
        // }
        ${InnerRight} {
          color: #000;
        }
        ${InnerRightBorder} {
          border-color: #000;
        }
      `;
    }
  }}

  .MallLink {
    ${({ theme }) => {
      return css`
        font-family: 'PretendardSemiBold';
        align-self: flex-start;
        display: inline-block;
        width: 8.1rem;
        color: ${theme.color.primary.fontWhite};
        line-height: 4.3rem;
        text-align: center;
        border: 1px solid ${theme.color.primary.fontWhite};
        border-radius: 21.5px;
        margin-right: 1.2rem;
        margin-top: 0.3rem;
        /* background: url('/assets/gnb/icon-storefront.svg') no-repeat left center /
          2.3rem; */
        cursor: pointer;
        ${({ themeWhite }) => {
          if (themeWhite) {
            return css`
              color: ${theme.color.common.black};
              border-color: #5b6768;
            `;
          }
        }}
        ${themeResponsive.device.responsive} {
          display: none;
        }
      `;
    }}
    ${theme.device.layoutTablet} {
      display: none;
    }
  }
  //반응형 작업 추가 ----
  /* overflow: hidden; */
  ${themeResponsive.device.tablet} {
    padding-top: 10px;
  }
  ${themeResponsive.device.layoutTablet} {
    // min-width: 375px;
    height: 84px;
    width: 100%;
  }
  ${themeResponsive.device.responsive} {
    .pc {
      display: none;
    }
    width: 100%;
  }

  & .header-icon-filter {
    filter: invert(1);
  }
`;

const Wrapper = styled.div`
  position: relative;
  max-width: 1680px;
  width: 100%;
  margin: auto;
  padding-top: 20px;

  ${themeResponsive.device.layoutTablet} {
    /* min-width: 375px; */
    width: auto;
    height: 8.4rem;
    padding: 0;
    max-width: none;
  }
  @media screen and (max-width: 1745px) and (min-width: 1300px) {
    padding-left: 25px;
    padding-right: 25px;
  }
  ${({ small }) =>
    small &&
    `
    padding-top: 0;
    ${themeResponsive.device.layoutTablet} {
    padding: 0;
  }
  `};
`;
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  ${themeResponsive.device.layoutTablet} {
    &:first-child {
      padding: 0 1.5rem;
      width: 100%;
      align-items: center;
    }
    &:last-child {
      &::-webkit-scrollbar {
        display: none;
      }
    }
    ${({ small }) =>
      small
        ? `
    padding: 0 0 0 1.5rem !important;
    `
        : `
    margin-bottom: 0.3rem
    `};
  }
  ${({ small }) =>
    small
      ? `
    margin-bottom: 1rem
    `
      : `
    margin-bottom: 2.6rem
    `};
  ${themeResponsive.device.responsive} {
    &:first-child {
      padding-top: 1.2rem;
      margin-bottom: 0.8rem;
    }
  }
`;
const Container02 = styled(Container)`
  margin-bottom: 0;
`;
const MenuIconContainer = styled.div`
  display: flex;
  padding: 10px 0;
  justify-content: center;
  align-items: center;
  margin-right: 30px;
  transition: all 300ms;
  img {
    cursor: pointer;
  }
  ${({ small }) =>
    small &&
    `
    margin-right: 4rem;
    width: 4rem;
    height: 4rem;
    padding: 0;
    // background-image: url(/assets/gnb/logo-white.svg);
    // background-size: cover;
    // > .MuiSvgIcon-fontSizeMedium {
    //   display: none;
    // }
  ${themeResponsive.device.layoutTablet} {
    min-width: 6.27rem;
    width: 6.27rem;
    height: 2.8rem;
    margin: 0;
    justify-content: flex-start;
  }

  `};
  img {
    width: 100%;
  }
  ${themeResponsive.device.layoutTablet} {
    display: none;
    /* ${({ small }) =>
      small &&
      `
    display: flex;
    `} */
  }
`;
const MenuIconBtn = styled.button`
  background-image: url('/icons/gnb/temp-menu.svg');
  background-position: center;
  background-size: cover;
  width: 3.4rem;
  height: 2.4rem;
`;
const InnerLeft = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  ${themeResponsive.device.layoutTablet} {
    min-width: auto;
    width: 100%;
    justify-content: space-between;
    gap: 2rem;
    /* > .MuiSvgIcon-fontSizeMedium {
      display: none;
    } */
  }
  ${theme.device.responsive} {
    gap: 1rem;
  }

  width: auto;

  ${({ search }) =>
    search &&
    `
      width: 100%;
    `};
`;

const InnerLeftFlexEnd = styled(InnerLeft)`
  justify-content: space-between;

  ${themeResponsive.device.layoutTablet} {
    align-items: center;
    justify-content: flex-start;
  }
`;
const InnerRight = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  // color: #fff;
  // a {
  //   color: inherit;
  // }

  ${({ small }) =>
    small &&
    `
  ${themeResponsive.device.layoutTablet} {
      display: none;
    }
  `};
  ${theme.device.responsive} {
    ${({ searchControl }) => searchControl && `${SubMenu}{display:none;}`}
  }
`;
const InnerRightBorder = styled(Span)`
  border-right: 1px solid #fff;
  cursor: pointer;
  ${({ themeWhite }) => {
    if (themeWhite) {
      return css`
        border-color: #000;
      `;
    }
  }};
`;

const Icon = styled(Image)`
  cursor: pointer;
`;

const IconWrap = styled.div`
  position: absolute;
  top: 50%;
`;

const ExchangeRate = styled.div`
  display: flex;
  align-items: center;
  margin-left: 14px;
  font-size: 1.2rem;
  line-height: 1.6rem;
  padding-right: 9px;
  border-right: 1px solid #fff;
  border-color: rgba(255, 255, 255, 0.2);
  margin-top: 1rem;
  ${themeResponsive.device.layoutTablet} {
    display: none;
  }
  ${({ search }) =>
    search &&
    `
      // max-width: 15.2rem;
      min-width: 133px;
      
    `};
`;

const LangSelect = styled.select`
  height: 30px;
  margin-left: 8px;
  background-color: transparent;
  background: url('/assets/gnb/icon-arrow-select-filled.svg') no-repeat 95%
    center / 6px;
  color: #fff;
  border: none;
  outline: none;
  font-size: 11px;
  padding-right: 1rem;
  margin-top: 1rem;
  cursor: pointer;
  option {
    color: #000;
  }
`;
const LogoContainer = styled.div`
  margin-right: 30px;
  ${themeResponsive.device.responsive} {
    margin-right: 0;
    flex-shrink: 0;
  }
`;
const LogoContainer2 = styled(LogoContainer)`
  display: none;
  ${({ small }) =>
    small &&
    `
      display: block;
      margin-right: 1rem;
      cursor:pointer
    `}
`;
const LogoImage = styled.img`
  min-width: 140px;
  height: 62.5px;
  cursor: pointer;
  object-fit: contain;
  ${themeResponsive.device.layoutTablet} {
    min-width: auto;
    width: 62.7px;
    height: 28px;
  }
`;
const LogoImage2 = styled.img`
  max-width: 6.27rem;
  height: 4rem;
  cursor: pointer;
  object-fit: contain;
`;
const Search = styled.div`
  align-self: flex-end;
  margin-bottom: 1.5rem;
  width: 365px;
  transition: all 0.5s ease;
  ${themeResponsive.device.layoutTablet} {
    margin-bottom: 0;
    width: fit-content;
  }

  input {
    min-width: 320px;
    width: 100%;
    height: 30px;
    color: #fff;
    background-color: transparent;
    border: 0;
    border-bottom: 2px solid #fff;
    color: #fff;
    box-shadow: none;
    ::placeholder {
      color: #999;
      font-size: 14px;
    }
    :focus {
      outline: none;
      width: 100%;
      opacity: 1;
      visibility: visible;
    }

    ${themeResponsive.device.layoutTablet} {
      display: none;
    }
    transition: all 0.5s ease;
  }
  display: flex;
  align-items: center;

  ${({ searchControl }) =>
    searchControl &&
    `
      width: 100%;
      input {
        width: 100%;
      }
    `};

  ${theme.device.responsive} {
    position: relative;
    width: 100%;
    input {
      display: block;
      width: 0;
      min-width: auto;
      padding: 0;
      opacity: 0;
      padding-right: 0;
    }
    input:focus {
      padding-right: 33px;
    }
    ${({ searchControl }) =>
      searchControl &&
      `
      input {
        width:100%;
        opacity:1;
        visibility: visible;
        border-width: 1px;
      }
    `};
  }
`;
const SearchBtn = styled.button`
  vertical-align: bottom;
  margin-left: 0.7rem;
  ${themeResponsive.device.layoutTablet} {
    padding: 0.5rem;
  }

  ${theme.device.responsive} {
    position: absolute;
    right: 0;
    top: 50%;
    margin-left: 0;
    transform: translateY(-50%);
  }
`;
const SearchBtnImg = styled(SearchBtn)`
  display: none;
  ${theme.device.responsive} {
    display: block;
    z-index: 1;
    right: 0;
    opacity: 1;
    cursor: pointer;
  }
`;
const LineSearch = styled.button`
  width: 269px;
  max-height: 4.3rem;
  font-family: 'PretendardSemiBold';
  text-align: left;
  margin-right: -30px;
  padding: 1rem 2rem 1rem 2.2rem;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.16);
  border-radius: 100px;
  border: solid 1px #5b6768;
  color: #000;
  background-color: #f7f7f7;
  transform: translatey(-10px);
  outline: 0;
  ::placeholder {
    color: #000;
    font-size: 16px;
    font-weight: 600;
  }
  ${themeResponsive.device.layoutTablet} {
    display: none;
  }
`;
const PlaneImage = styled.img`
  position: relative;
  width: 60px;
  transform: translatey(-10px);
  cursor: pointer;
  ${themeResponsive.device.layoutTablet} {
    display: none;
  }
`;

const ModalBox = styled(Modal)`
  display: flex;
  width: ${props => props.width || ''};
  height: ${props => props.height || ''};
  text-align: center;
  align-items: center;
`;

const SubMenu = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 8rem;
  padding: 5px;
  border-radius: 1rem;
  margin-right: 1rem;
  cursor: pointer;
  ${themeResponsive.device.layoutTablet} {
    height: 100%;
    margin-right: 0;
    padding: 0;
    margin-left: 3px;
  }
  &:nth-child(-n + 4) {
    ${themeResponsive.device.layoutTablet} {
      display: none;
    }
  }
  &:last-child {
    margin-right: 0;
    ${themeResponsive.device.layoutTablet} {
      display: none;
    }
  }
  &:hover {
    background-color: #fff;
    ${themeResponsive.device.layoutTablet} {
      background-color: transparent;
    }
  }
  ${theme.device.responsive} {
    & span {
      display: none;
    }
  }
`;
const SubMenuTxt = styled.span`
  position: absolute;
  bottom: 5px;
  font-size: 12px;
  line-height: 14px;
  color: #000;
  font-family: 'PretendardBold';
  text-align: center;
  opacity: 0;
  ${SubMenu}:hover & {
    opacity: 1;
    ${themeResponsive.device.layoutTablet} {
      opacity: 0;
    }
  }
`;
const MenuIconWrap = styled.div`
  position: relative;
  top: 50%;
  width: 3rem;
  height: 3rem;
  background: no-repeat center / 100%;
  transform: translateY(-50%);
  ${themeResponsive.device.layoutTablet} {
    width: 3.4rem;
    height: 3.4rem;
    top: 0;
    transform: translateY(0);
  }
  /* transition: 0.2s; */
  ${SubMenu}:hover & {
    top: 0;
    transform: translateY(0);
    ${themeResponsive.device.layoutTablet} {
      top: 0;
      transform: translateY(0);
    }
  }
  ${theme.device.responsive} {
    width: 2.4rem;
    height: 2.4rem;
    ${SubMenu}:hover & {
    }
  }
`;
const MenuIconWrap01 = styled(MenuIconWrap)`
  background-image: url('/icons/gnb/icon-submenu-1.svg');
  ${SubMenu}:hover & {
    background-image: url('/icons/gnb/icon-submenu-1-black.svg');
  }
`;
const MenuIconWrap01Login = styled(MenuIconWrap)`
  background-image: url('/assets/gnb/icon-logout-w.svg');
  ${SubMenu}:hover & {
    background-image: url('/assets/gnb/icon-logout.svg');
  }
`;
const MenuIconWrap02 = styled(MenuIconWrap)`
  background-image: url('/icons/gnb/icon-submenu-2.svg');
  ${SubMenu}:hover & {
    background-image: url('/icons/gnb/icon-submenu-2-black.svg');
  }
`;
const MenuIconWrap03 = styled(MenuIconWrap)`
  background-image: url('/icons/gnb/icon-submenu-3.svg');
  ${SubMenu}:hover & {
    background-image: url('/icons/gnb/icon-submenu-3-black.svg');
  }
`;
const MenuIconWrap04 = styled(MenuIconWrap)`
  background-image: url('/icons/gnb/icon-submenu-4.svg');
  ${SubMenu}:hover & {
    background-image: url('/icons/gnb/icon-submenu-4-black.svg');
  }
`;
const MenuIconWrap05 = styled(MenuIconWrap)`
  background-image: url('/icons/gnb/icon-submenu-5.svg');
  ${SubMenu}:hover & {
    background-image: url('/icons/gnb/icon-submenu-5-black.svg');
  }
  ${themeResponsive.device.layoutTablet} {
    background-image: url('/icons/gnb/icon-submenu-5.svg');
  }
  ${theme.device.responsive} {
    background-image: url('/icons/gnb/icon-submenu-5.svg');
    transform: translateY(0);
    top: 0;
    ${SubMenu}:hover & {
      background-image: url('/icons/gnb/icon-submenu-5-black.svg');
    }
  }
`;
const LangSelectBox = styled.section`
  position: relative;
  .default-option {
    height: 30px;
    background: url('/assets/gnb/icon-arrow-select-filled.svg') no-repeat 95%
      center / 6px;
    font-size: 11px;
    padding: 5px 2rem 5px 8px;
    margin-top: 1rem;
    cursor: pointer;
  }
  .option-box {
    /* display: none; */
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: #fff;
    transform: translateY(100%);
  }
  .option {
    font-size: 1.1rem;
    color: #000;
    padding: 5px;
    cursor: pointer;
    &:hover {
      background-color: rgba(91, 166, 210, 0.1);
    }
  }
  ${themeResponsive.device.layoutTablet} {
    display: none;
  }
`;
const SelectBox2 = styled(SelectBox)`
  margin-top: 10px;
`;
const ShopNum = styled.div`
  position: absolute;
  top: 20px;
  right: 5px;
  min-width: 14px;
  height: 14px;
  font-size: 9px;
  color: #fff;
  text-align: center;
  border-radius: 20px;
  padding: 0 3px;
  background-color: #e0003f;
  ${SubMenu}:hover & {
    top: 0px;
  }

  justify-content: center;
  align-items: center;
  ${themeResponsive.device.layoutTablet} {
    display: flex;
    top: 0px;
    right: 0px;
  }
  ${theme.device.responsive} {
    top: -1px;
    right: 0;
  }
`;

const NotificationNum = styled(ShopNum)`
  ${({ notificationCount }) => `
${
  notificationCount > 0 &&
  `display:flex; top:20px; height:19px; width:19px; font-size:1.5rem;`
}`}
`;
