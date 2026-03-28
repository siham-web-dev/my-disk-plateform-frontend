"use client";

import { useState, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const VerifyMFAPageContent = () => {
  const [error, setError] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setIsVerifying(true);

    try {
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      if (factorsError) throw factorsError;

      const totpFactor = factors.totp[0];
      if (!totpFactor) throw new Error("No MFA factor found. Please contact support.");

      const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
        factorId: totpFactor.id,
        code: mfaCode,
      });

      if (verifyError) {
        setError(verifyError.message);
        return;
      }

      router.push(next);
    } catch (err: any) {
      setError(err.message || "An error occurred during verification.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Enter the 6-digit code from your authenticator app to complete your sign-in.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleVerify}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2 my-4">
              <Label htmlFor="mfaCode">Verification Code</Label>
              <Input
                id="mfaCode"
                placeholder="000000"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="text-center text-lg tracking-[0.5em] font-mono"
                maxLength={6}
                autoFocus
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isVerifying || mfaCode.length < 6}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
            <Button
              variant="ghost"
              className="w-full text-xs"
              onClick={() => supabase.auth.signOut().then(() => router.push("/sign-in"))}
            >
              Cancel and sign out
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

const VerifyMFAPage = () => (
  <Suspense fallback={
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  }>
    <VerifyMFAPageContent />
  </Suspense>
);

export default VerifyMFAPage;
