'use client';
export const dynamic = 'force-dynamic';
import ID from "./id";
import { Suspense } from 'react';

export default function QuestionPage({params}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ID params={params}/>
      </Suspense>
  );
}
