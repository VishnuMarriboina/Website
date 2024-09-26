import { IoLogoWhatsapp } from "react-icons/io";
import Lottie from "react-lottie";
import { Link } from 'react-router-dom';
import logo from "../assets/logo.json";

function Header() {
  const optionsDefault = {
    loop: true,
    autoplay: true,
    animationData: logo,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <div className="w-full h-[90px] bg-white shadow-xl sticky z-50 top-0">
      <div className="max-w-[1400px] mx-auto h-full px-4">
        <div className="flex justify-between items-center h-full">

          <div className="text-2xl font-bold flex items-center gap-1 text-orange-700">
            <Lottie options={optionsDefault} width={60} height={60} />
            <span>SERVCRUST</span>
          </div>

          <nav>
            <ul className="flex space-x-8 text-lg">
              <li><Link to="/" className=" hover:barder-4 cursor-pointer hover:text-white hover:bg-gray-900 hover:rounded-xl p-2 text-xl ">Home</Link></li>
              <li><Link to="/products" className=" cursor-pointer  hover:text-white hover:bg-gray-900 hover:rounded-xl p-2 text-xl">Products</Link></li>
              <li><Link to="/services" className=" cursor-pointer  hover:text-white hover:bg-gray-900 hover:rounded-xl p-2 text-xl">Careers</Link></li>
              <li><Link to="/contact"  className=" cursor-pointer  hover:text-white hover:bg-gray-900 hover:rounded-xl p-2 text-xl">Contact us</Link></li>
            </ul>
          </nav>

          <div className="flex items-center gap-5">
            <div><Link to="/login" className="hover:text-white cursor-pointer hover:bg-gray-900 hover:rounded-xl focus:ring-4 focus:ring-gray-300 focus:rounded-lg p-2 text-2xl">Login</Link></div>
            <span className="text-7xl rounded-xl bg-green-600"><IoLogoWhatsapp /></span>
            <button className="px-8 py-4 text-4xl bg-green-600 text-white rounded hover:bg-green-500">
            <Link to="/whatsup" className="hover:text-gray-700 cursor-pointer"> Join With Us</Link>
             
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Header;
