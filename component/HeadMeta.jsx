import Head from "next/head";

const HeadMeta = ({ title, description, url, image }) => {
  return (
    <Head>
      <title>{title || "대한항공 기내면세점"}</title>
      <meta
        name="description"
        content={
          description ||
          "대한항공 기내면세점대한항공 기내면세점"
        }
      />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:title" content={title || "대한항공 기내면세점"} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || "https://www.naver.com"} />
      <meta property="og:image" content={image} />
      <meta property="og:article:author" content="대한항공 기내면세점대한항공 기내면세점" />
    </Head>
  );
};

export default HeadMeta;