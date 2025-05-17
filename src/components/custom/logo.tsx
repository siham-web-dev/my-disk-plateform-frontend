import Image from "next/image";

const Logo = ({ size = "medium" }: { size?: "small" | "medium" | "large" }) => {
  const imageSize = size === "medium" ? 40 : 20;
  const textSize = size === "medium" ? "16px" : "12px";

  return (
    <div className="flex gap-2 items-center">
      <Image
        src={"/images/pngs/logo.png"}
        width={imageSize}
        height={40}
        alt="logo"
      />
      <p className={`font-semibold text-primary text-[${textSize}]`}>MyDisk</p>
    </div>
  );
};

export default Logo;
