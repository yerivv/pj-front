import Link from "next/link";
import { useState } from "react";
import useResizeWidth from "../../../hooks/useResizeWidth";
import NavBar from "./NavBar";

const KcndFooter = () => {
  const _mimCode = 'HQS';
  const {isTablet} = useResizeWidth();
  const [selectBtn, setSelectBtn] = useState(false);
  const handleFamilySite = () => {
    setSelectBtn(!selectBtn);
  }
  return (
    <>
    {isTablet && (<NavBar />)}
    <footer className="footer-wrap">
      <div className="container-cs">
        <ul>
          <li>
            <Link href="/cs">
              <a className="box">
                <i className="icon headphone"></i>
                <span className="text">
                  <span><strong>무엇</strong>을 도와드릴까요?</span>
                </span>
              </a>
            </Link>
          </li>
          <li>
          {_mimCode === 'HQS' ? (
            <Link href="/cs/membership/grades-notice">
              <a className="box">
                <i className="icon gift"></i>
                <span className="text">
                  <span>새롭게 준비한 회원님들만의</span>
                  <span><strong>특별한 혜택</strong>을 준비했어요.</span>
                </span>
              </a>
            </Link>
          ) : (
            <Link href="https://www.jinair.com/">
              <a className="box">
                <i className="icon jin"></i>
                <span className="text">
                  <span>Fly, better fly 진에어</span>
                </span>
              </a>
            </Link>
          )}
          </li>
          <li>
            <Link href="/my-page/info/flights/register">
              <a className="box">
                <i className="icon plane"></i>
                <span className="text">
                  <span>탑승편 정보 등록하고</span>
                  <span><strong>1000포인트 선물</strong>받으세요.</span>
                </span>
              </a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="container">
        <div className="company-info">
          <h6>대한항공씨앤디서비스(주)</h6>
          <dl>
            <dt>사업자등록번호</dt>
            <dd>732-86-02017</dd>
            <dd><button className="btn">사업자정보확인</button></dd>
          </dl>
          <dl>
            <dt>통신판매업 신고번호</dt>
            <dd>2022-서울종로-0365</dd>
          </dl>
          <dl>
            <dt>대표이사</dt>
            <dd>최덕진</dd>
          </dl>
          <dl>
            <dt>주소</dt>
            <dd>서울특별시 종로구 수송동 146-1 이마빌딩</dd>
          </dl>
        </div>
        <div className="menu-list">
          <dl>
            <dt>COMPANY</dt>
            <dd>
              <Link href="#"><a>개인정보 처리방침</a></Link>
            </dd>
            <dd>
              <Link href="#"><a>이용약관</a></Link>
            </dd>
            <dd>
              <Link href="#"><a>회사소개</a></Link>
            </dd>
        {isTablet || (
          <>
            <dd>
              <Link href="#"><a>임직원 등록</a></Link>
            </dd>
            <dd>
              <button onClick={handleFamilySite} className="btn">패밀리 사이트</button>
            {selectBtn && (
              <ul className="site-list">
                <li>
                  <a target="_blank" href="https://www.koreanaircnd.com">대한항공씨앤디서비스</a>
                </li>
                <li>
                  <a target="_blank" href="https://www.mychef.kr/">마이셰프</a>
                </li>
              </ul>
            )}
            </dd>
          </>
        )}
          </dl>
          <dl>
            <dt>CS CENTER</dt>
            <dd>
              <Link href="#"><a>공지사항</a></Link>
            </dd>
            <dd>
              <Link href="#"><a>이용안내</a></Link>
            </dd>
            <dd>
              <Link href="#"><a>FAQ</a></Link>
            </dd>
            <dd>
              <Link href="#"><a>Q&amp;A</a></Link>
            </dd>
          </dl>
        </div>
        <div className="tel-info">
          <Link href="tel:080-656-4545"><a className="tel">080-656-4545</a></Link>
          <p>KST 08:30 ~ 17:30 (연중무휴)</p>
        </div>
        <div className="copy">&copy; KOREANAIRCND. All rights Reserved.</div>
      </div>
    </footer>
    </>
  )
}

export default KcndFooter;