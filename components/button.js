'use client'
import { ArrowRight, Link } from "lucide-react";
import React from 'react'
import { useRouter } from 'next/navigation';

const Button = ({props}) => {
   const router=useRouter();
  const handleLogin=()=>{
    if(props==='welcome') router.push(`/${props}`);
    else  router.push(`/${props}/1`);
  }
  return (
    <div>
      <button onClick={handleLogin} className="group cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-pink-500/50 transition duration-300">
          {props==='welcome' ? <>Start Now</> : <>Start Test</>} <ArrowRight className="transition-transform group-hover:translate-x-1" />
        </button>
    </div>
  )
}

export default Button
