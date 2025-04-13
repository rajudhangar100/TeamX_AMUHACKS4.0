'use client'
import React, { useEffect, useState } from 'react';
import { Volume2, RotateCcw, Award, Brain } from 'lucide-react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { qModel } from '@/utils/qlearning';
import { useRouter } from 'next/navigation';

const WORD_BANKS = {
  easy: ['cat', 'dog', 'sun', 'hat', 'bat', 'pig', 'red', 'box', 'cup', 'pen'],
  medium: ['train', 'cloud', 'bread', 'green', 'plant', 'chair', 'clock', 'phone', 'smile', 'brush'],
  hard: ['elephant', 'computer', 'mountain', 'rainbow', 'butterfly', 'dinosaur', 'umbrella', 'octopus', 'penguin', 'giraffe']
};

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function LetterTile({letter}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: letter });
  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="w-12 h-12 bg-blue-200 text-xl text-black font-bold flex items-center justify-center rounded shadow cursor-move"
      style={style}
    >
      {letter}
    </div>
  );
}

function DropZone({ index, letter }) {
  const { setNodeRef, isOver } = useDroppable({ id: `drop-${index}` });
  const bgColor = isOver ? 'bg-green-100' : 'bg-gray-200';

  return (
    <div
      ref={setNodeRef}
      className={`w-12 h-12 text-black rounded border flex items-center justify-center text-xl font-bold ${bgColor}`}
    >
      {letter}
    </div>
  );
}

// interface PerformanceData {
//   round: number;
//   score: number;
//   difficulty: string;
//   accuracy: number;
// }

