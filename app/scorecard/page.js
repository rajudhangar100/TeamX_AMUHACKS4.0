'use client';
export const dynamic = 'force-dynamic';
import ScoreCard from "./scorecard";
import { Suspense } from 'react';


export default function TestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScoreCard/>
      </Suspense>
  );
}
