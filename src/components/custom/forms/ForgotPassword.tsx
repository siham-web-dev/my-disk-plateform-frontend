"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const ForgotPassword = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      setError(null);
      try {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          values.email,
          {
            redirectTo: `${window.location.origin}/auth/callback?next=/account/settings`,
          }
        );

        if (resetError) {
          setError(resetError.message);
          return;
        }

        setSuccess(true);
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
        console.error("Forgot password error:", err);
      }
    },
  });

  if (success) {
    return (
      <CardContent className="space-y-4 py-8 text-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="rounded-full bg-green-100 p-3">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Check your email</h3>
          <p className="text-sm text-muted-foreground px-4">
            We've sent a password reset link to <strong>{formik.values.email}</strong>.
            Please check your inbox.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setSuccess(false)}
          >
            Try another email
          </Button>
        </div>
      </CardContent>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2 my-4">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-xs text-destructive">{formik.errors.email}</div>
          ) : null}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pb-8">
        <Button
          type="submit"
          className="w-full"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending reset link...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
        <Link
          href="/sign-in"
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to sign in
        </Link>
      </CardFooter>
    </form>
  );
};

export default ForgotPassword;
