// utils.js
export const parseToUSD = string => `$${string?.toLocaleString('en-EN')}`;

export const parseToKRW = string => `${string?.toLocaleString('ko-KR')}원`;

export const getDecimalPoint = (number) => {
  let getDecimal = (Math.floor(number * 100) / 100).toFixed(2);
  if(getDecimal < 0) {
    // 만약 0보다 작다면, 소수점은 해당 내용에서 나올수 없기에
    getDecimal = 0;
  }
  return `$${getDecimal?.toLocaleString('en-EN')}`;
}