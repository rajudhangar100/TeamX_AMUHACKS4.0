import React from "react";
import { ArrowRight, Link } from "lucide-react";


const DOCTORS = [
  {
    name: "Dr. Asha Mehta",
    experience: 15,
    contact: "asha.mehta@dyslexiacare.com",
    specialization: "Cognitive Behavioral Therapy"
  },
  {
    name: "Dr. Rohan Kapoor",
    experience: 10,
    contact: "rohan.kapoor@neuroclinic.in",
    specialization: "Speech & Language Therapy"
  },
  {
    name: "Dr. Nisha Rao",
    experience: 12,
    contact: "nisha.rao@childdevelopment.org",
    specialization: "Multisensory Reading Intervention"
  }
];

export default function DoctorProfiles() {
  return (
    <div className="text-white font-sans min-h-screen">
      <div className="w-[90%] mx-auto py-12">
        <h1 className="text-5xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-md mb-8">
          Dyslexia Experts
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mb-12">
          Meet our top specialists dedicated to early detection and treatment of dyslexia.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {DOCTORS.map((doctor) => (
            <div
              key={doctor.name}
              className="bg-white text-gray-900 p-6 rounded-3xl shadow-lg border border-purple-200"
            >
              <h2 className="text-2xl font-bold mb-2 text-purple-700">{doctor.name}</h2>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Experience:</span> {doctor.experience} years
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Specialization:</span> {doctor.specialization}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-semibold">Contact:</span> {doctor.contact}
              </p>
              <button  className="group cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-pink-500/50 transition duration-300">
          Know us<ArrowRight className="transition-transform group-hover:translate-x-1" />
        </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}