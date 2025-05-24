import { FacebookIcon, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";

const SocialAuthOptions = () => {
  return (
    <>
      <div className="space-y-3 mx-6">
        <Button variant="outline" className="w-full" type="button">
          <Chrome className="mr-2 h-4 w-4 text-blue-500" />
          Continue with Google
        </Button>
        <Button variant="outline" className="w-full" type="button">
          <FacebookIcon className="mr-2 h-4 w-4 text-blue-600" />
          Continue with Facebook
        </Button>
      </div>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
    </>
  );
};

export default SocialAuthOptions;
