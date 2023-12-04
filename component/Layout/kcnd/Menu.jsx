import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const Menu = ({ small }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [brand, setBrand] = useState(false);
  const [category, setCategory] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('http://localhost:3001/api/categories');
      const data = await response.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleAllMenu = () => {
    setMenuOpen(!menuOpen);
    handleHoverClear();
  }

  const handleCategory = (index) => {
    setBrand(false);
    setCategory(true);
    setActiveCategory(index);
  }

  const handleBrand = (act) => {
    setActiveCategory(null);
    setCategory(false);
    setBrand(act === 'show');
  };

  const handleHoverClear = () => {
    setBrand(false);
    setCategory(false);
    setActiveCategory(null);
  }

  const themeRecommendations = [
    { name: '주류전문관', url: '#' },
    { name: 'Heart to Heart', url: '#' },
    { name: '스토리', url: '#' },
    { name: '카탈로그', url: '#' },
    { name: '베스트', url: '#' },
    { name: '이벤트', url: '#' },
    { name: '임직원몰', url: '#' },
  ];

  return(
    <>
    <button onClick={handleAllMenu} className={`menu${menuOpen ? ' open' : ''}`}>전체메뉴</button>
    <div className={`menu-wrap${menuOpen ? ' open' : ''}${small ? ' small' : ''}`}>
      <div className="list">
        <div className="group">
          <div className="depth1">카테고리</div>
          <ul>
          {categories && categories.map((item, index) => (
            <li className={`depth2 ${activeCategory === index ? 'open' : ''}`} onMouseEnter={() => handleCategory(index)} key={`category-${item.id}`}>
              <Link href={`/kcnd/category/${item.id}/all`}>
                <a>
                  <i className="icon"><Image src={`${item.iconURL}`} height="40" width="40" alt="" /></i>
                  <span>{item.name}</span>
                </a>
              </Link>
            {item.category.length && (
              <div className="detail category">
                <ul>
                  <li><Link href={`/kcnd/category/${item.id}/all`}><a>전체</a></Link></li>
                {item.category.map((subItem) => (
                  <li key={`category-sub-${subItem.id}`}><Link href={`/kcnd/category/${subItem.parentId}/${subItem.id}`}><a>{subItem.name}</a></Link></li>
                ))}
                </ul>
              </div>
            )}
            </li>
          ))}
          </ul>
        </div>
        <div className="group" onMouseEnter={() => handleBrand('show')} onMouseLeave={() => handleBrand('hide')}>
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
          {themeRecommendations.map((theme) => (
            <li className="depth2" key={theme.name} onMouseEnter={handleHoverClear}>
              <Link href={theme.url}><a>{theme.name}</a></Link>
            </li>
          ))}
          </ul>
        </div>
      </div>
    </div>
    <div className={`menu-dim${menuOpen ? ' open' : ''}${small ? ' small' : ''}`} onClick={handleAllMenu}></div>
    </>
  )
}

export default Menu;