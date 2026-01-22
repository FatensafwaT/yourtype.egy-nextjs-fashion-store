import MotionPage from "@/components/MotionPage";
import { Suspense } from "react";
import RegisterClient from "./RegisterClient";

export default function RegisterPage() {
  return (
    <MotionPage>
      <Suspense fallback={<RegisterSkeleton />}>
        <RegisterClient />
      </Suspense>
    </MotionPage>
  );
}

function RegisterSkeleton() {
  return (
    <div className="mx-auto max-w-md space-y-5 rounded-3xl border bg-white p-6 shadow-sm text-gray-500">
      <div className="h-7 w-40 rounded bg-gray-200" />

      <div className="space-y-3">
        <div className="h-11 w-full rounded-2xl border bg-gray-50" />
        <div className="h-11 w-full rounded-2xl border bg-gray-50" />
        <div className="h-11 w-full rounded-2xl border bg-gray-50" />
        <div className="h-11 w-full rounded-2xl bg-pink-200" />
      </div>
    </div>
  );
}
