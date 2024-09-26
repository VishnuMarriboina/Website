import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; 
import Footer from './components/Footer';
import Hero from './components/Hero';
import Products from './components/Products'; 
import Services from './components/Services'; 
import Contact from './components/Contact'; 
import Login from './components/Login'; 
import Qr from './components/Qr';
import Wup from './components/Wup'
import Term from './components/Policy/Term';
import Refund from './components/Policy/Refund';
import Privacy from './components/Policy/Privacy';
function App() {
  return (<>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Hero />} />
         <Route path="/products" element={<Products />} />
       <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/qr" element={<Qr />}/>
        <Route path="/term" element={<Term />}/>
        <Route path="/privacy" element={<Privacy />}/>
        <Route path="/refund" element={<Refund />} />
        <Route path="/whatsup" element={<Wup />} />
      </Routes>
    < Footer />
    </Router>
    </>);
}
export default App;
