"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SiGithub, SiGmail, SiGoogle } from "react-icons/si";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { useAppContext } from "@/contexts/app";
import { useTranslations } from "next-intl";

export default function SignModal({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const t = useTranslations();
  const { showSignModal, setShowSignModal } = useAppContext();

  return (
    <Dialog open={showSignModal} onOpenChange={setShowSignModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("sign_modal.sign_in_title")}</DialogTitle>
          <DialogDescription>
            {t("sign_modal.sign_in_description")}
          </DialogDescription>
        </DialogHeader>
        <div className={cn("grid items-start gap-4", className)}>
          {/* <div className="grid gap-2">
            <Label htmlFor="email">{t("sign_modal.email_title")}</Label>
            <Input type="email" id="email" placeholder="xxx@xxx.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{t("sign_modal.password_title")}</Label>
            <Input id="password" type="password" />
          </div>
          <Button type="submit" className="w-full flex items-center gap-2">
            <SiGmail className="w-4 h-4" />
            {t("sign_modal.email_sign_in")}
          </Button> */}

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              {t("sign_modal.continue_with")}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true" && (
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={() => signIn("google")}
              >
                <SiGoogle className="w-4 h-4" />
                {t("sign_modal.google_sign_in")}
              </Button>
            )}
            {process.env.NEXT_PUBLIC_AUTH_GITHUB_ENABLED === "true" && (
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={() => signIn("github")}
              >
                <SiGithub className="w-4 h-4" />
                {t("sign_modal.github_sign_in")}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
