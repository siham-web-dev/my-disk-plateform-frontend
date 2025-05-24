import SignIn from "@/components/custom/forms/SignIn";
import SocialAuthOptions from "@/components/custom/forms/SocialAuthOptions";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Component() {
  return (
    <div className="flex-1 flex py-12 justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md h-fit">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign in
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <SocialAuthOptions />
        <SignIn />
      </Card>
    </div>
  );
}
