import MotionPage from "@/components/MotionPage";
import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <MotionPage>
      <Suspense fallback={<LoginSkeleton />}>
        <LoginClient />
      </Suspense>
    </MotionPage>
  );
}

function LoginSkeleton() {
  return (
    <div className="mx-auto max-w-md rounded-3xl border bg-white p-6 shadow-sm text-gray-500">
      <div className="h-7 w-24 rounded bg-gray-200" />
      <div className="mt-2 h-4 w-40 rounded bg-gray-200" />

      <div className="mt-6 space-y-3">
        <div className="h-11 w-full rounded-2xl border bg-gray-50" />
        <div className="h-11 w-full rounded-2xl border bg-gray-50" />
        <div className="h-11 w-full rounded-full bg-pink-200" />
      </div>
    </div>
  );
}
