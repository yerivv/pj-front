import { useRouter } from "next/router";
import { PATH_ROUTE_MAP } from "../../constants/pathList";
import BasicHeader from "./basic/Header";
import GuideHeader from "./guide/Header";
import BasicFooter from "./basic/Footer";
import GuideFooter from "./guide/Footer";
import HeadMeta from "../HeadMeta"

const Layout = ({ children }) => {
  const router = useRouter();
  const pathname = router.pathname;
  const isGuidePath = pathname.includes('guide');
  const pageName = PATH_ROUTE_MAP[pathname] ? PATH_ROUTE_MAP[pathname] : '페이지명';
  const pageType = isGuidePath ? 'guide-content' : 'basic-content'
  
  return(
    <>
    <HeadMeta title={pageName} description={`${pageName.split(".")[0]}.`} />
    <div className="wrap">
      {isGuidePath ? <GuideHeader pageName={pageName} /> : <BasicHeader pageName={pageName} />}
      <main className={pageType}>
        {children}
      </main>
      {isGuidePath ? <GuideFooter /> : <BasicFooter />}
    </div>
    </>
  )
}

export default Layout;