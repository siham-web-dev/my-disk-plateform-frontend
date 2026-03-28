import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AuthCodeError() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">Authentication Error</CardTitle>
          <CardDescription>
            We encountered an error while verifying your authentication code. 
            This could be because the link has expired or has already been used.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/sign-in">Back to Sign In</Link>
          </Button>
          <Button variant="ghost" asChild className="w-full">
            <Link href="/">Check Home Page</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
