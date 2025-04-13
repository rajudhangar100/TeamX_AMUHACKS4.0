import Button from "@/components/button";
import { ArrowRight } from "lucide-react";

export default function Welcome() {
  return (
    <div className="bg-[#0f0f0f] text-white font-sans min-h-screen">
      <div className="flex flex-col lg:flex-row items-center justify-between w-[90%] mx-auto py-12">
        {/* Left Section */}
        <div className="w-full lg:w-[50%] space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-md">
            Welcome Learner !!👋
          </h1>
          <p className="text-xl text-gray-300 max-w-xl">
            Our platform helps in <span className="text-white font-semibold">early detection of Dyslexia</span> using AI by analyzing responses from a simple test.
            <br /><br />
            Once the test is complete, users receive personalized feedback and engaging therapy exercises tailored to their specific needs.
          </p>
          <Button props={'test'}/>
        </div>

        {/* Right Section - Optional Image or Animation */}
        <div className="w-full lg:w-[50%] mt-10 lg:mt-0 flex justify-center items-center">
          <div className="rounded-3xl shadow-2xl shadow-purple-700/50   h-[70vh] max-h-[500px]">
            {/* Placeholder for a visual */}
            <img
              src="/welcome.png"
              alt="Illustration"
              className="object-contain w-full h-full rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
