import Link from "next/link";
import Image from "next/image";

import { useState } from "react";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { EffectFade, Pagination, Navigation } from 'swiper';

const BannerType = ({ type, data }) => {
  const [currentIndex, setCurrentIndex] = useState(1);

  const swiperOptionsByType = {
    type1: {
      onSlideChange: (swiper) => setCurrentIndex(swiper.realIndex + 1),
      effect: 'fade',
      pagination: { type: 'progressbar' },
      loop: data?.length > 1,
      modules: [EffectFade, Pagination],
    },
    type2: {
      onSlideChange: (swiper) => setCurrentIndex(swiper.realIndex + 1),
      pagination: { type: 'progressbar' },
      loop: data?.length > 1,
      modules: [Pagination],
    },
    type3: {
      /* type3의 스와이프 옵션 */
      pagination: { type: 'fraction' },
      navigation: true,
      modules: [Pagination, Navigation],
    },
    // 추가적인 타입이 있을 경우 더 많은 프로퍼티를 추가할 수 있습니다.
  };
  
  const swiperOptions = swiperOptionsByType[type] || {};

  return (
    <div className="banner-type-swiper">
      <Swiper {...swiperOptions} className={`mySwiper ${type}`}>
        {data.map((item) => (
          <SwiperSlide key={`mainVisual-${item.id}`} style={{backgroundColor: `${item.bgColor}`}}>
            <Link href={item.link}>
              <a className="item">
                <div className="image-box"><Image src={item.imgPc} width={1600} height={780} style={{width: '100%', height: '100%'}} priority alt="메인 배너1" /></div>
                <div className="text-box">
                  <span>{item.group}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </a>
            </Link>
          </SwiperSlide>
        ))}
      {(type === 'type1' || type === 'type2') && data?.length > 1 &&
        <div className="swiper-control-box">
          <div className="control-box">
            <div className="fraction"><strong>{currentIndex}</strong><span> / {data?.length}</span></div>
            <button type="button">재생</button>
          </div>
        </div>
      }
      </Swiper>
    </div>
  );
}

export default BannerType;