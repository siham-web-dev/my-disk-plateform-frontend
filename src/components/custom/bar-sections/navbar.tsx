import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/custom/logo";
import { User } from "@supabase/supabase-js";

const Navbar = ({ user }: { user: User | null }) => {
  return (
    <nav className="flex justify-between shadow-sm p-5 items-center">
      <Logo />
      <div>
        {user ? (
          <Button asChild>
            <Link href={"/account"}>Dashboard</Link>
          </Button>
        ) : (
          <>
            <Button variant={"link"} asChild>
              <Link href={"/sign-up"}>Try for free</Link>
            </Button>
            <Button asChild>
              <Link href={"/sign-in"}>Sign In</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
