import Image from "next/image";
import React from "react";

const AnimatedFeaturesSection = () => {
  return (
    <div className="relative">
      <Image
        src={"/images/pngs/cercle-features.png"}
        className="w-[400px] h-[400px] lg:w-[600px] lg:h-[600px]"
        width={400}
        height={400}
        alt="my disk features"
      />
      <div className="bg-white absolute top-[50px] left-[74px] md:left-[140px] lg:top-[90px] lg:left-[190px] font-medium flex gap-2 items-center border rounded-3xl shadow-sm p-4 text-[12px] lg:text-[18px]">
        <Image
          src={"/images/pngs/share.png"}
          alt="share icon"
          width={20}
          height={20}
        />
        <p>Share to others</p>
      </div>
      <div className="bg-white absolute -right-[13px] top-[190px] lg:right-[13px] lg:top-[280px] font-medium flex gap-2 items-center border rounded-3xl shadow-sm p-4 text-[12px]  lg:text-[18px]">
        <Image
          src={"/images/pngs/preview.png"}
          alt="share icon"
          width={20}
          height={20}
        />
        <p>Preview your files</p>
      </div>
      <div className="absolute -left-[10px] top-[150px] lg:left-[10px] lg:top-[250px] bg-white font-medium flex gap-2 items-center border rounded-3xl shadow-sm p-4 text-[12px]  lg:text-[18px]">
        <Image
          src={"/images/pngs/upload.png"}
          alt="share icon"
          width={20}
          height={20}
        />
        <p>Upload your files</p>
      </div>
      <div className="bg-white absolute bottom-[50px] left-[74px] lg:bottom-[70px] lg:left-[240px] font-medium flex gap-2 items-center border rounded-3xl shadow-sm p-4 text-[12px]  lg:text-[18px]">
        <Image
          src={"/images/pngs/shield.png"}
          alt="share icon"
          width={20}
          height={20}
        />
        <p>Secure your files</p>
      </div>
    </div>
  );
};

export default AnimatedFeaturesSection;
