'use client';
import { useRouter } from "next/navigation";
import { use } from 'react'
import { useSearchParams } from "next/navigation";
import { questions } from "@/app/questions";
import { useState, useEffect } from "react";

export default function ID({ params }) {
  const searchParams = useSearchParams();
  const score = searchParams.get('score') | 0;
  const router = useRouter();
  const unwrappedParams = use(params);
  const id = parseFloat(unwrappedParams.id);
  const [selected, setSelected] = useState(null);
  const totalQuestions = questions.length;

  useEffect(() => {
    if (id > totalQuestions + 1) router.push("/test");
  }, [id]);

  if (id > totalQuestions) return null;
  const question = questions[id - 1];
  const handleNext = () => {
    if (selected) {
      let res;
      let temp=searchParams.get('score') | 0;
      if(selected==="Yes")  res=10;
      else if(selected==="No")  res=0;
      else  res=5;
      let s=parseInt(temp);
      let updatedScore=s+res;
      let n=parseFloat(updatedScore/10);
    //   localStorage.setItem(`q${id}`, selected);
    if(id<=8) router.push(`/test/${id + 1}?score=${updatedScore}`);
    else{
        router.push(`/test?score=${n}`);
    }
  };
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col justify-center items-center p-6">
      <div className="bg-[#1A1A1A] rounded-2xl p-8 shadow-md max-w-xl w-full">
        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center">
          Question {id} of {totalQuestions}
        </h2>
        <p className="text-lg md:text-xl mb-8 text-center">{question?.text}</p>
        <div className="flex flex-col gap-4">
          {["Yes", "No", "Maybe"].map((option) => (
            <button
              key={option}
              className={`cursor-pointer px-6 py-3 rounded-xl text-lg border border-gray-600 hover:bg-gray-700 transition ${
                selected === option ? "bg-gray-700" : ""
              }`}
              onClick={() => setSelected(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="flex w-full md:gap-80 gap-28 items-center">
        {id!=1 && <button
          onClick={ () =>router.push(`/test/${id - 1}?score=${score}`)}
          className="cursor-pointer px-6 py-3 mt-4 rounded-xl mx-auto text-lg border border-gray-600 hover:bg-gray-700 transition"
        >
          Prev
        </button>}
        <button
          onClick={handleNext}
          className="cursor-pointer px-6 py-3 mt-4 rounded-xl mx-auto text-lg border border-gray-600 hover:bg-gray-700 transition"
          disabled={!selected}
        >
          {id<=8 ? <>Next</> : <>Submit</>}
        </button>            
        </div>
      </div>
    </div>
  );
}
