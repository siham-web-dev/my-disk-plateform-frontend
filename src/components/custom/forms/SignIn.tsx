"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const SignIn = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [isVerifyingMFA, setIsVerifyingMFA] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setError(null);
      setSuccess(null);
      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (signInError) {
          setError(signInError.message);
          return;
        }

        // Check for MFA requirement
        const { data: aal, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aalError) throw aalError;

        if (aal.nextLevel === 'aal2' && aal.nextLevel !== aal.currentLevel) {
          setShowMFA(true);
          setSuccess("Please enter your verification code to continue.");
          return;
        }

        setSuccess("Signed in successfully! Redirecting...");
        router.push("/account");
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
        console.error("SignIn error:", err);
      }
    },
  });

  const handleMFAVerify = async () => {
    setError(null);
    setIsVerifyingMFA(true);
    try {
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      if (factorsError) throw factorsError;

      const totpFactor = factors.totp[0]; // Get the first TOTP factor
      if (!totpFactor) throw new Error("No MFA factor found");

      const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
        factorId: totpFactor.id,
        code: mfaCode,
      });

      if (verifyError) {
        setError(verifyError.message);
        return;
      }

      setSuccess("MFA verified! Redirecting...");
      router.push("/account");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to verify MFA code.";
      setError(message);
    } finally {
      setIsVerifyingMFA(false);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="bg-green-50 text-green-700 border-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...formik.getFieldProps("email")}
            disabled={showMFA}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-xs text-destructive">{formik.errors.email}</div>
          ) : null}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...formik.getFieldProps("password")}
            disabled={showMFA}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-xs text-destructive">{formik.errors.password}</div>
          ) : null}
        </div>

        {showMFA && (
          <div className="space-y-2 pt-2 border-t mt-4">
            <Label htmlFor="mfaCode">Verification Code</Label>
            <Input
              id="mfaCode"
              placeholder="000000"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              autoFocus
            />
            <p className="text-[10px] text-muted-foreground">
              Enter the 6-digit code from your authenticator app.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 my-5">
        <Button
          type={showMFA ? "button" : "submit"}
          onClick={showMFA ? handleMFAVerify : undefined}
          className="w-full"
          disabled={formik.isSubmitting || isVerifyingMFA}
        >
          {formik.isSubmitting || isVerifyingMFA ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {showMFA ? "Verifying..." : "Signing in..."}
            </>
          ) : (
            showMFA ? "Verify Code" : "Sign in"
          )}
        </Button>
        <div className="text-center text-sm text-muted-foreground pb-4">
          {"Don't"} have an account?
          <Link href="/sign-up" className="text-primary hover:underline mx-1">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </form>
  );
};

export default SignIn;
