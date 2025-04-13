'use client'
import { Sparkles, BookOpen, Volume2, Puzzle } from 'lucide-react';
import '@/app/script.css'
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router=useRouter();

  const games = [
    {
      name: "Phonics Game",
      desc: "Sound recognition & letter pairing",
      benefits: [
        "Improves phonemic awareness",
        "Builds letter-sound relationships",
        "Enhances auditory processing",
        "Increases vocabulary",
        "Boosts confidence in reading"
      ]
    },
    {
      name: "Rhyme Race",
      desc: "Find rhyming patterns",
      benefits: [
        "Enhances auditory discrimination",
        "Supports word prediction skills",
        "Improves listening memory",
        "Fosters reading rhythm",
        "Develops sound-based sorting"
      ]
    },
    {
      name: "Word Build Game",
      desc: "Construct meaningful words",
      benefits: [
        "Strengthens word formation",
        "Encourages spelling accuracy",
        "Builds vocabulary contextually",
        "Improves sequencing ability",
        "Increases reading fluency"
      ]
    }
  ];

  function GameCard({ icon: Icon, title, onClick }) {
    return (
      <div
        onClick={onClick}
        className="bg-white/10 backdrop-blur-md rounded-xl p-6 cursor-pointer shadow-lg hover:scale-105 hover:shadow-xl transition duration-300 border border-white/10 text-left"
      >
        <div className="flex items-center gap-3 mb-4">
          <Icon className="w-6 h-6 text-purple-300" />
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-sm text-gray-300">
          Click to start playing and improving reading skills.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black from-purple-900 via-indigo-900 to-indigo-950 text-white p-8 font-sans animate-gradient bg-[length:400%_400%]">
      {/* Header */}
      <h1 className="text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-400 to-indigo-400 drop-shadow-md">
        Dyslexi Ai Game Dashboard
      </h1>

      {/* Motivational Quote */}
      <div className="flex justify-center items-center mb-10 text-indigo-300 gap-2 text-lg italic">
        <Sparkles className="w-5 h-5" />
        "Learning is a treasure that will follow its owner everywhere."
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
        <GameCard icon={Volume2} title="Phonics Game" onClick={() => router.push('/phonics')} />
        <GameCard icon={Puzzle} title="Rhyme Race" onClick={() => router.push('/rhyme-race')} />
        <GameCard icon={BookOpen} title="Word Build Game" onClick={() => router.push('/word-build')} />
      </div>

      {/* Info Section */}
      <div className="bg-gray-950 py-16 px-6 text-white text-center">
      <h2 className="text-4xl font-bold mb-12 text-indigo-300">Why These Games Help with Dyslexia</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {games.map((game, index) => (
          <div
            key={index}
            className="group relative bg-indigo-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 text-center"
          >
            <h3 className="text-xl font-bold mb-2">{game.name}</h3>
            <p className="text-sm text-gray-200">{game.desc}</p>

            {/* Floating Hover Box */}
            <div className="reveal-box">
              <h4 className="text-lg font-semibold mb-2 text-indigo-300">Why It Helps:</h4>
              <ul className="list-disc text-left pl-5 text-sm space-y-1">
                {game.benefits.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>

</div>
);
}