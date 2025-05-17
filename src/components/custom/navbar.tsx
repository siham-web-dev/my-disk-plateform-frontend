import { Button } from "../ui/button";
import Logo from "./logo";

const Navbar = () => {
  return (
    <nav className="flex justify-between shadow-sm p-5 items-center">
      <Logo />
      <div>
        <Button variant={"link"}>Try for free</Button>
        <Button>Sign In</Button>
      </div>
    </nav>
  );
};

export default Navbar;
