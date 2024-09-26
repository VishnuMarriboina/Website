import a1 from '../Images/Home/1.png'
import a2 from '../Images/Home/2.png'
import a3 from '../Images/Home/3.png'
import a4 from '../Images/Home/4.png'
import a5 from '../Images/Home/6.png'
import t1 from'../Images/Home/dump-truck.jpg'
import ceo from '../Images/Home/CEO.png'
import cto from '../Images/Home/CTO.png'
import logo from '../Images/Home/logo-header.png'
import map from '../Images/Home/land-img.png'
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Lottie  from 'react-lottie';
import image from '../assets/image.json'
import Scan from '../assets/Scan.json'
import map1 from '../assets/Map.json'
import { BsQrCodeScan } from "react-icons/bs";
import { FcCheckmark } from "react-icons/fc";
import { AiOutlineSolution } from "react-icons/ai";
import { VscServerProcess } from "react-icons/vsc";
import { TbMessage2Code } from "react-icons/tb";
import { Link } from 'react-router-dom'
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";

function split(inputString) {
  const characters = [];
  const regex = /[\s\S]/gu;

  let match;
  while ((match = regex.exec(inputString)) !== null) {
    characters.push(match[0]);
  }

  return characters;
}

const charVariant = {
  hidden: { opacity: 0 },
  reveal: { opacity: 1 },
};
function Hero()
{
    const imog = {
        loop:true,
        autoplay:true,
        animationData:image,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
          }
    }
    const scan = {
        loop:true,
        autoplay:true,
        animationData:Scan,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
          }
    }
    const m = {
      loop:true,
      autoplay:true,
      animationData:map1,
      rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
  }
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
           responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};
