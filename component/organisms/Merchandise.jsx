import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useResizeWidth from "../../hooks/useResizeWidth";
import { parseToUSD, parseToKRW, getDecimalPoint } from "../../utils";

const Merchandise = ({ type, product, isSearchResult }) => {
  const {isTablet} = useResizeWidth();
  const [hoverIndex, setHoverIndex] = useState(null);
  if(type === undefined) {
    console.log('상품유형 : ', '기본')
  } else {
    console.log('상품유형 : ', type)
  }

  const exchangeRate = 1;

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

      console.log('productInfo', productInfo)

  const handleOnClickCover = () => {
    alert('아아아')
  }
  const handleOnMouseEnter = (index) => {
    setHoverIndex(index);
  };
  const handleOnMouseLeave = () => {
    setHoverIndex(null)
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
    <>
    <div className="merchandise-item">
      <div className="image-box" onMouseEnter={() => handleOnMouseEnter(productInfo?.id)} onMouseLeave={handleOnMouseLeave}>
        <div className="thumb-box">
          <div className="thumb"><Image src={productInfo?.productImageUrl} width={500} height={500} priority style={{width: '100%', height: '100%'}} alt={productInfo?.productName} /></div>
        </div>
        {/* <div className="label-box">
          <span className="label">단하루</span>
          <span className="label">핫딜</span>
        </div>
        <div className="rank-box">
          <span className="label top">1</span>
        </div>
        <div className="other-label-box">
          <Image src={'/assets/sample/202306141800223069641.png'} width={108} height={42} priority alt="이름" />
        </div> */}
      {isTablet || (
        <Link href="#">
          <a className={`cover-box${productInfo?.adultOnly ? ' white' : ''}${hoverIndex === productInfo?.id ? ' hover' : ''}`}>
        <CoverType
          product={productInfo}
          isLiquor={productInfo?.adultOnly}
          adultOnly={productInfo?.adultOnly}
          backOrdered={productInfo?.backOrdered}
          isSoldOut={productInfo?.isSoldOut}
        />
          </a>
        </Link>
      )}
      </div>
      <div className="info-box">
        <div className="brand">{productInfo?.brandInfo?.brandName || productInfo?.brandName}</div>
        <div className="name">{productInfo?.productName}</div>
        <ProductPrice price={productInfo.price ? productInfo.price : []} exchangeRate={exchangeRate} />
        <div className="label">
          <span className="text">신상품</span>
          <span className="text">세일</span>
          <span className="text">쿠폰</span>
        </div>
      </div>
    </div>
    </>
  )
}

const ProductPrice = ({ price, exchangeRate }) => {
  const { onDiscount, discountRate, byCurrency, originPrice, byEmpCurrency, empFinalDsctRate } = price;
  const adjustedExchangeRate = exchangeRate !== 1 ? Number(exchangeRate.replace(",","")) : exchangeRate;
  return (
    <>
    <div className="price-info">
    {(onDiscount) && (
      <>
      <div className="origin">{parseToUSD(originPrice)}</div>
      <div className="discount">{discountRate}</div>
      </>
    )}
      <div className="price">
        <strong>{getDecimalPoint((byCurrency?.krw ?? byCurrency?.KRW) / adjustedExchangeRate)}</strong>
        ({parseToKRW((byCurrency?.krw ?? byCurrency?.KRW))})
      </div>
    </div>
    </>
  )
}

const CoverType = ({ product, isLiquor, adultOnly, backOrdered, isSoldOut  }) => {
  return (
    <>
      <div className="function">
        {/* 주류-로그인 전 */}
      {product?.adultOnly ? 
        <>
        <ul className="adult">
          <li className="badge"><Image src={'/assets/images/19.png'} width={500} height={500} priority style={{width: '100%', height: '100%'}} alt="상품명" /></li>
        </ul>
        </>
      : 
      !backOrdered && !product?.isSoldOut && !product?.isOptionSoldOut && (product?.sellStat && product?.sellStat == 0) ? (
        <>
        <ul className="default">
          <li className="wish"><i className="ico"></i><span>찜하기</span></li>
          {/* 주류- 로그인후엔 선물하기 없음 */}
        {!isLiquor &&
          <li className="gift"><i className="ico"></i><span>선물하기</span></li>
        }
          <li className="cart"><i className="ico"></i><span>장바구니</span></li>
          <li className="purchase"><i className="ico"></i><span>바로구매</span></li>
        </ul>
        </>
      ) : null}
      {product?.isSoldOut || product?.isOptionSoldOut || (product?.sellStat && product?.sellStat != 0) ? (
        <ul className="sold-out">
          <li className="sold-out">일시품절</li>
        </ul>
      ) : null}
      
      {(product?.sellStat && product?.sellStat != 0) ? (
        <ul className="sold-out-restock">
          <li className="sold-out">일시품절</li>
          <li className="wish"><i className="ico"></i><span>찜하기</span></li>
          <li className="restock">재입고 알람신청</li>
        </ul>
      ) : null}
      </div>
    </>
  )
}

export default Merchandise;