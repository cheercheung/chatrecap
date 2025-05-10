import SignForm from "@/components/sign/form";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/client";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  // 在 Next.js 13.4+ 中，searchParams 是一个 Promise，需要使用 await
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl;
  const error = params?.error;

  console.log('SignInPage: Showing sign in page for testing');

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md border text-primary-foreground">
            <img src="/logo.png" alt="logo" className="size-4" />
          </div>
          {process.env.NEXT_PUBLIC_PROJECT_NAME}
        </a>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <SignForm />
      </div>
    </div>
  );
}
