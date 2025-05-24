import Signup from "@/components/custom/forms/Signup";
import SocialAuthOptions from "@/components/custom/forms/SocialAuthOptions";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const page = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-2">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <SocialAuthOptions />
        <Signup />
      </Card>
    </div>
  );
};

export default page;
