import Link from "next/link";
import Image from "next/image";
import useResizeWidth from "../../../hooks/useResizeWidth";
import { useState, useEffect, useRef } from "react";

const QuickMenu = () => {
  const {isTablet} = useResizeWidth();
  const [isQuick, setIsQuick] = useState(false)
  const handleQuickOpen = () => {
    setIsQuick(!isQuick)
  }
  const handleGoTop = () => {
    if (!window.scrollY) return;
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  return (
    <>
    <div className={`quick-wrap${isQuick ? ' open' : ''}`}>
    {isTablet && (
      <>
      <button type="button" onClick={handleQuickOpen} className="btn-quick">퀵메뉴 열기</button>
      </>
    )}
      <ul>
        <li className="flight">
          <Link href="/my-page/info/flights/register">
          <a>
            <i className="icon"></i>
            <span className="text">탑승편정보</span>
          </a>
          </Link>
          <span className="tip">+1,000P 적립</span>
        </li>
      {isTablet && (
      <>
        <li className="membership">
          <button>
            <i className="thumb">
              {/* <Image src={``} width="" height="" alt="" /> */}
            </i>
            <span className="text blind">최근상품</span>
          </button>
        </li>
      </>
      )}
      {isTablet || (
      <>
        <li className="membership">
          <Link href="/cs/membership/grades-notice">
          <a>
            <i className="icon"></i>
            <span className="text">혜택안내</span>
          </a>
          </Link>
        </li>
        <li className="guide">
          <Link href="/cs/guide/usage">
          <a>
            <i className="icon"></i>
            <span className="text">이용안내</span>
          </a>
          </Link>
        </li>
      </>
      )}
        <li className="top">
          <button type="button" onClick={handleGoTop}>
            <i className="icon"></i>
            <span className="text blind">최상단으로</span>
          </button>
        </li>
      </ul>
    </div>
    </>
  )
}

export default QuickMenu;