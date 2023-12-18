// utils.js
const fetchDataFromDatabase = async () => {
  // 데이터베이스에서 동적 페이지의 ID를 가져오는 로직
  // 예: SELECT id FROM dynamic_pages;
  const dynamicPageIds = [1, 2, 3]; // 임의의 ID 목록 (프로젝트에 맞게 수정)
  return dynamicPageIds;
};

const fetchEventDataFromAPI = async () => {
  // 외부 API로부터 이벤트 데이터를 가져오는 로직
  // 예: fetch('https://api.example.com/events');
  const eventData = await fetch('https://api.example.com/events');
  const eventIds = await eventData.json();
  return eventIds;
};

const getDynamicPaths = async () => {
  // 여러 동적 페이지의 경로를 수집하는 함수
  const dynamicPathsFromDatabase = await fetchDataFromDatabase();
  const dynamicPathsFromAPI = await fetchEventDataFromAPI();

  // 여러 소스에서 가져온 동적 페이지 경로를 결합
  const allDynamicPaths = [
    ...dynamicPathsFromDatabase.map((id) => `dynamic/${id}`),
    ...dynamicPathsFromAPI.map((eventId) => `events/${eventId}`),
    // 더 많은 소스나 로직을 추가할 수 있습니다.
  ];

  return allDynamicPaths;
};

module.exports = {
  getDynamicPaths,
};
