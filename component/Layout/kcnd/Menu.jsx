import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export const getServerSideProps = async () => {
  const res = await fetch('/categories');
  
  if (!res.ok) {
    console.log('Response Error: ', res.status);
    return {
      props: {
        data: null,
      },
    };
  }
  
  const data = await res.json();
  console.log('Fetched Data: ', data);
  
  return {
    props: {
      data,
    },
  };
};

const Menu = ({ small, state, setState, data }) => {
  console.log('api-data : ',data)
  const [brand, setBrand] = useState(false);
  const handleBrand = (act) => {
    if(act === 'show'){
      setCategory(false);
      setBrand(true);
    } else {
      setBrand(false);
    }
  };
  const [category, setCategory] = useState(false);
  const handleCategory = () => {
    setBrand(false);
    setCategory(true);
  }
  const handleHoverClear = () => {
    setBrand(false);
    setCategory(false);
  }
  const handleMenuClose = () => {
    setState(false);
  }
  return(
    <>
    <div className={`menu-wrap${state ? ' open' : ''}${small ? ' small' : ''}`}>
      <div className="list">
        <div className="group">
          <div className="depth1">카테고리</div>
    {/* {results && results?.map((item) => (
      <div key={`cate-${item.id}`}>
        11{item.id}
      </div>
    ))} */}
          <ul>
            <li className="depth2" onMouseEnter={() => handleCategory('1')}>
              <Link href="#"><a className={category ? 'open' : ''}><i className="icon"><Image src={`/assets/sample/cate-1.png`} height="40" width="40" alt="" /></i>주류</a></Link>
              {category && (
                <div className="detail category">
                  <ul>
                    <li><Link href="#"><a>전체</a></Link></li>
                    <li><Link href="#"><a>에센스 / 세럼</a></Link></li>
                    <li><Link href="#"><a>크림</a></Link></li>
                    <li><Link href="#"><a>아이케어</a></Link></li>
                  </ul>
                </div>
              )}
            </li>
            <li className="depth2" onMouseEnter={() => handleCategory('1')}>
              <Link href="#"><a className={category ? 'open' : ''}><i className="icon"><Image src={`/assets/sample/cate-2.png`} height="40" width="40" alt="" /></i>화장품</a></Link>
            </li>
            <li className="depth2" onMouseEnter={() => handleCategory('1')}>
              <Link href="#"><a className={category ? 'open' : ''}><i className="icon"><Image src={`/assets/sample/cate-3.png`} height="40" width="40" alt="" /></i>향수</a></Link>
            </li>
            <li className="depth2" onMouseEnter={() => handleCategory('1')}>
              <Link href="#"><a className={category ? 'open' : ''}><i className="icon"><Image src={`/assets/sample/cate-4.png`} height="40" width="40" alt="" /></i>패션용품</a></Link>
            </li>
            <li className="depth2" onMouseEnter={() => handleCategory('1')}>
              <Link href="#"><a className={category ? 'open' : ''}><i className="icon"><Image src={`/assets/sample/cate-5.png`} height="40" width="40" alt="" /></i>전자/리빙</a></Link>
            </li>
            <li className="depth2" onMouseEnter={() => handleCategory('1')}>
              <Link href="#"><a className={category ? 'open' : ''}><i className="icon"><Image src={`/assets/sample/cate-6.png`} height="40" width="40" alt="" /></i>건강식품</a></Link>
            </li>
            <li className="depth2" onMouseEnter={() => handleCategory('1')}>
              <Link href="#"><a className={category ? 'open' : ''}><i className="icon"><Image src={`/assets/sample/cate-7.png`} height="40" width="40" alt="" /></i>초콜릿</a></Link>
            </li>
          </ul>
        </div>
        <div className="group" onMouseEnter={() => handleBrand('show')}>
          <button type="button" className={`depth1${brand ? ' open' : ''}`}>브랜드</button>
        {brand && (
          <div className="detail brand">
            <div className="cate">
              <ul>
                <li className="active"><button type="button">전체</button></li>
                <li><button type="button">주류</button></li>
                <li><button type="button">스위츠/고메</button></li>
                <li><button type="button">화장품</button></li>
                <li><button type="button">향수</button></li>
                <li><button type="button">패션용품</button></li>
                <li><button type="button">전자/리빙</button></li>
                <li><button type="button">건강식품</button></li>
                <li><button type="button">초콜릿</button></li>
              </ul>
            </div>
            <div className="search">
              <input type="text" name="brandSearch" id="brandSearch" placeholder="브랜드를 입력하세요" />
              <button type="button">검색</button>
            </div>
            <div className="tab">
              <ul>
                <li className="active"><button type="button">ABC</button></li>
                <li><button type="button">가나다</button></li>
              </ul>
            </div>
            <div className="result">
              <dl>
                <dt>A</dt>
                <dd><Link href="#"><a>A PURY</a></Link></dd>
                <dd><Link href="#"><a>A.P.C</a></Link></dd>
                <dd><Link href="#"><a>A PURY</a></Link></dd>
                <dd><Link href="#"><a>A.P.C</a></Link></dd>
                <dd><Link href="#"><a>A PURY</a></Link></dd>
                <dd><Link href="#"><a>A.P.C</a></Link></dd>
                <dd><Link href="#"><a>A PURY</a></Link></dd>
                <dd><Link href="#"><a>A.P.C</a></Link></dd>
                <dd><Link href="#"><a>A PURY</a></Link></dd>
                <dd><Link href="#"><a>A.P.C</a></Link></dd>
                <dd><Link href="#"><a>A PURY</a></Link></dd>
                <dd><Link href="#"><a>A.P.C</a></Link></dd>
              </dl>
              <dl>
                <dt>B</dt>
                <dd><Link href="#"><a>B&b</a></Link></dd>
                <dd><Link href="#"><a>BaBA</a></Link></dd>
                <dd><Link href="#"><a>B&b</a></Link></dd>
                <dd><Link href="#"><a>BaBA</a></Link></dd>
                <dd><Link href="#"><a>B&b</a></Link></dd>
                <dd><Link href="#"><a>BaBA</a></Link></dd>
                <dd><Link href="#"><a>B&b</a></Link></dd>
                <dd><Link href="#"><a>BaBA</a></Link></dd>
                <dd><Link href="#"><a>B&b</a></Link></dd>
                <dd><Link href="#"><a>BaBA</a></Link></dd>
                <dd><Link href="#"><a>B&b</a></Link></dd>
                <dd><Link href="#"><a>BaBA</a></Link></dd>
                <dd><Link href="#"><a>B&b</a></Link></dd>
                <dd><Link href="#"><a>BaBA</a></Link></dd>
                <dd><Link href="#"><a>B&b</a></Link></dd>
                <dd><Link href="#"><a>BaBA</a></Link></dd>
                <dd><Link href="#"><a>B&b</a></Link></dd>
                <dd><Link href="#"><a>BaBA</a></Link></dd>
                <dd><Link href="#"><a>B&b</a></Link></dd>
                <dd><Link href="#"><a>BaBA</a></Link></dd>
                <dd><Link href="#"><a>B&b</a></Link></dd>
                <dd><Link href="#"><a>BaBA</a></Link></dd>
                <dd><Link href="#"><a>B&b</a></Link></dd>
                <dd><Link href="#"><a>BaBA</a></Link></dd>
              </dl>
            </div>
          </div>
        )}
        </div>
        <div className="group">
          <div className="depth1">테마추천</div>
          <ul>
            <li className="depth2" onMouseEnter={handleHoverClear}><Link href="#"><a>주류전문관</a></Link></li>
            <li className="depth2"><Link href="#"><a>Heart to Heart</a></Link></li>
            <li className="depth2"><Link href="#"><a>스토리</a></Link></li>
            <li className="depth2"><Link href="#"><a>카탈로그</a></Link></li>
            <li className="depth2"><Link href="#"><a>베스트</a></Link></li>
            <li className="depth2"><Link href="#"><a>이벤트</a></Link></li>
            <li className="depth2"><Link href="#"><a>임직원몰</a></Link></li>
          </ul>
        </div>
      </div>
    </div>
    <div className={`menu-dim${state ? ' open' : ''}${small ? ' small' : ''}`} onClick={handleMenuClose}></div>
    </>
  )
}

export default Menu;