const bs="WELCOME TO";
const bm=split(bs)
const sv="SERVCRUST";
const scv=split(sv);
  return(<>
       <div className="max-w-[1400px] h-[calc(100vh-72px)] bg-white mx-auto my-5">
            <div className="grid grid-cols-2 ">
                
                <div className=" flex flex-col py-5 gap-[25px] justify-center">
                                       <motion.h1
                          initial="hidden"
                          whileInView="reveal"
                          transition={{ staggerChildren: 0.2 }}
                     className='font-semibold  text-left -mt-3 text-3xl'>
                        {bm.map((Wc,index) => (
          <motion.span
            key={index}
            transition={{ duration: 0.05 }}
            variants={charVariant} 
           
          >
       {Wc}</motion.span>))}
                     
                      </motion.h1>
                      <motion.h1
                          initial="hidden"
                          whileInView="reveal"
                          transition={{ staggerChildren: 0.2 }}
                     className='text-left -mt-3 font-bold text-7xl'>
                        {scv.map((Wc,index) => (
          <motion.span
            key={index}
            transition={{ duration: 0.05 }}
            variants={charVariant} 
           
          >
       {Wc}</motion.span>))} 
                     
                      </motion.h1>
                    <p className='text-3xl my-6'>
                        Bharat's 1st <br />
                        <span className='text-3xl font-bold'>E-COMMERCE PLATFORM </span><br />
                        FOR STONE AGGREGATES
                        </p>
                    <p className='font-semibold text-4xl text-orange-950 '> Transforming the stone Aggregate Industry with State of the art Technology</p>
                </div>
                <div className="flex ">
                    <Lottie options={imog}/>
                </div>
            </div>
       </div>
       <div className="max-w-[1400px] h-[calc(100vh-72px)] bg-white mx-auto my-16  rounded-3xl">
            <div className="grid grid-cols-2 ">
            <div className="flex w-[90%] h-[100%] overflow-hidden shadow-lg rounded-3xl">     
                    <Lottie options={scan}/>
                </div>
                <div className=" flex flex-col py-5 gap-[25px] items-center justify-center bg-yellow-100 shadow-xl rounded-3xl">
                    <h1 className='font-bold text-2xl text-left -mt-3'>Scan to connect</h1>
                    <h1 className='font-bold text-2xl '>SERVCRUST</h1>
                    <p className='font-semibold text-xl ml-10'> The ServCrust is that platform integrates <span className='text-4xl font-extrabold'>WhatsApp</span> and <span className='text-4xl'>MobileApp </span>for effortless order placement and communication.</p>
                    <button className='flex p-4 bg-orange-600 items-center gap-2 text-2xl rounded-lg mt-28 hover:scale-110 hover:bg-orange-500'>
                      <span className='text-2xl'><BsQrCodeScan /></span>
                        <p><Link to="/qr" className='cursor-pointer'>click here for QR</Link></p>
                    </button>
                </div>
            
            </div>
       </div>
<div className='mt-8 mb-9'>
    <div className='  rounded-full h-[] text-5xl  font-bold'>
    <h1 className=' text-center my-5 text-6xl '>About ServCrust</h1>
    </div>
    <div className='bg-gray-900 h-[250px] w-full text-center justify-center items-center my-6'>
    <h1 className='text-5xl text-white font-semibold text-center mx-20 py-24'> Your Trusted Partner in Driving Technological Innovation and Change in the Stone Aggregate Industry</h1>
    </div>
   
    <p className='text-xl mx-8 ml-20 mb-8'><span className='text-3xl'>ServCrust</span> is a dynamic and innovative digital platform that specializes in serving the construction industry. Our company is dedicated to revolutionizing traditional operations in the construction domain through the utilization of advanced technology and streamlined process. <br /></p>
    <p className='text-xl mx-8 ml-20 mb-8'> At <span className='text-3xl'>ServCrust</span>, our objective is not just transforming the construction industry; We are reimaging the way projects are executed. We envision a future where every endeavour, from towering skyscrapers to community infrastructure, is executed with unparalleled efficiency and precision. Our vision is rooted in seamlessly integrated advanced technology into the very fabric of practices associated with infrastructure. br
    </p>
    <p className='text-xl mx-8 ml-20 mb-8'>Our Mission is to position ServCrust as a market leading platform for procuring and trading materials associated with infrastructure development. We are creating an ecosystem where our partners flourish scale and operate seamlessly delighting their customers.
<br /></p>
</div>
<div className='bg-slate- flex flex-col-2 mx-20 gap-10 my-10' >
  
<div className='border-2 border-black rounded-lg my-16'>

  <img src={map} alt="" className='barder-4 rounded-2xl mt' />
</div>
<div className='border-2  rounded-lg bg-slate-400 h-[450px] w-[700px] my-16'>
  <p className='text-center font-bold text-7xl'>ServCrust</p>
<p className='text-4xl font-semibold text-white text-center mt-20'>Performance to succeed today. Technology to lead tomorrow. </p>
<p className='mt-10 text-2xl font-medium ml-3' >Building India's Largest B2B Platform for Procuring Infrastructure Construction Materials</p>

</div>
</div>
<div className='h-[90px] bg-orange mx-10 mt-10 mb-6 my-20'>
  <h1 className='text-center font-bold text-6xl '>How <span className='text-6xl shadow-xl rounded-lg text-white bg-black px-2'>ServCrust</span> work!!</h1>
  </div>
  
<div className="max-w-[1400px] h-[calc(100vh-72px)] bg-white mx-auto mt-14  rounded-3xl">
            <div className="grid grid-cols-2 ">
            <div className="flex w-[90%] h-[100%] overflow-hidden shadow-lg rounded-3xl">     
                    <Lottie options={m}/>
                </div>
                <div className=" border-4 border-black  bg-yellow-100 shadow-xl rounded-3xl">
                  <div className='flex flex-row bg-white border-red-400 rounded-xl m-4 text-center mt-10 hover:scale-105 hover:bg-indigo-500 '>
                  <span className='text-5xl'> <FcCheckmark /></span> 
                  <h1 className='text-4xl font-semibold ml-4'>Track your Truck</h1>
                  </div>
                  <div className='flex flex-row bg-white border-red-400 rounded-xl text-center mt-10 m-4 hover:scale-105 hover:bg-indigo-500 '>
                  <span className='text-5xl'> <FcCheckmark /></span> 
                  <h1 className='text-4xl font-semibold ml-4'>We provide ontime delivery</h1>
                  </div>
                  <div className='flex flex-row bg-white border-red-400 rounded-xl text-center m-4 mt-10 hover:scale-105 hover:bg-indigo-500 '>
                  <span className='text-5xl'> <FcCheckmark /></span> 
                  <h1 className='text-4xl font-semibold ml-4'>Improvement in logistics utilization </h1>
                  </div>  
                  <div className='flex flex-row bg-white border-red-400 rounded-xl text-center m-4 mt-10'>
                      <img src={t1} alt="" className='rounded-lg mx-auto' />
                  </div>  
                </div>
                 
            </div>
       </div>
       <h1 className='text-6xl font-semibold ml-20 mb-3 text-center py-[30px] my-8'>Our Business strategy</h1>
 <div className=' mx-8 bg- mb-6 p-4 rounded-lg my-5 bg-black'> 
    <Slider {...settings} className=''>
        <div>
        <div className="  pl-[5%] pr-[5%] pt-[5%] pb-[5%]  rounded border-orange-300 hover:scale-105"> <img src={a1} alt="" className='w-full h-full object-cover  rounded' /> </div>
        </div>
        <div>
        <div className=" pl-[5%] pr-[5%] pt-[5%] pb-[5%]   rounded border-orange-300 hover:scale-105"><img src={a2} alt="" className='w-full h-full object-cover  rounded'/>   </div>
        </div>
        <div>
        <div className=" pl-[5%] pr-[5%] pt-[5%] pb-[5%]   rounded border-orange-300 hover:scale-105"><img src={a3} alt="" className='w-full h-full object-cover  rounded'/>   </div>
        </div>
        <div>
        <div className=" pl-[5%] pr-[5%] pt-[5%] pb-[5%]   rounded border-orange-300 hover:scale-105"><img src={a4} alt="" className='w-full h-full object-cover  rounded'/>   </div>
        </div>
        <div>
        <div className=" pl-[5%] pr-[5%] pt-[5%] pb-[5%]   rounded border-orange-300 hover:scale-105"><img src={a5} alt="" className='w-full h-full object-cover rounded'/>   </div>
        </div> 
    </Slider>                           
 </div> 

 <h1 className='text-6xl text-center font-medium py-[30px]'>Our Promises </h1>
 <div className='bg-indigo-200 my-3 py-[20px] border rounded-lg shadow-lg'>
       <div className='flex flex-row gap-12 mx-28'>
  <div className='my-10 border-2 border-indigo-950 rounded-xl p-4 hover:scale-105 hover:bg-white'>
                 <span className='flex justify-center items-center text-5xl mb-3'><AiOutlineSolution /></span>    
     <h1 className='text-center text-2xl font-semibold'>Smart Solutions</h1>
       <p className='text-center font-normal text-lg'>We listen to your unique needs, then deliver smart, high-quality solutions that are right-sized to meet your objectives and your budget.</p>
    </div>

  <div className='my-10 border-2 border-indigo-950 rounded-xl p-4 hover:scale-105 hover:bg-white '>
    <span className='flex justify-center items-center text-5xl mb-3'><VscServerProcess /></span>
    <h1 className='text-center text-2xl font-semibold'>Powerful Processes</h1>
    <p className='text-center font-normal text-lg'>Our proven processes and commitment to continuous improvement greatly increase efficiency, delivering excellent results and ensuring your project stays on schedule.</p>
    </div>
  <div className='my-10 border-2 border-indigo-950 rounded-xl p-4 hover:scale-105 hover:bg-white'>
    <span className='flex justify-center items-center text-5xl mb-3'><TbMessage2Code /></span>
    <h1 className='text-center text-2xl font-semibold '>
    Communication & Collaboration</h1>
    
    <p className='text-center font-normal text-lg'>We'll ensure there are no surprises, keep everyone focused on a common goal, and allow you to gain new skills and knowledge in the process.</p>
    </div>
</div>
</div>
<div className='bg-yellow-50 mx-10 rounded-2xl shadow-md border-2 border-orange-300 hover:bg-orange-500 my-20 py-[30px]'>
     <h1 className='text-6xl font-semibold text-center my-6 mb-12'>Our Team</h1>
     <p className='text-xl ml-10 mx-auto mt-8'>At servcrust,we have a team of passionate indivisuals with diverse background who are commited to driving excellence and infusing innovation in everything we do. With over a" time of experiance " of experiance in the industry.We have buot a team of professional that enable us to deliver exceptional value to our clients </p>
     <div className='flex gap-6  items-center justify-center'>
      <div className='bg-slate-300 border-4 rounded-2xl my-6 '><img src={ceo} alt="" className='rounded h-[200px] w-[200px] mx-20 my-6'/>
      <h1 className='text-center text-xl mx-3'><span className='font-semibold text-4xl'>Kranthi Kiran Reddy</span> <br />Chief Executive Officer</h1>
      </div>
      <div className='bg-slate-300 border-4 rounded-2xl my-6 '><img src={cto} alt="" className='rounded-xl h-[200px] w-[200px] mx-20 my-6'/>
      <h1 className='text-center text-xl mx-3'><span className='font-semibold text-4xl'>Sandeep Pamidiparthi</span> <br />Chief Technology Officer</h1>
      </div>
     </div>
</div>

<div className='my-5'>
<Marquee>
  <div>
    <img src={logo} alt="" />
  </div>
</Marquee>
</div>

</>)}

export default Hero
