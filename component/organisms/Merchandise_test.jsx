import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styled, { css } from 'styled-components';
import { useMediaQuery } from '@mui/material';
import theme from 'styles/theme';

import {
  getRestockedBrandName,
  getRestockedProductImgUrl,
  getRestockedProductName,
  getRestockItemId,
  restockModalOpenHandler,
} from 'atoms/restock';
import { parseToUSD, parseToKRW, getDecimalPoint } from 'utils';

import Div from 'components/atoms/Div';
import Span from 'components/atoms/Span';
import Img from 'components/atoms/Img';
import LoginModal from 'components/views/loginView/modal';
import { orderCartItemsAPI } from 'lib/api/order';
import {
  addProductToWishList,
  getProductOptionsInfoAPI,
} from 'lib/api/product';
import { currentUser } from 'atoms/user';
import { exchangeRateGlobalState, mimCode } from 'atoms/app';

import ProductModal from 'pages/publish/ProductModal';
import { createPortal } from 'react-dom';
import AdultOnlyModal from 'pages/publish/AdultOnlyModal';
import Labels from 'components/atoms/Labels';
import NotMembershipAccPopup from '../atoms/NotMembershipAccPopup';
import { langChkEng, langCode } from '../../lib/api';
import { nonMemberClickUrl } from 'atoms/nonMemberInfoCheck';
import Modal09 from "../views/loginView/popup/Modal09";
import useResponsiveDeviceWidth from 'hooks/useResponsiveDeviceWidth';

