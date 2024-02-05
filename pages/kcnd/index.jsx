import Image from "next/image";
import Link from "next/link";
import Merchandise from "../../component/organisms/Merchandise";
import BannerType from "../../component/banner/BannerType";

export async function getServerSideProps(context) {
  const res = await fetch('http://localhost:3001/api/mainvisual');
  const res3 = await fetch('http://localhost:3001/api/banner3');
  const res4 = await fetch('http://localhost:3001/api/products');
  const mainBannerData = await res.json();
  const banner3 = await res3.json();
  const products = await res4.json();
  if (!mainBannerData || !banner3) {
    return {
      notFound: true,
    };
  }
  return {
    props: { mainBannerData, banner3, products },
  };
}

const KcndIndex = ({ mainBannerData, banner3, products }) => {
  return (
    <div className="kcnd-page">
      <div className="section-full">
        <BannerType type={`type1`} data={mainBannerData} />
      </div>
      <div className="section merchandise-wrap" style={{marginTop: '40px'}}>
        <Merchandise type="event" data={products} />
      </div>
      <div className="section">
        <BannerType type={`type3`} data={banner3} />
      </div>
    </div>
  )
}

export default KcndIndex;