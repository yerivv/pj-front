const BasicHeader = ({ pageName }) => {
  return (
    <header className="basic-header">
      <h1 className="blind">대한항공 기내면세점</h1>
      <h2>{pageName}</h2>
    </header>
  )
}

export default BasicHeader;