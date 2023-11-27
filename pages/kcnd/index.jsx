import Image from "next/image";
import Link from "next/link";
import Merchandise from "../../component/organisms/Merchandise";

export async function getServerSideProps(context) {
  const res = await fetch('http://localhost:3001/api/mainvisual');
  const data = await res.json();
  if (!data) {
    return {
      notFound: true,
    };
  }
  return {
    props: { data },
  };
}

const KcndIndex = ({ data }) => {
  return (
    <div className="kcnd-page">
      <div className="section-full" style={{display: 'none'}}>
    {data.map((item) => (
      <div key={`mainVisual-${item.id}`} style={{backgroundColor: `${item.bgColor}`}}>
        <Link href={item.link}>
          <a>
          <Image src={item.imgPc} width={1600} height={780} priority alt="메인 배너1" />
          <span>{item.group}</span>
          <span>{item.title}</span>
          <span>{item.desc}</span>
          </a>
        </Link>
      </div>
    ))}
      </div>
      <div className="section merchandise-wrap" style={{marginTop: '40px'}}>
      <Merchandise data="event" />
      </div>
    </div>
  )
}

export default KcndIndex;