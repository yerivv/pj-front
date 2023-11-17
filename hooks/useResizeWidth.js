//사용
//const isNotDesktop = useResponsiveDeviceWidth({ isNotDesktop: true });
//const isMob = useResponsiveDeviceWidth()

'use client'
import { useState, useEffect } from 'react';

const useResizeWidth = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  //const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const { innerWidth } = window;
      setIsMobile(innerWidth < 1024);
      setIsTablet(innerWidth < 1299);
      //setIsDesktop(innerWidth >= 1280);
    };

    handleResize(); // 컴포넌트 마운트 시 초기 값 설정

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { isMobile, isTablet };
};

export default useResizeWidth;