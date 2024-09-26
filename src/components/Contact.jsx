import React from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
function Contact(){

return(<>

<div className="bg-slate-900 text-center justify-center items-center text-8xl shadow-xl sticky z-50 top-[90px] font-semibold h-[100px]"><p className="md:mt-5 text-orange-500">Contact Us
    </p></div>
    <div className="bg-slate-900 text-center justify-center items-center text-3xl  font-semibold h-[50px]"><p className=" text-white">We align leaders around a shared purpose and strategic story that catalyzes their
    </p></div>
    <div className="bg-slate-900 text-center justify-center items-center text-3xl  font-semibold h-[50px]"><p className=" text-white">business and brand to take action.
    </p></div>

    <div className="max-w-screen-lg mx-auto px-4 py-8">
      <div className="flex flex-row   gap-2 md:flex-row justify-around items-start md:items-center mt-10 space-y-6 md:space-y-0">   
        <div className="flex flex-col items-center bg-indigo-200 p-6 rounded-md shadow-md w-full md:w-1/3 ">
          <span className="flex items-center justify-center w-16 h-16 bg-orange-500 text-white rounded-full mb-4">
            <FaMapMarkerAlt size={24} />
          </span>
          <h5 className="text-lg font-bold text-gray-800">Address:</h5>
          <p className="text-center text-gray-700">
          Aparna Green Homes, Flat-207, <br />
                  Hyderabad, TN-500032
          </p>
        </div>
        <div className="flex flex-col gp-2 items-center bg-indigo-200 p-6 rounded-md shadow-md w-full md:w-1/3">
          <span className="flex items-center justify-center w-16 h-16 bg-orange-500 text-white rounded-full mb-4">
            <FaEnvelope size={24} />
          </span>
          <h5 className="text-lg font-bold text-gray-800">Email:</h5>
          <a href="mailto:hello@company.com" className="text-orange-600 hover:underline">
            connect@servcrust.com
          </a>
          <a href="mailto:support@company.com" className="text-orange-600 hover:underline">
            support@servcrust.com
          </a>
        </div>
        <div className="flex flex-col items-center bg-indigo-200 p-6 rounded-md shadow-md w-full md:w-1/3">
          <span className="flex items-center justify-center w-16 h-16 bg-orange-500 text-white rounded-full mb-4">
            <FaPhoneAlt size={24} />
          </span>
          <h5 className="text-lg font-bold text-gray-800">Call us:</h5>
          <p className="text-center text-gray-700">
            88 11 88 1111 <br />
            1 (234) 987-654
          </p>
        </div>
      </div>
      <h1 className='text-4xl font-semibold mt-3'>
We are here to support <br />
We can offer a wide network of ServCrust Services providing expert service</h1>
    </div>

<div className="mx-16">                
<div className=" relative z-10 max-w-screen-xl px-4  pb-20 pt-10 pl-16 sm:grid-cols-2 sm:items-center sm:text-center sm:py-24 mx-auto sm:px-6 lg:px-4 md:pt-5 md:pr-5 md:-mr-2">
<div className=" max-w-2xl sm:mt-1 mt-10 space-y-6 text-center sm:text-right sm:ml-auto -mx-6">
</div>
</div> 
</div>
 <div className="bg-slate-900 text-center justify-center items-center text-6xl  font-semibold h-[190px]  mb-5"><p className=" text-white mx-28">Join with us and be a part of <br /> Better Tomorrow
 </p></div>
</>)
}
export default Contact