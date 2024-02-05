import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import MenuMo from "./MenuMo";

const NavBar = () => {
  const router = useRouter();
  const [navBarView, setNavBarView] = useState(true);

  useEffect(() => {
    const validPaths = ['/order/order', '/'];
    if (validPaths.includes(router.pathname)) {
      setNavBarView(false);
    } else {
      setNavBarView(true);
    }
  }, [router.pathname]);

  
  const [position, setPosition] = useState(window.offsetTop);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const moving = window.scrollY;
      setVisible(position > moving);
      setPosition(moving);

      console.log(position, moving)
      
      if (window.scrollY <= 60 || window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - 80) {
        setVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [position]);

  const [moMenu, setMoMenu] = useState(false);
  const menuClick = () => {
    setMoMenu(true);
  };

  const closeModal = () => {
    setMoMenu(false);
  };
  
  useEffect(() => {
    const handlePopState = () => {
      // 뒤로가기 이벤트 발생 시 localStorage에서 모달 상태를 읽어와 열거나 닫음
      const storedMoMenu = localStorage.getItem('moMenu');
      setMoMenu(storedMoMenu === 'true');
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };

  }, []); // 의존성 배열이 비어있는 이유는 한 번만 등록/해제하고 싶기 때문입니다.

  useEffect(() => {
    // 모달 상태가 변경될 때마다 localStorage에 저장
    localStorage.setItem('moMenu', moMenu.toString());
    console.log('moMenu stored in localStorage:', moMenu);
  }, [moMenu]);


  return (
    <>
  {navBarView && (
  <>
    <div className={`toolbar-wrap${navBarView ? ' view' : ''}${visible ? '' : ' visible'}`}>
      <ul>
        <li className="home">
          <Link href="/">
          <a>
            <i className="icon"></i>
            <span className="text">메인</span>
          </a>
          </Link>
        </li>
        <li className="menu">
          <button onClick={menuClick}>
            <i className="icon"></i>
            <span className="text">메뉴</span>
          </button>
        </li>
        {/* <li className="menu">
          <Link href="/kcnd/menu">
          <a>
            <i className="icon"></i>
            <span className="text">메뉴</span>
          </a>
          </Link>
        </li> */}
        <li className="age">
          <Link href="/liquor-store">
          <a>
            <i className="icon"></i>
            <span className="text">주류전문관</span>
          </a>
          </Link>
        </li>
        <li className="my">
          <Link href="/my-page">
          <a>
            <i className="icon"></i>
            <span className="text">마이페이지</span>
          </a>
          </Link>
        </li>
        <li className="wish">
          <Link href="/my-page/myactivities/MyListView">
          <a>
            <i className="icon"></i>
            <span className="text">찜</span>
          </a>
          </Link>
        </li>
      </ul>
    </div>
    <MenuMo moMenu={moMenu} closeModal={closeModal} />
  </>
  )}
    </>
  )
}

export default NavBar;