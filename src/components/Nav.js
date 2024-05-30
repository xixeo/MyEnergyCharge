import Btn from '../05/Btn'
import { useNavigate } from 'react-router-dom'

export default function RouteNav() {
  const navigate = useNavigate();

  return (
    <div className='w-full flex flex-row flex-wrap ps-0'>     
      <Btn caption="좋아요 카드" handleClick={()=>{navigate('/03')}} customClass={'text-white text-sm '} />
      <Btn caption="로또번호 생성기" handleClick={()=>{navigate('/04')}} customClass={'text-white text-sm '} />
      <Btn caption="일일 박스오피스" handleClick={()=>{navigate('/05')}} customClass={'text-white text-sm '} />
      <Btn caption="푸드뱅크" handleClick={()=>{navigate('/06')}} customClass={'text-white text-sm '} />
      <Btn caption="교통사고 통계" handleClick={()=>{navigate('/07')}} customClass={'text-white text-sm '} />
      <Btn caption="부산 관광 정보" handleClick={()=>{navigate('/08')}} customClass={'text-white text-sm '} />
      <Btn caption="부산 축제 정보" handleClick={()=>{navigate('/09')}} customClass={'text-white text-sm '} />
      <Btn caption="단기예보" handleClick={()=>{navigate('/10')}} customClass={'text-white text-sm '} />
      <Btn caption="Recoil" handleClick={()=>{navigate('/12')}} customClass={'text-white text-sm '} />
      <Btn caption="Table" handleClick={()=>{navigate('/13')}} customClass={'text-white text-sm '} />
       {/* <Link to="/01">🍦</Link> */}
    </div>
  )
}