export default function Merchandise({
  imageLabelDisabler = false, // 이미지 라벨 숨김값  false이면 보임 true이면 숨김
  isSearchResult,
  banHover = false,
  w,
  height = '42rem',
  fontSize = '1.5rem',
  viewType,
  mainFontSize,
  imageLabel,
  rank,
  product,
  index,
  isAllRank,
  isFromLiquor,
  setIsShowNotMembershipAccPopup = '',
  mypage,
  wish,
  empStat,
  employeeDiscountCheck,
  ...rest
}) {
  const exchangeRate = useRecoilValue(exchangeRateGlobalState);
  const _mimCode = useRecoilValue(mimCode);
  const [_nonMemberClickUrl, setNonMemberClickUrl] =
    useRecoilState(nonMemberClickUrl);

  const systemLabels = [
    (product?.couponLabel === 'Y' || product?.labels?.systemLabels?.filter(t=>t.title === "쿠폰").length > 0 ) && {
      id: '쿠폰',
      title: '쿠폰',
      koreanImagePath: null,
      englishImagePath: null,
    },
    product?.onDiscount === 'Y' && {
      id: '세일',
      title: '세일',
      koreanImagePath: null,
      englishImagePath: null,
    },
    product?.hotDealLabel === 'Y' && {
      id: '핫딜',
      title: '핫딜',
      koreanImagePath: null,
      englishImagePath: null,
    },
    product?.sellCount < product?.soldOutCount && {
      id: '품절임박',
      title: '품절임박',
      koreanImagePath: null,
      englishImagePath: null,
    },
  ];
  const productInfo = isSearchResult
    ? {
        adultOnly: product?.adultOnlyYn === 'Y',
        backOrdered:
          product?.isSoldOut == 'Y' && product?.productResponseDto?.restockAlarmCheck === 0,
        brandInfo: {
          brandId: product?.brandId,
          brandName: product?.brandNameKo,
        },
        categoryId: product?.ctgrId,
        id: product?.kalPrdtCode,
        isSoldOut: product?.isSoldOut === 'Y',
        // isWish: '',
        labels: {
          labels: product?.labels?.split(',')?.map(item => ({
            id: item,
            title: item,
            koreanImagePath: null,
            englishImagePath: null,
          })),
          imageLabels: [
            // TODO: labels에서 skyshopExclusive
            product?.labels
              ?.split(',')
              ?.find(item => item === 'skyshop exclusive')
              ? {
                  id: 'skyshop exclusive',
                  title: 'skyshop exclusive',
                  koreanImagePath: null,
                  englishImagePath: null,
                }
              : null,
          ],

          // systemLabels: [],
          systemLabels: systemLabels?.filter(item => item),
        },
        price: {
          byCurrency: {
            krw:
              exchangeRate !== 1 &&
              product?.sellPrice * parseInt(exchangeRate?.split(',')?.join('')),
            usd: product?.sellPrice,
          },
          discountRate: product?.discountRate,
          onDiscount: product?.onDiscount === 'Y',
          originPrice: product?.prdtPrice,
        },
        productImageUrl: product?.prdtImagePath,
        productName: product?.prdtNameKo,
        // productSetCheck: product?.prdtSetYn !== '0',
        productSetCheck: () => {
          if (product?.prdtSetYn === '0') {
            return '일반상품';
          }
          if (product?.prdtSetYn === '1') {
            return '묶음상품';
          }
          if (product?.prdtSetYn === '3') {
            return '세트상품';
          }
        },
        sellPossibleCount: product?.sellCount,
      }
    : {
        ...product,
        backOrdered:
          (product?.isSoldOut || product?.isOptionSoldOut || (product?.sellStat && product?.sellStat != 0)) &&
          product?.productResponseDto?.restockAlarmCheck === 0,
      };

  const isMob = useResponsiveDeviceWidth();
  const router = useRouter();
  let user = useRecoilValue(currentUser);
  let isEmployeeUser;
  if(wish){
    isEmployeeUser = user?.staff && (empStat === '0' || empStat === '2') && employeeDiscountCheck === 'N'
  }else{
    isEmployeeUser = user?.staff && (product?.empStat === '0' || product?.empStat === '2') && product?.employeeDiscountCheck === 'N'
  }
  //로그인을했지만 미성년을 테스트 하려면 아래 주석 제거
  // if(user?.adult){
  //   user = {...user, adult:false}
  // }
 

  const [isHeart, setIsHeart] = useState(false);

  const [isMouseHover, setIsMouseHover] = useState(false);
  const [isOpenWarningAdultProductModal, setIsOpenWarningAdultProductModal] =
    useState(false);
  const [isOpenAdultAuthModel, setIsOpenAdultAuthModel] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [
    isShowNotMembershipAccPopupMerchandise,
    setIsShowNotMembershipAccPopupMerchandise,
  ] = useState(false);

  useEffect(() => {
    !isOpenWarningAdultProductModal && setNonMemberClickUrl('');
  }, [isOpenWarningAdultProductModal, setNonMemberClickUrl]);

  // TODO: 상품정보에 category 정보 없음
  // 수정이 필요할 수 있음

  const handleOnMouseEnter = () => {
    setIsMouseHover(true);
  };

  const handleOnMouseLeave = () => {
    setIsMouseHover(false);
  };

  const handleOnClickCover = e => {
    //네이버 계정을 위해서 우선순위1로 로그인을 했고 ,ageVerifyYn이 false인경우
    if(productInfo?.sellStat && productInfo?.sellStat != 0){
      alert("해당 상품은 일시품절입니다.");
      return;
    }
    if(productInfo?.adultOnly && user && !user?.ageVerifyYn){
      setIsOpenAdultAuthModel(true);
      return;
    }

    //로그인을 했지만 19세가 아닌경우
    if (productInfo?.adultOnly && (!user?.adult || !user)) {
        setIsOpenWarningAdultProductModal(true);
        let recopicLink = null;
        recopicLink = product?.clicklogRedirectLink;

        setNonMemberClickUrl(
          recopicLink
            ? recopicLink
            : `/products/${productInfo?.id}/${
              isFromLiquor ? isFromLiquor : ''
            }?qna=1&reviews=1`,
        );
        return;
    }

    handleOnClickIconBg(e);
  };

  const handleOnClickIconBg = e => {
    if (e.target.dataset.id === 'functional-button') return;

    navigateToProductDetailPage();
  };

  const navigateToProductDetailPage = () => {
    let recopicLink = null;
    try {
      recopicLink = product?.clicklogRedirectLink;
    } catch (error) {}

    if (recopicLink) {
      // alert(
      //   '[개발형상]함께본 상품 클릭시 레코픽과 연결되어 있습니다. 현재 레코픽(3394)은 ASIS 상품상세보기 운영으로 리턴됩니다.(함께본상품->레코픽 데이터누적--(레코픽에서 실행함)-->상품상세보기), 이 경고내용이 필요 없다면 이철주 개발자에게 문의하세요!',
      // );
      router.push(recopicLink);
    } else {
      router.push(
        `/products/${productInfo?.id}/${
          isFromLiquor ? isFromLiquor : ''
        }?qna=1&reviews=1`,
      );
    }
  };

  const fallbackImageMerchandise = '/images/blank.png'

  return (
    <>
      {isShowNotMembershipAccPopupMerchandise && (
        <NotMembershipAccPopup
          modalControl={isShowNotMembershipAccPopupMerchandise}
          setModalControl={setIsShowNotMembershipAccPopupMerchandise}
          setParentModalControl={false} //모달창에서 호출 시에 정회원 전환 버튼 클릭 시 모달닫기 기능 제공을 위한 현재 모달 노출 상태값
        />
      )}
      {typeof window !== 'undefined' && isLoginModalOpen
        ? createPortal(
            <LoginModal
              modalControl={isLoginModalOpen}
              setModalControl={setIsLoginModalOpen}
            />,
            document.body,
          )
        : null}

      {typeof window !== 'undefined' && isOpenWarningAdultProductModal
        ? createPortal(
            <AdultOnlyModal
              setModalControl={setIsOpenWarningAdultProductModal}
              modalControl={isOpenWarningAdultProductModal}
              user={user}
            />,
            document.body,
          )
        : null}

      {typeof window !== 'undefined' && isOpenAdultAuthModel
        ? createPortal(
            <Modal09
              setCheckModal09={setIsOpenAdultAuthModel}
              checkModal09={isOpenAdultAuthModel}
              user={user}
            />,
            document.body,
          )
        : null}

      {typeof window !== 'undefined' && isConfirmationModalOpen
        ? createPortal(
            <ProductModal
              setModalControl={setIsConfirmationModalOpen}
              modalControl={isConfirmationModalOpen}
              product={productInfo}
              isGift={isGift}
            />,
            document.body,
          )
        : null}

      <Bg {...rest} mypage={mypage} className={`merchandise-item${mypage ? ' mypage' : ''} ${viewType ? viewType : ''}`}>
        <div className="image-box">
          <div className="thumb-box" onClick={handleOnClickCover} onMouseEnter={handleOnMouseEnter}>
            <div className="thumb">
              {/*19세 상품 + 로그인 + 19세이하 */}
              {productInfo?.adultOnly && user && !user?.adult ? (
                <Img
                  pc={{ width: '90%', height: '100%' }}
                  objectFit="contain"
                  src={'/images/19.png'}
                  alt="연령 제한 상품"
                  center
                />
              ) : (
                <Img
                  pc={{ width: '100%', height: '100%' }}
                  objectFit="contain"
                  src={productInfo?.productImageUrl || fallbackImageMerchandise}
                  alt={langChkEng()
                    ? productInfo?.productNameEn === null
                      ? productInfo?.productName
                      : productInfo?.productNameEn
                    : productInfo?.productName}
                  center
                  className={productInfo?.adultOnly && !user? "adult" : null}
                />
              )}
            </div>
          </div>
          {!imageLabelDisabler && (imageLabel === 'only-today' || imageLabel === 'only-hotdeal') && (
          <div className="label-box">
            <Img
              src={`/assets/icons/${
                _mimCode === 'HQS' ? '' : 'jinair/'
              }icon-onlyfortoday.svg`}
              pc={{ width: '80px', height: '80px' }}
              responsive={{ width: '40px', height: '40px' }}
              alt={imageLabel === 'only-today' ? '단하루' : '핫딜'}
            />
            <span className="label">{imageLabel === 'only-today' ? '단하루' : '핫딜'}</span>
          </div>
          )}

          {!imageLabelDisabler &&
            imageLabel === 'rank' &&
            index < 20 &&
            !isAllRank && (
            <div className="rank-box">
              <div className="rank">
                <div className="img-setting">
                <Img
                  src={`/assets/icons/${
                    _mimCode === 'HQS' ? '' : index < 4 ? 'jinair/' : ''
                  }icon-flag-${index + 1}.svg`}
                  pc={{ width: '40px', height: '50px' }}
                  responsive={{ width: '28px', height: '32px' }}
                  alt={`product-rank-${rank}`}
                />
                </div>
              </div>
            </div>
            )}
          {!imageLabelDisabler && imageLabel === 'rank' && isAllRank && (
          <div className="rank-box">
            <div className="img-setting">
            <Img
              src={
                index < 4
                  ? `/assets/icons/${
                      _mimCode === 'HQS' ? '' : 'jinair/'
                    }icon-flag-${index + 1}.svg`
                  : `/assets/icons/icon-flag-gray.svg`
              }
              pc={{ width: '40px', height: '50px' }}
              responsive={{ width: '28px', height: '32px' }}
              alt={`product-rank-${rank}`}
            />
            </div>
            {index + 1 > 4 && index + 1 < 10 && (
              <span className="label">{index + 1}</span>
            )}
            {index + 1 > 9 && <span className="label">{index + 1}</span>}
          </div>
          )}
          <div className={`other-label-box ${imageLabel ==='rank' ? 'rank' : ''}`}>
            {!imageLabelDisabler &&
            imageLabel !== 'only-today' &&
            imageLabel !== 'only-hotdeal' &&
            productInfo?.labels?.imageLabels?.length > 0 &&
            productInfo?.labels?.imageLabels[0]?.id !== null &&
            (
            <div className="img-setting">
              <Img
                src={(productInfo?.labels?.imageLabels[0] && langChkEng()) ? productInfo?.labels?.imageLabels[0]?.englishImagePath : productInfo?.labels?.imageLabels[0]?.koreanImagePath}
                pc={{ width: '108px', height: '52px' }}
                height100
                responsive={{ width: '67px', height: '31px' }}
                alt={`product-rank-${rank}`}
              />
            </div>
            ) }
          </div>

          {isMob || banHover ? null :
            //19세 상품 + 로그인했지만 + 19세 이하 = 호버 X
            productInfo?.adultOnly && user && !user?.adult ? null :
              (
            <div 
              className={`cover-box${isMouseHover ? 'hover' : ''}`}
              onMouseLeave={handleOnMouseLeave}
              onClick={handleOnClickCover}
            >
              <ProductHoverLayout
                _mimCode={_mimCode}
                id={productInfo?.id}
                product={productInfo}
                user={user}
                // TODO:수정 필요
                isLiquor={productInfo?.adultOnly}
                adultOnly={productInfo?.adultOnly}
                backOrdered={productInfo?.backOrdered}
                isSoldOut={productInfo?.isSoldOut}
                setIsHeart={setIsHeart}
                fontSize={fontSize}
                isLoginModalOpen={isLoginModalOpen}
                setIsLoginModalOpen={setIsLoginModalOpen}
                setIsOpenWarningAdultProductModal={
                  setIsOpenWarningAdultProductModal
                }
                setIsConfirmationModalOpen={setIsConfirmationModalOpen}
                setIsGift={setIsGift}
                setIsShowNotMembershipAccPopup={setIsShowNotMembershipAccPopup}
                setIsShowNotMembershipAccPopupMerchandise={
                  setIsShowNotMembershipAccPopupMerchandise
                }
              />
            </div>
          )}
        </div>
        <div className="info-box">
          <div className="brand">
            {productInfo?.brandInfo?.brandName || productInfo?.brandName}
          </div>
          <div className="name" onClick={handleOnClickCover}>
            {langChkEng()
              ? productInfo?.productNameEn === null
                ? productInfo?.productName
                : productInfo?.productNameEn
              : productInfo?.productName}
            {/* {productInfo?.productName} */}
          </div>
          <ProductPrice
            price={productInfo.price ? productInfo.price : []}
            isEmployeeUser={isEmployeeUser}
            exchangeRate={exchangeRate}
          />
          <Labels
            manualLabels={productInfo?.labels?.labels}
            systemLabels={productInfo?.labels?.systemLabels}
            isCouponPossible={product?.isCouponPossible}
            fontSize={fontSize}
            adultOnly={product?.adultOnly}
          />
        </div>
      </Bg>
    </>
  );
}

