import q1 from '../Images/Scan/dr1.webp'

function Qr() {

    return(<>
        <div className="flex mx-60 my-10 gap-8 sticky top-[90px] z-">

       
        <div className=" border-2 border-black rounded-lg  h-[600px] w-[500px] shadow-2xl stickyz-50 top-0 ">
          <h1 className='text-5xl  ml-44 font-semibold '>Scan me!!</h1>
         <div>
          <img src={q1} alt="" />
         </div>
        </div>
        <div className="border-2 border-black rounded-lg bg-slate h-[600px] w-[500px] shadow-2xl text-center">
                   <span className="text-xl ">Follow the steps to connect SERVCRUST </span>   


          <div className=" h-[150px] w-[400px] mx-12 my-4 mt-8 border-4 rounded-2xl text-xl font-medium hover:scale-110">
          <span className='text-4xl font-bold  '>STEP-1</span>
            <h1 className='mt-3'>Send hi and your GPS
            location to check out products available to purchase.</h1>
          </div>
          <div className=" h-[150px] w-[400px] mx-12 my-1 border-4 rounded-2xl text-xl font-medium hover:scale-110">
          <span className='text-4xl font-bold'>STEP-2</span>
            <h1 className='mt-3'>Choose the product
                and quantity as per
                                  your need.</h1>
          </div>

          <div className=" h-[150px] w-[400px] mx-12 my-4 border-4 rounded-2xl text-xl font-medium hover:scale-110">
            <span className='text-4xl font-bold '>STEP-3</span>
            <h1 className='mt-2'>Make payment via UPI or
                            choose Pay- on-Delivery (PoD)
                    to deliver products within 24 hours.</h1>
          </div>
        </div>
        </div>
        </>)
}

export default Qr 