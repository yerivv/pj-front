const fs = require('fs');
const path = require('path');
const { getDynamicPaths } = require('../utils'); // 동적 페이지 경로 수집을 위한 유틸리티

const BASE_URL = 'localhost:3001'; // 변경 필요

function generateSiteMap(paths) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${paths.map((path) => {
        const url = `${BASE_URL}/${encodeURIComponent(path)}`;
        //const lastmod = getLastModificationDate(path); // 이 함수를 구현하세요
        return `
          <url>
            <loc>${url}</loc>
          </url>
        `;
      }).join('')}
    </urlset>
  `;
}

export async function getServerSideProps({ res }) {
  // 정적 페이지의 폴더 및 동적 페이지 경로를 가져옵니다
  const staticPages = getStaticPages();
  //const dynamicPaths = await getDynamicPaths(); // 동적 페이지 경로 수집

  // 전체 페이지 목록을 만듭니다
  //const allPages = [...staticPages, ...dynamicPaths];
  const allPages = [...staticPages];

  // XML sitemap을 생성합니다
  const sitemap = generateSiteMap(allPages);

  res.setHeader('Content-Type', 'text/xml');
  // 생성된 XML을 브라우저로 전송합니다
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function SiteMap() {
  // getServerSideProps 함수가 주요 작업을 수행할 것입니다
  return null;
}

function getStaticPages() {
  const pagesDirectory = path.join(process.cwd(), 'pages');
  const pages = fs.readdirSync(pagesDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  return pages;
}
