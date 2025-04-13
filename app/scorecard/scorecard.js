'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react'; // Icons

export default function ScoreCard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [readScore, setReadScore] = useState(0.0);

  useEffect(() => {
    const scoreFromParams = parseFloat(searchParams.get('score') || '0');
    if (!isNaN(scoreFromParams)) {
      setScore(scoreFromParams);
      setReadScore(scoreFromParams / 100);
    }
  }, [searchParams]);

  const getSummary = () => {
    if (score < 33.3) {
      return {
        color: 'bg-green-500',
        icon: <CheckCircle className="w-6 h-6 mr-2 text-white" />,
        label: 'Low Risk',
        message: 'You show minimal signs of dyslexia. Keep observing and practicing reading habits.',
      };
    } else if (score < 66.6) {
      return {
        color: 'bg-yellow-500',
        icon: <AlertTriangle className="w-6 h-6 mr-2 text-white" />,
        label: 'Moderate Risk',
        message: 'You might have some indicators of dyslexia. It is advisable to consult a specialist.',
      };
    } else {
      return {
        color: 'bg-red-500',
        icon: <AlertOctagon className="w-6 h-6 mr-2 text-white" />,
        label: 'High Risk',
        message: 'There is a high probability of dyslexia. Immediate evaluation and therapy are recommended.',
      };
    }
  };

  const summary = getSummary();
  const confidencePercent = Math.round(score);
  const readingPercent = Math.round(readScore * 100);

  return (
    
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="bg-[#121212] text-white p-10 rounded-2xl shadow-2xl w-full max-w-3xl space-y-10">
        <h2 className="text-4xl font-bold text-center text-white">Your Dyslexia ScoreCard</h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-12">
          {/* Confidence Gauge */}
          <div className="relative w-44 h-24">
            <div className="w-full h-full border-t-[10px] border-gray-800 rounded-t-full"></div>
            <div
              className={`absolute bottom-0 left-1/2 w-1 h-24 ${summary.color} origin-bottom`}
              style={{ transform: `rotate(${(confidencePercent / 100) * 180 - 90}deg)` }}
            ></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-sm">
              <span className="text-gray-300">Confidence Test</span>
              <span className="text-xl font-bold text-white">{confidencePercent}%</span>
            </div>
          </div>

          {/* Reading Ring */}
          {/* <div className="relative w-32 h-32">
            <svg className="rotate-[-90deg]" width="100%" height="100%" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#2d2d2d"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#3b82f6"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 45}
                strokeDashoffset={2 * Math.PI * 45 * (1 - readScore)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-sm text-gray-300">
              <span>Reading Test</span>
              <span className="text-xl font-semibold text-white">{readingPercent}%</span>
            </div>
          </div> */}
        </div>

        {/* Risk Summary */}
        <div className="text-center">
          <div className={`inline-flex items-center  justify-center px-6 py-2 rounded-full ${summary.color} text-lg font-bold`}>
            {summary.icon}
            {summary.label}
          </div>
          <p className="mt-4 text-gray-300">{summary.message}</p>
          <p className="mt-2 text-sm text-gray-500">Scores based on reading and 9-question analysis</p>
        </div>

        {/* Button */}
        <div className="text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 cursor-pointer bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold transition"
          >
            Start Therapy
          </button>
        </div>
      </div>
    </div>
  );
}
