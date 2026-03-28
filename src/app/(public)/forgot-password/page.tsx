import ForgotPassword from "@/components/custom/forms/ForgotPassword";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <div className="flex-1 flex py-12 justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md h-fit">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Reset password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <ForgotPassword />
      </Card>
    </div>
  );
}
