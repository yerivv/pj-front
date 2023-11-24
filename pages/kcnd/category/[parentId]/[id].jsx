import { useRouter } from "next/router";

const CategoryList = () => {
  const router = useRouter();
  const { id } = router.query;
  return(
    <div className="kcnd-page">
      {id}
      <div className="section merchandise-wrap">
      </div>
    </div>
  )
}

export default CategoryList;