const ProductPrice = ({ price, isEmployeeUser, exchangeRate }) => {
  const { onDiscount, discountRate, byCurrency, originPrice, byEmpCurrency, empFinalDsctRate } = price;
  const adjustedExchangeRate = exchangeRate !== 1 ? Number(exchangeRate.replace(",","")) : exchangeRate;
  return (
    <div className="price-info">
      {(onDiscount || isEmployeeUser) && (
        <>
          <div className="discount">{isEmployeeUser ? `${empFinalDsctRate}%` : discountRate}</div>
          <div className="origin">{parseToUSD(originPrice)}</div>
        </>
      )}
      <div className="price">
        <strong>{getDecimalPoint(isEmployeeUser ? (byEmpCurrency?.krw ?? byEmpCurrency?.KRW) / adjustedExchangeRate : (byCurrency?.krw ?? byCurrency?.KRW) / adjustedExchangeRate)}</strong>
        ({parseToKRW(isEmployeeUser ? (byEmpCurrency?.krw ?? byEmpCurrency?.KRW) : (byCurrency?.krw ?? byCurrency?.KRW))})
      </div>
    </div>
  );
};

const ProductHoverLayout = ({
  _mimCode,
  id,
  product,
  fontSize,
  isLiquor,
  user,
  isLoginModalOpen,
  setIsLoginModalOpen,
  setIsConfirmationModalOpen,
  setIsOpenWarningAdultProductModal,
  setIsGift,
  backOrdered,
  setIsShowNotMembershipAccPopup,
  setIsShowNotMembershipAccPopupMerchandise,
}) => {
  const setRestockOpenRecoilValue = useSetRecoilState(restockModalOpenHandler);
  const setRestockItemId = useSetRecoilState(getRestockItemId);
  const setRestockedProductName = useSetRecoilState(getRestockedProductName);
  const setRestockedBrandName = useSetRecoilState(getRestockedBrandName);
  const setRestockedProductImgUrl = useSetRecoilState(
    getRestockedProductImgUrl,
  );
  const router = useRouter();

  const [orderItemStatus, setOrderItemStatus] = useState('idle');
  const [addWishListStatus, setAddWishListStatus] = useState('idle');
  const [wishEffect, setWishEffect] = useState([]);

  const handleOnClickPurchaseLogicIcon = async e => {
    if (product?.adultOnly && (!user?.adult || !user)) {
      setIsOpenWarningAdultProductModal(true);
      return;
    }
    const { isgift } = e.target.dataset;
    //로그인 모달창
    if (isgift && !user) {
      handleToggleLoginModal();
      return;
    }
    //간편회원일시 정회원 전환팝업
    if (isgift && !user?.regularMember) {
      if (setIsShowNotMembershipAccPopup) {
        setIsShowNotMembershipAccPopup(true);
      } else {
        setIsShowNotMembershipAccPopupMerchandise(true);
      }

      return;
    }

    if (product?.productResponseDto?.productSetCheck === '1') {
      alert('이 상품은 묶음상품입니다, 상품을 선택해주세요');
      router.push(`/products/${product?.id}?qna=1&reviews=1`);
      return;
    }


    const hasOptions = await handleOnClickProductWithOptions(id);
    if (hasOptions) return;

    if (isgift) {
      setIsGift(true);
    } else {
      setIsGift(false);
    }
    setIsConfirmationModalOpen(true);
  };

  const handleOnClickProductWithOptions = async id => {
    /*
    if (
      product?.productSetCheck === '세트상품'
    ) {
      alert('이 상품은 묶음(세트)상품입니다, 상품을 선택해주세요');
      router.push(`/products/${id}?qna=1&reviews=1`);
      return true;
    }

     */


    const hasOptions = await checkThisProductHasOptions(id);

    if (!hasOptions) return hasOptions;

    alert('옵션을 선택하세요');
    router.push(`/products/${id}?qna=1&reviews=1`);

    return hasOptions;
  };

  const checkThisProductHasOptions = async id => {
    const res = await getProductOptionsInfoAPI(id);
    if (res?.status !== 200) return;

    return res.data.optionCheck;
  };

  const handleToggleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
  };

  const handleAddWishList = async e => {
    if (product?.adultOnly && (!user || !user?.adult)) return;

    if (!user) {
      handleToggleLoginModal();

      return;
    }

    const data = new FormData();
    data.append('productCode', product.id);

    if (addWishListStatus === 'idle') {
      setAddWishListStatus('loading');

      await addProductToWishList(data)
        .then(response => {
          console.info('wish data ==>', data),
            setWishEffect([...wishEffect, product.id]);
          alert('찜 상품으로 추가되었습니다.');
          //window.location.reload();
        })
        .catch(e => {
          console.error(e);
          alert('찜 상품이 정상적으로 추가되지 않았습니다. 다시 시도해주세요.');
        })
        .finally(() => {
          setAddWishListStatus('idle');
        });
    }
  };

  const handleSaveOrderSheet = async e => {
    e.preventDefault();

    if (product?.adultOnly && !user) return;

    await orderCartItemsAPI({
      orderStatus: 'TAXFREE',
      productList: [
        {
          // TODO: 주문서Obj
          productCode: product.id,
          count: 1,
          productOption: 0,
          cartSeq: null,
          coupon: '',
          // coupon: 상품상세 couponPossibleCheck === true && 다운받은 쿠폰리스트 중 해당 상품 리스트가 있을 때 해당 coupon Sequence보내기
        },
      ],
    })
      .then(response => {
        router.push({
          pathname: `/order-sheet/${response}`,
          query: {
            from: 'direct',
          },
        });
      })
      .catch(e => {
        console.error(e);
        const errorMsg = e?.response?.data?.message;
        if(errorMsg){
          alert(errorMsg);
        }else{
          alert('주문이 정상적으로 처리되지 않았습니다. 다시 시도해주세요.');
        } 
      });
  };
  const handleBtnClick = e => {
    const targetName = e.currentTarget.innerHTML;
    if (targetName === '재입고 알림신청') {
      e.stopPropagation();
      if (!user && !product?.adultOnly) {
        setIsLoginModalOpen(true);
        return;
      }
      if (!user && product?.adultOnly) {
        setIsOpenWarningAdultProductModal(true);
        return;
      }

      setRestockOpenRecoilValue(prev => !prev);
      setRestockItemId(id);
      setRestockedProductName(product.productName);
      setRestockedBrandName(product.brandInfo.brandName);
      setRestockedProductImgUrl(product.productImageUrl);
    }
  };
  return (
    <>

      <div className="function">
        {/* 19세 상품 + 비로그인 = 19세 딱지가 붙음*/}
        {product?.adultOnly && !user ?
          <Img
            pc={{ width: '100%', height: '100%' }}
            position='inherit'
            // objectFit="contain"
            src={'/images/19.png'}
            alt="연령 제한 상품"
            // center
            className="adult"
          />
          :
          !backOrdered && !product?.isSoldOut && !product?.isOptionSoldOut && (product?.sellStat && product?.sellStat == 0)? (
            <>
              <ul>
                {product?.isWish === false && !wishEffect.includes(product.id) && (
                <li data-id="functional-button">
                  <button type="button" onClick={handleAddWishList} data-id="functional-button">
                    <i className="icon heart" data-id="functional-button"></i>
                    <span className="text" data-id="functional-button">찜하기</span>
                  </button>
                </li>
                )}
                {!isLiquor && _mimCode === 'HQS' && (
                <li data-id="functional-button" data-isgift={true}>
                  <button type="button" onClick={handleOnClickPurchaseLogicIcon} data-id="functional-button" data-isgift={true}>
                    <i className="icon gift" data-id="functional-button" data-isgift={true}></i>
                    <span className="text" data-id="functional-button" data-isgift={true}>선물하기</span>
                  </button>
                </li>
                )}
              </ul>
              <ul>
                <li data-id="functional-button">
                  <button type="button" onClick={handleOnClickPurchaseLogicIcon} data-id="functional-button">
                    <i className="icon cart"  data-id="functional-button"></i>
                    <span className="text"  data-id="functional-button">장바구니</span>
                  </button>
                </li>
                <li data-id="functional-button">
                  <button type="button" onClick={e => {
                    (async () => {
                      if (product?.adultOnly && (!user?.adult || !user)) return;
                    
                      if (product?.productResponseDto?.productSetCheck === '1') {
                        alert('이 상품은 묶음상품입니다, 상품을 선택해주세요');
                        router.push(`/products/${product?.id}?qna=1&reviews=1`);
                        return;
                      }
                    
                      const hasOptions = await handleOnClickProductWithOptions(
                        id,
                      );

                      if (hasOptions) return;

                      handleSaveOrderSheet(e);
                    })();
                  }}
                  data-id="functional-button">
                    <i className="icon purchase" data-id="functional-button"></i>
                    <span className="text" data-id="functional-button">바로구매</span>
                  </button>
                </li>
              </ul>
            </>
          ) : null}

        {product?.isSoldOut || product?.isOptionSoldOut || (product?.sellStat && product?.sellStat != 0) ? (
          <div className="sold-out">일시 품절</div>
        ) : null}
      </div>

      {/* 회원 청소년 */}
      {(product?.adultOnly && (!user?.adult || !user)) || (product?.sellStat && product?.sellStat != 0) ? <></> : (<>
        <div className="more">
          <button type="button" onClick={e => handleBtnClick(e)} className={`btn ${backOrdered ? 'restock' : 'detail'}`}>
            {backOrdered ? '재입고 알림신청' : '상세보기'}
          </button>
        </div>
      </>)}
    </>
  );
};

const Bg = styled.div``;