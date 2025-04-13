'use client';
export const dynamic = 'force-dynamic';
import Test from "./test";
import { Suspense } from 'react';

export default function TestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Test/>
      </Suspense>
  );
}
