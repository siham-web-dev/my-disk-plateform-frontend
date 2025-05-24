"use client";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SignIn = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    // Handle login logic here
    console.log("Login attempt:", { email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 my-5">
        <Button type="submit" className="w-full">
          Sign in
        </Button>
        <div className="text-center text-sm text-muted-foreground">
          {"Don't"}
          have an account?
          <Link href="/sign-up" className="text-primary hover:underline mx-1">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </form>
  );
};

export default SignIn;
