import { useRouter } from "next/router";

const BackButton = () => {
  const router = useRouter();
  const currentURL = router.asPath;
  //console.log('asPath : ',currentURL);

  const handelHistoryBack = () => {
    if(currentURL == '/order/success') {
      router.replace('/');
    } else {
      router.back();
    }
  }
  return (
    <button onClick={handelHistoryBack}>이전화면</button>
  );
};

export default BackButton;