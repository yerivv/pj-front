import { useRouter } from "next/router";
import { useEffect } from "react";

const BackButton = () => {
  const router = useRouter();
  const currentURL = router.asPath;
  console.log('asPath : ',currentURL);

  useEffect(() => {
    const handleHistoryChange = () => {
      // 현재 경로가 '/order/success'이면 특정 경로로 이동
      if (router.asPath === '/order/success') {
        router.push('/'); // 원하는 경로로 변경
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('popstate', handleHistoryChange);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('popstate', handleHistoryChange);
    };
  }, [router]);


  const handelHistoryBack = () => {
    router.back();
  }
  return (
    <button onClick={handelHistoryBack}>이전화면</button>
  );
};

export default BackButton;