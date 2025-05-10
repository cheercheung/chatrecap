"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function SignIn() {
  const t = useTranslations();

  return (
    <Link href="/auth/signin">
      <Button variant="default">
        {t("user.sign_in")}
      </Button>
    </Link>
  );
}
