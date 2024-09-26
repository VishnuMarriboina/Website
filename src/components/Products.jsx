import React from "react";
import a1 from '../Images/Product/60mm.jpg'
import a2 from '../Images/Product/40mm.png'
import a3 from '../Images/Product/20mm.png'
import a4 from '../Images/Product/12mm.png'
import a5 from '../Images/Product/6mm.png'
import a6 from '../Images/Product/Sand.webp'
import a7 from '../Images/Product/dust.webp'
import a8 from '../Images/Product/wet.jpeg'
import a9 from '../Images/Product/gsb.jpeg'
import a10 from '../Images/Product/gravels.jpg'
function Products(){


    return(<>

  <div className="bg-slate-900 text-center justify-center items-center text-3xl  font-semibold h-[50px]"><p className="md:mt-5 text-white">Simplifing Your Construction Aggregates supply
    </p></div>
    <div className="bg-slate-900 text-center justify-center items-center text-3xl  font-semibold h-[50px]"><p className=" text-gray-300">AND
    </p></div>
    <div className="bg-slate-900 text-center justify-center items-center text-3xl  font-semibold h-[50px] shadow-xl sticky z-50 top-[90px]"><p className=" text-white">Stone Aggregates in ServCrust platform
    </p></div>

<div className='grid grid-cols-3 gap-6 mx-16 mb-12 mt-10 '>
   <div className="  rounded-xl p-4 shadow-xl hover:scale-105 hover:bg-slate-50">
    <img src={a1} alt="" className='rounded-xl border-2 mx-auto h-[40%] mt-5'/>
    
    <h1 className='mt-6 font-bold'>Product Name:</h1><p>60mm Stone Aggregates</p>
    <h1 className='mt-3 font-bold'>Application:</h1><p>Often used in projects like dams and retaining walls.</p>
     <button className='bg-indigo-400 rounded-lg p-3 mt-6 '>Buy Now</button>

   </div >
   <div className=" rounded-xl p-4 shadow-xl hover:scale-105 hover:bg-slate-50">
    <img src={a2} alt="" className='rounded-xl border-2 mx-auto mt-5'/>
    <h1 className='mt-6 font-bold'>Product Name:</h1><p>40mm Stone Aggregates</p>
    <h1 className='mt-3 font-bold'>Application:</h1><p>Commonly used in foundations and road sub-bases.</p>
     <button className='bg-indigo-400 rounded-lg p-3 mt-4'>Buy Now</button></div>


   <div className=" rounded-xl p-4 shadow-xl hover:scale-105 hover:bg-slate-50">
    <img src={a3} alt="" className='rounded-xl  border-2 mx-auto mt-5'/>
    <h1 className='mt-6 font-bold'>Product Name:</h1><p>20mm Stone Aggregates</p>
    <h1 className='mt-3 font-bold'>Application:</h1><p>Used in concrete mixes and asphalt production.</p>
     <button className='bg-indigo-400 rounded-lg p-3 mt-4 '>Buy Now</button></div>


   <div className=" rounded-xl p-4 shadow-xl hover:scale-105 hover:bg-slate-50">
    <img src={a4} alt="" className='rounded-xl  border-2 mx-auto mt-5'/>
    <h1 className='mt-6 font-bold'>Product Name:</h1><p>12mm Stone Aggregates</p>
    <h1 className='mt-3 font-bold'>Application:</h1><p>Widely used in reinforced concrete projects.</p>
     <button className='bg-indigo-400 rounded-lg p-3 mt-9 mb-14'>Buy Now</button></div>


   <div className="  rounded-xl p-4 shadow-xl hover:scale-105 hover:bg-slate-50"> 
    <img src={a5} alt="" className='rounded-xl  border-2 mx-auto mt-5'/>
    <h1 className='mt-6 font-bold'>Product Name:</h1><p>6mm Stone Aggregates</p>
    <h1 className='mt-3 font-bold'>Application:</h1><p>Used in concrete mixes for finer textures, especially in paving blocks</p>
     <button className='bg-indigo-400 rounded-lg p-3 mt-4 '>Buy Now</button></div>


   <div className=" rounded-xl p-4 shadow-xl hover:scale-105 hover:bg-slate-50">
    <img src={a6} alt="" className='rounded-xl  border-2 mx-auto h-[40%] mt-5'/>
    <h1 className='mt-6 font-bold'>Product Name:</h1><p>Manufactured Sand(M-Sand)</p>
    <h1 className='mt-3 font-bold'>Application:</h1><p>M-Sand is a artificial sand created by crushing hard materials into small, angular</p>
     <button className='bg-indigo-400 rounded-lg p-3 mt-4'>Buy Now</button></div>


   <div className=" rounded-xl p-4 shadow-xl hover:scale-105 h-[600px] hover:bg-slate-50">
    <img src={a7} alt="" className='rounded-xl  border-2 mx-auto mt-5 h-[40%]'/>
    <h1 className='mt-6 font-bold'>Product Name:</h1><p>Dust (Stone Dust or Filler)</p>
    <h1 className='mt-3 font-bold'>Application:</h1><p>Commonly used as a base for patios, walkways, and driveways, providing stability and a level surface.</p>
     <button className='bg-indigo-400 rounded-lg p-3 mt-4'>Buy Now</button></div>


<div className=" rounded-xl p-4 shadow-xl hover:scale-105 hover:bg-slate-50">
    <img src={a9} alt="" className='rounded-xl  border-2 mx-auto mt-5 h-[40%]'/>
    <h1 className='mt-6 font-bold'>Product Name:</h1><p>Wetmix</p>
    <h1 className='mt-3 font-bold'>Application:</h1><p>Essential layers in road construction. Wetmix provides a strong.</p>
     <button className='bg-indigo-400 rounded-lg p-3 mt-4'>Buy Now</button></div>

     <div className=" rounded-xl p-4 shadow-xl hover:scale-105 hover:bg-slate-50">
    <img src={a8} alt="" className='rounded-xl  border-2 mx-auto mt-5 h-[40%]'/>
    <h1 className='mt-6 font-bold'>Product Name:</h1><p>GSB (granular Sub Base)</p>
    <h1 className='mt-3 font-bold'>Application:</h1><p>Essential layers in road construction. GSB forms the load-bearing.</p>
     <button className='bg-indigo-400 rounded-lg p-3 mt-4'>Buy Now</button></div>

     <div className=" rounded-xl p-4 shadow-xl hover:scale-105 hover:bg-slate-50">
    <img src={a10} alt="" className='rounded-xl  border-2 mx-auto mt-5 h-[40%]'/>
    <h1 className='mt-6 font-bold'>Product Name:</h1><p>gravel</p>
    <h1 className='mt-3 font-bold'>Application:</h1><p>Widely used in landscaping, as well as in the construction of roads and walkways.</p>
     <button className='bg-indigo-400 rounded-lg p-3 mt-4'>Buy Now</button>
     </div>
</div> 
    </>)
}
export default Products