export default function WordBuilderGame() {
  const router=useRouter();
  const [targetWord, setTargetWord] = useState('');
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [placedLetters, setPlacedLetters] = useState([]);
  const [difficulty, setDifficulty] = useState('medium');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [performanceHistory, setPerformanceHistory] = useState([]);
  const [difficultyStats, setDifficultyStats] = useState({
    easy: { attempts: 0, correct: 0 },
    medium: { attempts: 0, correct: 0 },
    hard: { attempts: 0, correct: 0 },
  });

  useEffect(() => {
    generateNewWord();
  }, [difficulty]);

  const generateNewWord = () => {
    const words = WORD_BANKS[difficulty];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setTargetWord(randomWord);
    setPlacedLetters(new Array(randomWord.length).fill(null));

    // Add distractors based on difficulty
    const extraLetters = 'abcdefghijklmnopqrstuvwxyz'
      .split('')
      .filter((l) => !randomWord.includes(l));
    const distractorCount = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
    const distractors = shuffleArray(extraLetters).slice(0, distractorCount);
    const mixed = shuffleArray([...randomWord.split(''), ...distractors]);
    setShuffledLetters(mixed);
  };

  const clearPlacedLetters = () => {
  const backToShuffled = placedLetters.filter((l) => l !== null);
  setShuffledLetters((prev) => [...prev, ...backToShuffled]);
  setPlacedLetters(new Array(targetWord.length).fill(null));
};

  const playSound = () => {
    const utterance = new SpeechSynthesisUtterance(targetWord);
    const indianVoice = window.speechSynthesis
      .getVoices()
      .find((voice) => voice.lang === 'en-IN' || voice.name.toLowerCase().includes('india'));
    utterance.voice = indianVoice ?? undefined;
    utterance.rate = 0.9;
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

  const checkWord = () => {
    const isComplete = !placedLetters.includes(null);
    if (!isComplete) return;

    const word = placedLetters.join('');
    const isCorrect = word === targetWord;
    
    setScore(s => isCorrect ? s + 1 : s);
    setAttempts(a => a + 1);
    setRounds(r => r + 1);
    updateDifficultyStats(isCorrect);

    if (!isCorrect) {
    setPlacedLetters(targetWord.split(''));
  }

    // Update performance history
    const currentAccuracy = ((score + (isCorrect ? 1 : 0)) / (attempts + 1)) * 100;
    setPerformanceHistory(prev => [...prev, {
      round: rounds + 1,
      score: score + (isCorrect ? 1 : 0),
      difficulty,
      accuracy: currentAccuracy,
    }]);

    // Adjust difficulty every 5 rounds using Q-learning
    if ((rounds + 1) % 5 === 0) {
      const reward = isCorrect ? (
        difficulty === 'easy' ? 2 : 
        difficulty === 'medium' ? 4 : 
        6
      ) : -2;

      const nextDifficulty = qModel.getNextAction(score, attempts + 1, difficulty);
      qModel.update(
        score,
        attempts + 1,
        difficulty,
        reward,
        score + (isCorrect ? 1 : 0),
        attempts + 1
      );

      setTimeout(() => {
        setDifficulty(nextDifficulty);
      }, 1000);
    }

    setTimeout(() => {
      generateNewWord();
    }, 1500);
  };

  const handleDragEnd = (event) => {
    const { over, active } = event;
    if (over && active) {
      const overIndex = parseInt(over.id.split('-')[1]);
      if (!placedLetters[overIndex]) {
        const newPlaced = [...placedLetters];
        newPlaced[overIndex] = active.id;
        setPlacedLetters(newPlaced);
        setShuffledLetters((prev) => prev.filter((l) => l !== active.id));
        
        // Check word completion after placing letter
        setTimeout(() => {
          checkWord();
        }, 100);
      }
    }
  };

  const getDifficultyColor = (diff)=> {
    switch (diff) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-blue-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-800 p-6">
  <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Game Section */}
    <div className="bg-gray-800 rounded-xl shadow-xl p-6">
      <h2 className="text-3xl font-bold mb-2 text-indigo-300 flex items-center gap-2">
        <Brain className="h-8 w-8 text-indigo-300" />
        Word Builder
      </h2>
      <p className="text-gray-400 mb-4">Listen to the word and build it by dragging letters</p>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-400">
            Level: {difficulty.toUpperCase()}
          </span>
          <span className="text-sm font-medium text-gray-400">
            Round: {rounds + 1}
          </span>
        </div>
        <div className="h-2 bg-gray-600 rounded-full">
          <div
            className="h-2 bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${((rounds % 5) / 5) * 100}% `}}
          />
        </div>
      </div>

      <button
        onClick={playSound}
        className="p-4 bg-indigo-700 rounded-full text-indigo-200 hover:bg-indigo-600 mx-auto block mb-6"
      >
        <Volume2 className="w-8 h-8 text-indigo-200" />
      </button>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex justify-center gap-2 mb-4">
          {placedLetters.map((letter, i) => (
            <DropZone key={i} index={i} letter={letter} />
          ))}
        </div>

        <button
          onClick={clearPlacedLetters}
          className="px-4 py-2 text-sm rounded bg-red-600 text-red-200 hover:bg-red-500 flex items-center"
        >
          Clear
        </button>

        <button
          onClick={checkWord}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition mb-4 mx-auto block"
        >
          Submit
        </button>

        <div className="flex flex-wrap gap-2 justify-center">
          {shuffledLetters.map((letter, i) => (
            <LetterTile key={`${letter}-${i}`} letter={letter}/>
          ))}
        </div>
      </DndContext>

      <button
        onClick={generateNewWord}
        className="mt-6 px-4 py-2 text-sm rounded bg-indigo-700 text-indigo-200 hover:bg-indigo-600 flex items-center mx-auto"
      >
        <RotateCcw className="w-4 h-4 mr-1 text-indigo-200" /> New Word
      </button>

      <button
        onClick={() => router.push('/dashboard')}
        className="mt-6 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
      >
        Finish Game
      </button>
    </div>

    {/* Dashboard Section */}
    <div className="bg-gray-800 rounded-xl shadow-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Award className="h-8 w-8 text-indigo-300" />
        <h2 className="text-2xl font-bold text-gray-300">Performance Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-indigo-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-indigo-200 mb-2">Current Status</h3>
          <p className={`text-xl font-bold mb-1 ${getDifficultyColor(difficulty)}`}>
            Level: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </p>
          <p className="text-gray-400">
            Score: {score}/{attempts} ({attempts > 0 ? ((score / attempts) * 100).toFixed(0) : 0}%)
          </p>
        </div>

        <div className="bg-indigo-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-indigo-200 mb-2">Level Stats</h3>
          {Object.entries(difficultyStats).map(([level, stats]) => (
            <p key={level} className="text-sm text-gray-400">
              {level.charAt(0).toUpperCase() + level.slice(1)}:{' '}
              {stats.attempts > 0 ? ((stats.correct / stats.attempts) * 100).toFixed(0) : 0}% accuracy
            </p>
          ))}
        </div>
      </div>

      {performanceHistory.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">Progress Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={performanceHistory}>
              <XAxis dataKey="round" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="accuracy" stroke="#4F46E5" name="Accuracy %" />
              <Line type="monotone" dataKey="score" stroke="#059669" name="Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  </div>
</div>

  );
}