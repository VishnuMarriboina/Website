import r from '../Images/Scan/r.jpg'
import l from '../Images/Scan/w1.png'
import c from '../Images/Scan/dr1.webp'
function Wup(){
    return(<>
    
    <div className='flex   justify-center items-center mx-10 my-20 '>
<div className='flex gap-3 justify-center items-center '>
  <img src={r} alt="" className='shadow-xl w-[500px] h-[500px] ml-10 object-cover'/>
  <img src={c} alt="" className='shadow-xl w-[500px] h-[500px]  object-cover'/>
  <img src={l} alt="" className='shadow-xl w-[500px] h-[500px] mr-10 object-fill'/>
</div>
    </div>
    </>)
}
export default Wup