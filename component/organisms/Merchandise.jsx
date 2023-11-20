const Merchandise = ({ type, data }) => {
  if(type === undefined) {
    console.log('상품유형 : ', '기본')
  } else {
    console.log('상품유형 : ', type)
  }
  console.log('데이터 : ',data);
  return (
    <div>111</div>
  )
}

export default Merchandise;