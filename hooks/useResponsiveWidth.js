import { useMediaQuery } from '@mui/material';

export default function useResponsiveDeviceWidth(props) {
  const isMob = useMediaQuery('(max-width:1024px)');
  const isNotDesktop = useMediaQuery('(max-width:1299px)');
  if (props?.isNotDesktop) return isNotDesktop;
  return isMob;
}

//사용
//const isNotDesktop = useResponsiveDeviceWidth({ isNotDesktop: true });
//const isMob = useResponsiveDeviceWidth()
