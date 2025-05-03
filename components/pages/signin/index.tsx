"use client";

import React from "react";

interface SigninPageProps {
  projectName?: string;
}

/**
 * Signin Page Component
 *
 * A complete page component for the signin page.
 */
const SigninPage: React.FC<SigninPageProps> = ({ projectName }) => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md border text-primary-foreground">
            <img src={`/logo.png?v=${new Date().getTime()}`} alt="logo" className="size-4" />
          </div>
          {projectName}
        </a>
        <div className="space-y-4">
          <p className="text-center text-muted-foreground">Sign-in functionality removed</p>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
