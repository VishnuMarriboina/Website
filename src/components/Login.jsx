// import a2 from '../images/login/b7.avif'
import a3 from '../Images/login/bg8.avif'
import { useState } from "react";
function Login(){
    
    const[id ,setId]=useState("")
    const[password,setPassword]=useState("")
    
    const[error,setError]=useState({
        id:"",
        password:""
    })
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const intcod = /^\d{8}$/;

    function check(){
  if(id.trim()===""){
    setError((error)=>({...error,id:"Error"}))
  }
      else if(!emailPattern.test(id)){
            setError((error)=>
              ({...error,id:"Error"}))
  } 
else {  
  setError((error)=>
   ({...error,id:"Ok"}) 
  );
}
if(password.trim()===""){
  setError( (error)=>
  ({...error,password:"Error"})
  )}
    else if(!intcod.test(password)){
          setError((error)=>({...error,password:"Error"}))
} 
else {
setError((error)=>({...error,password:"Ok"}));
}}

return(<>
  <div
  className="w-full h-screen bg-local bg-no-repeat bg-center object-cover flex"
  style={{
    backgroundImage: `url(${a3})`,
    backgroundSize: 'cover', 
   
  }}>

<div className='text-center shadow-white shadow-inner mx-auto p-10 my-28'>
  <h1 className='font-semibold text-3xl text-white mb-10'>Welcome to Order Managenemt System </h1>
  <label className="mx-auto font-medium text-white text-xl"> <span className="font-bold">Enter-ID :</span>
         <input  type="text" placeholder="mail-id" value={id} className="border  text-black mx-4 my-4 rounded-2xl p-2"
          onChange={(e)=>{let val=e.target.value;
            setId(val);
         }}/>
       {error.id&&<span>{error.id}</span>}
       </label> <br />


       <label className="mx-auto font-medium text-white text-xl"> <span className="font-bold">PassWord:</span>
         <input  type="password" placeholder="password" value={password}  className="border  text-black mx-4 my-4 rounded-2xl p-2"
          onChange={(e)=>{let val=e.target.value;
            setPassword(val)
         }}/>
         {error.password&&<span>{error.password}</span>}     
       </label> <br />
       <button className='bg-slate-400 font-semibold border rounded-lg px-60 py-3 mt-8 text-xl hover:bg-white'
        onClick={check}
       >LOGIN</button>
</div>
</div>
</>)
}
export default Login
