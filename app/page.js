import Brain from "@/components/brain";
import Navbar from "@/components/navbar";
import Button from "@/components/button";

export default function Home() {  
  return (
    <div className=" text-white font-sans min-h-screen">

      <div className="flex flex-col lg:flex-row items-center justify-between w-[90%] mx-auto py-12 ">
        {/* Left Section */}
        <div className="w-full lg:w-[50%] space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-md">
            Dyslexi Ai
          </h1>
          <p className="text-xl text-gray-300 max-w-md">
            Early Detection and Therapy for Dyslexia using AI
          </p>
          <Button props={'welcome'}/>

        </div>

        {/* Right Section */}
        <div className="w-full lg:w-[60%] mt-10 lg:mt-0 ">
          <div className="rounded-3xl shadow-xl h-[70vh] flex justify-center  shadow-purple-700/50 ">
              <Brain/>
          </div>
        </div>
      </div>
    </div>
  );
}
