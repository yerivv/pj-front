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

  const updateQuery = (newQuery) => {
    const currentQuery = { ...router.query, ...newQuery };
    router.replace({
      pathname: router.pathname,
      query: currentQuery,
    });
  };

  const menuClick = () => {
    updateQuery({ menu: 'open' });
    setMoMenu(true);
  };

  const closeModal = () => {
    const currentQuery = { ...router.query };
    delete currentQuery.menu;
    updateQuery(currentQuery);
    setMoMenu(false);
  };

  useEffect(() => {
    if (router.query.menu === 'open') {
      setMoMenu(true);
    }
  }, [router]);


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