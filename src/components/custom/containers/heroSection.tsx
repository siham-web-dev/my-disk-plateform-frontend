import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Logo from "@/components/custom/logo";

const HeroSection = () => {
  return (
    <div className="border-b">
      <div className="my-5 px-5 flex flex-col lg:flex-row gap-6 items-center lg:justify-between xl:mx-[80px] lg:my-2">
        <div className="flex flex-col gap-3 items-center text-center  lg:items-start lg:text-left lg:gap-6">
          <Logo size="small" />
          <h3 className="font-semibold text-2xl lg:text-6xl">
            Store and share files online
          </h3>
          <p className="text-muted-foreground lg:text-[18px]">
            cloud storage for seamless file sharing and enhanced collaboration.
          </p>
          <Button
            variant={"outline"}
            className="w-fit border-primary text-primary text-md p-3.5"
          >
            {"Let's"} Try for free
          </Button>
        </div>
        <Image
          className="w-[400px] h-[400px] lg:w-[600px] lg:h-[600px]"
          src={"/images/pngs/hero.png"}
          width={400}
          height={400}
          alt="cloud storage image"
        />
      </div>
    </div>
  );
};

export default HeroSection;
