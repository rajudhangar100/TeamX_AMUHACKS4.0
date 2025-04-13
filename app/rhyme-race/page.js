'use client'
import React, { useState, useEffect } from 'react';
import { Volume2, Check, X, TrendingUp, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { qModel } from '@/utils/qlearning';
import { useRouter } from 'next/navigation';

const RHYME_PAIRS= {
  easy: [
    { word: 'cat', rhymes: ['hat', 'bat'], decoys: ['dog', 'fish'] },
    { word: 'sun', rhymes: ['fun', 'run'], decoys: ['moon', 'star'] },
    { word: 'bell', rhymes: ['well', 'tell'], decoys: ['book', 'ring'] },
    { word: 'dog', rhymes: ['log', 'fog'], decoys: ['cat', 'puppy'] },
    { word: 'hat', rhymes: ['rat', 'mat'], decoys: ['cap', 'hair'] },
    { word: 'cake', rhymes: ['bake', 'lake'], decoys: ['pie', 'sweet'] },
    { word: 'ball', rhymes: ['call', 'tall'], decoys: ['toy', 'roll'] },
    { word: 'car', rhymes: ['star', 'far'], decoys: ['bike', 'bus'] },
    { word: 'book', rhymes: ['look', 'hook'], decoys: ['read', 'page'] },
    { word: 'bed', rhymes: ['red', 'said'], decoys: ['sleep', 'cot'] },
  ],
  medium: [
    { word: 'light', rhymes: ['bright', 'night', 'sight'], decoys: ['dark', 'lamp', 'day'] },
    { word: 'train', rhymes: ['rain', 'brain', 'plain'], decoys: ['bus', 'car', 'bike'] },
    { word: 'space', rhymes: ['race', 'face', 'grace'], decoys: ['star', 'moon', 'sun'] },
    { word: 'stone', rhymes: ['cone', 'throne', 'alone'], decoys: ['rock', 'pebble', 'brick']},
    { word: 'dream', rhymes: ['team', 'stream', 'beam'], decoys: ['sleep', 'night', 'imagine']},
    { word: 'fire', rhymes: ['tire', 'wire', 'liar'], decoys: ['hot', 'flame', 'burn'] },
    { word: 'chair', rhymes: ['bear', 'stair', 'fair'], decoys: ['sit', 'seat', 'table'] },
    { word: 'cloud', rhymes: ['loud', 'shroud', 'crowd'], decoys: ['sky', 'fog', 'rain'] },
    { word: 'door', rhymes: ['floor', 'more', 'bore'], decoys: ['window', 'lock', 'handle'] },
    { word: 'clock', rhymes: ['rock', 'sock', 'dock'], decoys: ['time', 'watch', 'alarm'] },
  ],
  hard: [
    { word: 'mountain', rhymes: ['fountain', 'counting'], decoys: ['valley', 'hill', 'peak', 'river'] },
    { word: 'treasure', rhymes: ['measure', 'pleasure'], decoys: ['gold', 'chest', 'map', 'coin'] },
    { word: 'science', rhymes: ['alliance', 'reliance'], decoys: ['math', 'book', 'learn', 'study'] },
  ],
};

const ROUNDS_PER_LEVEL = 5;

export default function RhymeRaceGame() {
  const [currentSet, setCurrentSet] = useState(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [roundAttempts, setRoundAttempts] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [learningHistory, setLearningHistory] = useState([]);
  const router = useRouter();

  const pickNewSet = () => {
    const sets = RHYME_PAIRS[difficulty];
    const set = sets[currentSet % sets.length];
    const allOptions = [...set.rhymes, ...set.decoys].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    setSelected(null);
    setFeedback(null);
  };

  const speakWord = (word) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(word);
    const voices = synth.getVoices().filter(voice => voice.lang.includes('en-IN'));
    if (voices.length) utter.voice = voices[0];
    synth.speak(utter);
  };


  const handleSelect = (option) => {
    const sets = RHYME_PAIRS[difficulty];
    const set = sets[currentSet % sets.length];
    const isCorrect = set.rhymes.includes(option);
    
    setSelected(option);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setScore(prev => prev + (isCorrect ? 1 : 0));
    setAttempts(prev => prev + 1);
    setRoundScore(prev => prev + (isCorrect ? 1 : 0));
    setRoundAttempts(prev => prev + 1);

    // Enhanced reward calculation
    const reward = isCorrect ? (
      difficulty === 'easy' ? 2 : 
      difficulty === 'medium' ? 4 : 
      6
    ) : -2; // Increased penalties and rewards

    setTimeout(() => {
      if (roundAttempts + 1 >= ROUNDS_PER_LEVEL) {
        // Calculate accuracy for the round
        const roundAccuracy = ((roundScore + (isCorrect ? 1 : 0)) / ROUNDS_PER_LEVEL) * 100;
        console.log(`Round completed - Accuracy: ${roundAccuracy}%, Current difficulty: ${difficulty}`);
        
        // Update Q-learning model and get next difficulty
        const nextDifficulty = qModel.getNextAction(roundScore, ROUNDS_PER_LEVEL, difficulty);
        console.log(`Transitioning to difficulty: ${nextDifficulty}`);
        
        qModel.update(
          roundScore,
          ROUNDS_PER_LEVEL,
          difficulty,
          reward,
          0,
          0
        );

        // Update learning history
        setLearningHistory(prev => [...prev, {
          round: prev.length + 1,
          score: roundScore + (isCorrect ? 1 : 0),
          accuracy: roundAccuracy,
          difficulty: nextDifficulty
        }]);

        // Reset round counters and update difficulty
        setRoundScore(0);
        setRoundAttempts(0);
        setDifficulty(nextDifficulty);
      }

      const next = (currentSet + 1) % RHYME_PAIRS[difficulty].length;
      setCurrentSet(next);
    }, 1000);
  };

  useEffect(() => {
    pickNewSet();
  }, [currentSet, difficulty]);

  const currentWord = RHYME_PAIRS[difficulty][currentSet % RHYME_PAIRS[difficulty].length].word;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 text-white font-sans">
  <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
    
    {/* Game Section */}
    <div className="bg-gray-800/90 shadow-xl rounded-3xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-indigo-300">🎵 Rhyme Race</h2>
        <div className="text-sm font-medium text-gray-400">
          Round Progress: {roundAttempts}/{ROUNDS_PER_LEVEL}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-400">
            Current Level: {difficulty.toUpperCase()}
          </span>
          <span className="text-sm font-medium text-gray-400">
            Round Score: {roundScore}/{roundAttempts}
          </span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full">
          <div
            className="h-2 bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${(roundAttempts / ROUNDS_PER_LEVEL) * 100}% `}}
          />
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => speakWord(currentWord)}
          className="p-4 bg-indigo-700/70 rounded-full hover:bg-indigo-600 transition-all shadow-md"
        >
          <Volume2 className="h-8 w-8 text-white" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            className={`p-4 rounded-xl font-semibold transition-all hover:scale-105
              ${
                selected === opt
                  ? feedback === 'correct' && RHYME_PAIRS[difficulty][currentSet % RHYME_PAIRS[difficulty].length].rhymes.includes(opt)
                    ? 'bg-green-700 text-white'
                    : 'bg-red-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }
            `}
          >
            {opt}
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
        <div className={`mt-4 text-center p-2 rounded-lg ${
          feedback === 'correct' ? 'bg-green-700 text-white' : 'bg-red-700 text-white'
        }`}>
          <div className="flex justify-center items-center space-x-2">
            {feedback === 'correct' ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
            <span>{feedback === 'correct' ? 'Correct!' : 'Try again!'}</span>
          </div>
        </div>
      )}
    </div>

    {/* Learning Progress Section */}
    <div className="bg-gray-800/90 shadow-xl rounded-3xl p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Award className="h-8 w-8 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Learning Progress</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700/80 p-4 rounded-xl">
          <h3 className="text-lg font-semibold text-indigo-300 mb-2">Overall Stats</h3>
          <p className="text-gray-200">
            Total Score: {score}/{attempts}
          </p>
          <p className="text-gray-200">
            Accuracy: {attempts > 0 ? ((score / attempts) * 100).toFixed(1) : 0}%
          </p>
        </div>

        <div className="bg-gray-700/80 p-4 rounded-xl">
          <h3 className="text-lg font-semibold text-indigo-300 mb-2">Current Round</h3>
          <p className="text-gray-200">
            Score: {roundScore}/{roundAttempts}
          </p>
          <p className="text-gray-200">
            Accuracy: {roundAttempts > 0 ? ((roundScore / roundAttempts) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      {learningHistory.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Progress Chart</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={learningHistory}>
              <XAxis dataKey="round" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563', color: 'white' }} />
              <Line type="monotone" dataKey="accuracy" stroke="#8B5CF6" name="Accuracy %" />
              <Line type="monotone" dataKey="score" stroke="#10B981" name="Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  </div>
</div>

  );
}