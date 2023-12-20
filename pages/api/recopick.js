import { ProductAPI, RecopicAPI } from 'lib/api';
import axios from 'axios';
const qs = require('qs');

const accesskey = 'e06d5169d5ec03411c6b9e3a269f12aa2fb580302b5c61531e44bfaf78f5210d';

// cjLee
// 레코픽 테스트 아이디 3394로는 누적데이타가 정상 동작하나 '함께본 상품'을 제공하지 않음
// 하여 현재 3399(실제 서비스)를 로 하여 서비스 실행 중이며, 고객도 알고 있는 내용임.
// '함께본 상품'을 클릭시 asis사이트로 가는 이유는 실제 서비스 아이디를 사용함으로서 생기는 자연스러운 현상
// 이외 이슈 없음
const recopic_service_id = process.env.NEXT_PUBLIC_RECOPICK_SERVICE_ID;
const recopic_service_id_tobe = 3399; //로그 보내는 것은 to-be

export const getRecopicDataAPI =  (userData, productId) => {
  if (!userData || !productId) return null;
  let returnData = null;
  try {
    const res = RecopicAPI.get('/v1/recommendations/item/'+recopic_service_id+'/'+localStorage.getItem("recopicUID")+'/'+productId+'?limit=2&channel=detail');
    returnData = res?.data;
  } catch (error) {
    returnData = null;
  }
  return returnData;
};

// 상품보기
export const setRecopicForView = async (userData, data, prevPath) => {
  try {
    await axios.post(`https://lc.recopick.com/v1/logs/view/${recopic_service_id_tobe}/${localStorage.getItem("recopicUID")}`, {
      url: `${process.env.NEXT_PUBLIC_KOREANAIR_URL}/products/${data?.id}`,
      ref: `${process.env.NEXT_PUBLIC_KOREANAIR_URL}${prevPath}`,
      items: [{
        id: data.id,
        title: data?.productName,
        image: data?.productImageUrl,
        price: data?.price.byCurrency.usd,
        currency: "USD",
        description: "대한항공 온라인 기내면세입니다. 귀국편에 편리하게 받으세요."
      }],
      user: {
        gender: userData?.gender,
        birthyear: userData?.birthYear,
        mid: userData?.userMid
      }
    });
  } catch (error) {
    console.error("data recopic error====>", error);
  }
};

// 상품찜
export const setRecopicForWish = async (userData, data, category, prevPath) => {
  try {
    await axios.post(`https://lc.recopick.com/v1/logs/like/${recopic_service_id_tobe}/${localStorage.getItem("recopicUID")}`, {
      url: `${process.env.NEXT_PUBLIC_KOREANAIR_URL}/products/${data?.id}`,
      ref: `${process.env.NEXT_PUBLIC_KOREANAIR_URL}${prevPath}`,
      items: [{
        id: data.id,
        c1: category?.parentCategoryName,
        c2: category?.categoryName,
        c3: ''
      }],
      user: {
        gender: userData?.gender,
        birthyear: userData?.birthYear,
        mid: userData?.userMid
      }
    });
  } catch (error) {
    console.error("data recopic error====>", error);
  }
};

// 장바구니
export const setRecopicForCart = async (userData, data, prevPath) => {
  try {
    await axios.post(`https://lc.recopick.com/v1/logs/basket/${recopic_service_id_tobe}/${localStorage.getItem("recopicUID")}`, {
      url: `${process.env.NEXT_PUBLIC_KOREANAIR_URL}/cart`,
      ref: `${process.env.NEXT_PUBLIC_KOREANAIR_URL}${prevPath}`,
      items: data,
      user: {
        gender: userData?.gender,
        birthyear: userData?.birthYear,
        mid: userData?.userMid
      }
    });
  } catch (error) {
    console.error("data recopic error====>", error);
  }
};

// 주문완료
export const setRecopicForOrder = async (userData, data, prevPath, currentPath) => {
  try {
    await axios.post(`https://lc.recopick.com/v1/logs/order/${recopic_service_id_tobe}/${localStorage.getItem("recopicUID")}`, {
      url: `${process.env.NEXT_PUBLIC_KOREANAIR_URL}${currentPath}`,
      ref: `${process.env.NEXT_PUBLIC_KOREANAIR_URL}${prevPath}`,
      items: data,
      user: {
        gender: userData?.gender,
        birthyear: userData?.birthYear,
        mid: userData?.userMid
      }
    });
  } catch (error) {
    console.error("data recopic error====>", error);
  }
};

// 검색
export const setRecopicForSearch = async (userData, data, prevPath, currentPath) => {
  try {
    await axios.post(`https://lc.recopick.com/v1/logs/search/${recopic_service_id_tobe}/${localStorage.getItem("recopicUID")}`, {
      url: `${process.env.NEXT_PUBLIC_KOREANAIR_URL}${currentPath}`,
      ref: `${process.env.NEXT_PUBLIC_KOREANAIR_URL}${prevPath}`,
      q: data,
      user: {
        gender: userData?.gender,
        birthyear: userData?.birthYear,
        mid: userData?.userMid
      }
    });
  } catch (error) {
    console.error("data recopic error====>", error);
  }
};

// 방문로그
export const setRecopicForVisit = async (userData, prevPath, currentPath) => {
  try {
    await axios.post(`https://lc.recopick.com/v1/logs/visit/${recopic_service_id_tobe}/${localStorage.getItem("recopicUID")}`, {
      url: `${process.env.NEXT_PUBLIC_KOREANAIR_URL}${currentPath}`,
      ref: `${process.env.NEXT_PUBLIC_KOREANAIR_URL}${prevPath}`,
      user: {
        gender: userData?.gender,
        birthyear: userData?.birthYear,
        mid: userData?.userMid
      }
    });
  } catch (error) {
    console.error("data recopic error====>", error);
  }
};

// 함께본 상품 가져오기 룰
//https://api.recopick.com/v1/recommendations/item/3399/57eb9cd741d0e28e2ace57961f29b8aa/S12070F0?limit=10&field=meta&channel=detail_top&type=viewtogether&category=%ED%99%94%EC%9E%A5%ED%92%88&callback=parseResponse