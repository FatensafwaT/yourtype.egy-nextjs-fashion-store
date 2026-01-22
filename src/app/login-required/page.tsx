import MotionPage from "@/components/MotionPage";
import { Suspense } from "react";
import LoginRequiredClient from "./LoginRequiredClient";

export default function LoginRequiredPage() {
  return (
    <MotionPage>
      <Suspense fallback={<LoginRequiredSkeleton />}>
        <LoginRequiredClient />
      </Suspense>
    </MotionPage>
  );
}

function LoginRequiredSkeleton() {
  return (
    <div className="mx-auto max-w-md rounded-3xl border bg-white p-10 text-center shadow-sm">
      <div className="mx-auto h-12 w-12 rounded-full bg-gray-100" />
      <div className="mx-auto mt-4 h-7 w-56 rounded bg-gray-100" />
      <div className="mx-auto mt-3 h-4 w-72 rounded bg-gray-100" />

      <div className="mt-6 space-y-3">
        <div className="h-11 w-full rounded-full bg-pink-200" />
        <div className="h-11 w-full rounded-full border bg-gray-50" />
      </div>

      <div className="mx-auto mt-5 h-4 w-32 rounded bg-gray-100" />
    </div>
  );
}
