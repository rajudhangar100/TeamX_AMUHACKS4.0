'use client';

import { useState, useRef,useEffect } from "react";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import { useSearchParams } from 'next/navigation';
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";

const Test = () => {
    const searchParams = useSearchParams();
    const score = searchParams.get('score');
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState("");
    const [transcript, setTranscript] = useState("");
    const [prediction,setprediction]=useState("");
    const mediaRecorderRef = useRef(null);
    const router=useRouter();
    const [isloading,setisloading]=useState(false);
    const audioChunks= [];
    let overallScore;
    
    useEffect(() => {
      if(prediction){
        overallScore = (0.80 * ((score/9)*100)) + (0.20 * (prediction));
      }
    }, [prediction])
    
  
    const startRecording = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
  
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
  
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.webm");
  
        const audioURL = URL.createObjectURL(audioBlob);
        setAudioURL(audioURL);
        setisloading(true)
        try{
            
            // const res = await axios.post("https://backend-dyslexia.onrender.com/transcribe/", formData, {
            //     headers: { "Content-Type": "multipart/form-data" },
            // });

            // console.log("Transcribed text: ",res.data.text);
            // setTranscript(res.data.text);
            setprediction(50);
            setisloading(false)
        }catch(error){
            console.log("Transcribed Error: ",error);
            setprediction(50);
            setisloading(false)
        };
  
      };
  
      mediaRecorderRef.current.start();
      setRecording(true);
    };
  
    const stopRecording = () => {
      mediaRecorderRef.current.stop();
      setRecording(false);
    };
  
  return (
     <div className="text-white min-h-screen bg-black px-8 py-12">
          <h1 className="text-4xl font-bold mb-6 text-center text-purple-500">Final Dyslexia Test: Read it!</h1>
          <p className="text-lg text-center text-gray-300 max-w-xl mx-auto mb-8">
          The fox ran fast through the fog.
    
          He saw five frogs near a log.
    
          One frog fell and flipped on a rock.
    
          “Funny frog!” said the fox, with a smile.
    
          The wind whooshed, and all frogs hopped away.
          </p>
    
          <div className="flex justify-center items-center gap-6">
            {!recording ? (
              <button
                onClick={startRecording}
                className="cursor-pointer bg-gradient-to-r from-pink-600 to-purple-700 px-6 py-3 rounded-full shadow-lg hover:shadow-pink-500/50 transition"
              >
                🎙 Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="cursor-pointer bg-gradient-to-r from-pink-600 to-purple-700 px-6 py-3 rounded-full shadow-lg hover:shadow-pink-500/50 transition"
              >
                ⏹ Stop Recording
              </button>
            )}
          </div>
    
          {audioURL && (
            <div className="mt-6 text-center">
              <audio controls src={audioURL} className="mx-auto mb-4" />
              {/* <h3 className="text-xl text-pink-400 font-semibold m-2">Transcription:</h3>
              <p className="text-gray-200 mt-2">{transcript}</p>
              <h3 className="text-xl text-pink-400 font-semibold m-2">Prediction:</h3>
              <p className="text-gray-200 mt-2">{prediction}</p> */}
            </div>
          )}
           <div className="flex justify-center items-center gap-6 my-6">
          {(prediction && isloading===false) &&
            <button onClick={() => router.push(`/scorecard?score=${overallScore}`)} className="text-center mx-auto group cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-pink-500/50 transition duration-300">
              Your ScoreCard <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </button>
          }
          {isloading && <Loader/>}
          </div>
    </div>
     
  )
}

export default Test
