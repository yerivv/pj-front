import { useRouter } from "next/router";
import { PATH_ROUTE_MAP } from "../../constants/pathList";
import BasicHeader from "./basic/Header";
import GuideHeader from "./guide/Header";
import KcndHeader from "./kcnd/Header";
import BasicFooter from "./basic/Footer";
import GuideFooter from "./guide/Footer";
import KcndFooter from "./kcnd/Footer";
import HeadMeta from "../HeadMeta"
import QuickMenu from "./kcnd/QuickMenu";

const Layout = ({ children }) => {
  const router = useRouter();
  const pathname = router.pathname;
  const isGuidePath = pathname.includes('guide');
  const isKcndPath = pathname.includes('kcnd');
  const pageName = PATH_ROUTE_MAP[pathname] ? PATH_ROUTE_MAP[pathname] : '페이지명';
  const pageType = isGuidePath ? 'guide-content' : (isKcndPath ? 'kcnd-content' : 'basic-content');

  const themeSetting = (_mimCode) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return; // 서버사이드에서 실행되는 경우 함수를 종료합니다.
    }
    let theme;
    switch(_mimCode) {
        case 'MLJ':
            theme = 'jin';
            document.documentElement.setAttribute('data-theme', theme);
            break;
        default:
            //theme = ''; // 기본 테마
            document.documentElement.removeAttribute('data-theme');
    }
  }
  themeSetting('HQS');

  return(
    <>
    <HeadMeta title={pageName + `- 대한항공 기내면세점`} description={`${pageName.split(".")[0]}.`} />
    <div className={`wrapper`}>
      {isGuidePath ? <GuideHeader pageName={pageName} /> : (isKcndPath ? <KcndHeader pageName={pageName} /> : <BasicHeader pageName={pageName} />)}
      <main className={pageType}>
        {children}
        {isKcndPath && (<QuickMenu />)}
      </main>
      {isGuidePath ? <GuideFooter /> : (isKcndPath ? <KcndFooter /> : <BasicFooter />)}
    </div>
    </>
  )
}

export default Layout;