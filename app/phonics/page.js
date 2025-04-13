'use client'
import React, { useState, useEffect } from 'react';
import { Volume2, Check, X, TrendingUp, Award, Brain } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useRouter } from 'next/navigation';
// import { useNavigate } from 'react-router-dom';



const Difficulty = 'easy' | 'medium' | 'hard';

const PHONIC_CARDS = {
  easy: [
    { letter: 'A', word: ['apple', 'ant'] },
    { letter: 'B', word: ['ball', 'bat'] },
    { letter: 'C', word: ['cat', 'car'] },
  ],
  medium: [
    { letter: 'D', word: ['dog', 'dinner'] },
    { letter: 'E', word: ['egg', 'eat'] },
    { letter: 'F', word: ['fish', 'fun'] },
    { letter: 'G', word: ['goat', 'gold'] },
  ],
  hard: [
    { letter: 'H', word: ['hat', 'horse'] },
    { letter: 'I', word: ['ink', 'igloo'] },
    { letter: 'J', word: ['jug', 'jam'] },
  ],
};

// interface PerformanceData {
//   round: number;
//   score: number;
//   difficulty: Difficulty;
//   accuracy: number;
// }

const COLORS = ['#4F46E5', '#059669', '#DC2626'];

export default function PhonicsGame(){
  const router = useRouter();
  const [currentCard, setCurrentCard] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [voices, setVoices] = useState([]);
  const [performanceHistory, setPerformanceHistory] = useState([]);
  const [difficultyStats, setDifficultyStats] = useState({
    easy: { attempts: 0, correct: 0 },
    medium: { attempts: 0, correct: 0 },
    hard: { attempts: 0, correct: 0 },
  });

  useEffect(() => {
    const loadVoices = () => {
      const synthVoices = window.speechSynthesis.getVoices();
      setVoices(synthVoices);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    pickNewCard('medium');
  }, []);

  const pickNewCard = (level) => {
    const cards = PHONIC_CARDS[level];
    const randomIndex = Math.floor(Math.random() * cards.length);
    const baseCard = cards[randomIndex];
    const word = Array.isArray(baseCard.word)
      ? baseCard.word[Math.floor(Math.random() * baseCard.word.length)]
      : baseCard.word;
    setCurrentCard({ letter: baseCard.letter, word });
    setFeedback(null);
  };


  const playSound = () => {
    if (!currentCard) return;
    const utteranceText = `${currentCard.letter}, for ${currentCard.word}`;
    const utterance = new SpeechSynthesisUtterance(utteranceText);
    const indianVoice = voices.find(v => v.lang === 'en-IN' || v.name.toLowerCase().includes('india'));
    utterance.voice = indianVoice ?? undefined;
    utterance.rate = 0.85;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const updateDifficultyStats = (isCorrect) => {
    setDifficultyStats(prev => ({
      ...prev,
      [difficulty]: {
        attempts: prev[difficulty].attempts + 1,
        correct: prev[difficulty].correct + (isCorrect ? 1 : 0),
      },
    }));
  };

  const handleAnswer = (selectedLetter) => {
    if (!currentCard) return;
    const isCorrect = selectedLetter === currentCard.letter;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setScore(s => (isCorrect ? s + 1 : s));
    setAttempts(a => a + 1);
    setRounds(r => r + 1);
    updateDifficultyStats(isCorrect);

    const currentAccuracy = ((score + (isCorrect ? 1 : 0)) / (attempts + 1)) * 100;
    setPerformanceHistory(prev => [...prev, {
      round: rounds + 1,
      score: score + (isCorrect ? 1 : 0),
      difficulty,
      accuracy: currentAccuracy,
    }]);

    setTimeout(() => {
      if ((rounds + 1) % 5 === 0) {
        const accuracyRate = (score + (isCorrect ? 1 : 0)) / (attempts + 1);
        let nextDifficulty = difficulty;

        if (difficulty === 'easy' && accuracyRate >= 0.6) {
          nextDifficulty = 'medium';
        } else if (difficulty === 'medium') {
          if (accuracyRate >= 0.6) nextDifficulty = 'hard';
          else if (accuracyRate <= 0.3) nextDifficulty = 'easy';
        } else if (difficulty === 'hard' && accuracyRate <= 0.4) {
          nextDifficulty = 'medium';
        }

        setDifficulty(nextDifficulty);
        pickNewCard(nextDifficulty);
      } else {
        pickNewCard(difficulty);
      }
    }, 1200);
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-blue-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const pieData = [
    { name: 'Easy', value: difficultyStats.easy.attempts },
    { name: 'Medium', value: difficultyStats.medium.attempts },
    { name: 'Hard', value: difficultyStats.hard.attempts },
  ];

  if (!currentCard) return null;

  const allCards = Object.values(PHONIC_CARDS).flat();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans p-6">
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Game Panel */}
      <div className="bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 space-y-4 border border-gray-700">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-md flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-300" />
          Phonics Game
        </h2>
        <p className="text-md text-gray-400">Tap the sound button and pick the correct letter</p>
  
        <div className="flex justify-center">
          <button
            onClick={playSound}
            className="p-5 bg-gradient-to-r from-purple-700 to-pink-700 rounded-full text-white hover:scale-110 transition transform shadow-lg"
          >
            <Volume2 className="w-10 h-10" />
          </button>
        </div>
  
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {allCards.map((card) => (
            <button
              key={card.letter}
              onClick={() => handleAnswer(card.letter)}
              className={`p-4 rounded-xl text-2xl font-bold transition-all shadow-sm hover:shadow-md 
                ${
                  feedback === 'correct' && card.letter === currentCard.letter
                    ? 'bg-green-600 text-white'
                    : feedback === 'incorrect' && card.letter === currentCard.letter
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
            >
              {card.letter}
            </button>
          ))}
        </div>
  
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-6 bg-red-700 text-white px-6 py-2 rounded hover:bg-red-600 transition"
        >
          Finish Game
        </button>
  
        {feedback && (
          <div className={`flex items-center justify-center gap-2 p-3 mt-4 rounded-xl text-lg font-semibold 
            ${feedback === 'correct' ? 'bg-green-700 text-white' : 'bg-red-700 text-white'}`}>
            {feedback === 'correct' ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
            {feedback === 'correct' ? 'Correct!' : 'Oops! Try again'}
          </div>
        )}
      </div>
  
      {/* Dashboard */}
      <div className="bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 space-y-6 border border-gray-700">
        <div className="flex items-center gap-3">
          <Award className="h-8 w-8 text-pink-400" />
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-md">
            Performance Dashboard
          </h2>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700/80 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-purple-300 mb-1">Current Status</h3>
            <p className={`text-xl font-bold mb-1 ${getDifficultyColor(difficulty)}`}>
              Level: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </p>
            <p className="text-gray-200">
              Score: {score}/{attempts} ({attempts > 0 ? ((score / attempts) * 100).toFixed(0) : 0}%)
            </p>
          </div>
  
          <div className="bg-gray-700/80 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-pink-300 mb-1">Level Stats</h3>
            {Object.entries(difficultyStats).map(([level, stats]) => (
              <p key={level} className="text-sm text-gray-300">
                {level.charAt(0).toUpperCase() + level.slice(1)}: {stats.attempts > 0 ? ((stats.correct / stats.attempts) * 100).toFixed(0) : 0}% accuracy
              </p>
            ))}
          </div>
        </div>
  
        {performanceHistory.length > 0 && (
          <>
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Progress Over Time</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={performanceHistory}>
                  <XAxis dataKey="round" stroke="#cbd5e1" />
                  <YAxis stroke="#cbd5e1" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', color: 'white' }} />
                  <Line type="monotone" dataKey="accuracy" stroke="#8B5CF6" name="Accuracy %" />
                  <Line type="monotone" dataKey="score" stroke="#EC4899" name="Score" />
                </LineChart>
              </ResponsiveContainer>
            </div>
  
            <div>
              <h3 className="text-lg font-semibold text-pink-300 mb-2">Difficulty Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', color: 'white' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
</div>
);
}
