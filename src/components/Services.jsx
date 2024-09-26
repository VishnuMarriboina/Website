import f1 from '../Images/Jobs/Front-end.webp'
import b1 from '../Images/Jobs/Back-end.jpg'
import q1 from '../Images/Jobs/qa.jpg'
import se from '../Images/Jobs/S-E.jpg'
import ba1 from '../Images/Jobs/ba1.png'
import pm1 from '../Images/Jobs/pm.png'
import op from   '../Images/Jobs/om.jpg'
import bg2 from '../Images/Jobs/b2b1.jpg'
function Services(){


    return(<>  
    <div className="w-full h-screen  mx-auto ">
    <div className="relative w-full h-full flex flex-col bg-white justify-between items-center  mt-2 ">
            <div className=" shadow-xl w-[100%] h-[80%] ">
              
             <img src={bg2} alt="drop image " className=" shadow h-full w-full rounded-2xl object-fill" />
             <div className="absolute top-[25%] left-[10%] flex flex-col">
             <p className=" text-black font-semibold text-5xl">Join with</p>
                               <h1 className="text-9xl font-bold text-black">SERVCRUST</h1>
                                
                          </div> 
            </div>     
    </div>
    </div>

<div className='grid grid-cols-3 gap-8 mx-16 mb-12'>
   <div className="  rounded-xl p-4 shadow-xl hover:scale-105">
    <img src={f1} alt="" className='rounded-xl border-2'/>
    
    <h1 className='mt-12 font-semibold'>Job Description:</h1><p>Front-end Developer will work on the Web 2.0 and 3.0 project</p>
     <button className='bg-indigo-400 rounded-lg p-3 '>Apply</button>

   </div >
   <div className=" rounded-xl p-4 shadow-xl hover:scale-105">
    <img src={b1} alt="" className='rounded-xl'/>
    
    <h1 className='font-semibold'>Job Description:</h1><p>Back-end Developer will work on the Web 2.0 and 3.0 project</p>
     <button className='bg-indigo-400 rounded-lg p-3 '>Apply</button></div>
   <div className=" rounded-xl p-4 shadow-xl hover:scale-105">
    <img src={q1} alt="" className='rounded-xl'/>
    <h1 className='font-semibold'>Job Description:</h1><p>Enhance and optimize automated testing framework</p>
     <button className='bg-indigo-400 rounded-lg p-3 '>Apply</button></div>
   <div className=" rounded-xl p-4 shadow-xl hover:scale-105">
    <img src={se} alt="" className='rounded-xl'/>
    
    <h1 className='font-semibold'>Job Description:</h1><p>Analyzing the reports and customer surveys</p>
     <button className='bg-indigo-400 rounded-lg p-3 '>Apply</button></div>
   <div className="  rounded-xl p-4 shadow-xl hover:scale-105"> 
    <img src={pm1} alt="" className='rounded-xl'/>
    
    <h1 className='font-semibold'>Job Description:</h1><p>Manage and oversee multiple projects within the program portfolio</p>
     <button className='bg-indigo-400 rounded-lg p-3 '>Apply</button></div>
   <div className=" rounded-xl p-4 shadow-xl hover:scale-105">
    <img src={ba1} alt="" className='rounded-xl '/>
    
    <h1 className='font-semibold'>Job Description:</h1><p>Propose and implement streamlined processes to enhance efficiency</p>
     <button className='bg-indigo-400 rounded-lg p-3 '>Apply</button></div>
   <div className=" rounded-xl p-4 shadow-xl hover:scale-105">
    <img src={op} alt="" className='rounded-xl'/>
    <h1 className='font-semibold'>Job Description:</h1><p>Experience in management operations and leadership</p>
     <button className='bg-indigo-400 rounded-lg p-3 '>Apply</button></div>
</div>    
</>)
}
export default Services