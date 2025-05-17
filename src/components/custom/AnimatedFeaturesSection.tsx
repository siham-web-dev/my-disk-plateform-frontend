import Image from "next/image";
import React from "react";

const AnimatedFeaturesSection = () => {
  return (
    <div>
      <div className="relative">
        <Image
          src={"/images/pngs/cercle-features.png"}
          className="w-[400px] h-[400px] lg:w-[600px] lg:h-[600px]"
          width={400}
          height={400}
          alt="my disk features"
        />
        <div className="bg-white absolute top-12 left-24 md:left-52 font-medium flex gap-2 items-center border rounded-3xl shadow-sm p-4 text-[12px]">
          <Image
            src={"/images/pngs/share.png"}
            alt="share icon"
            width={20}
            height={20}
          />
          <p>Share to others</p>
        </div>
        <div className="bg-white absolute -right-5 top-48 font-medium flex gap-2 items-center border rounded-3xl shadow-sm p-4 text-[12px]">
          <Image
            src={"/images/pngs/preview.png"}
            alt="share icon"
            width={20}
            height={20}
          />
          <p>Preview your files</p>
        </div>
        <div className="absolute -left-5 top-40 bg-white font-medium flex gap-2 items-center border rounded-3xl shadow-sm p-4 text-[12px]">
          <Image
            src={"/images/pngs/upload.png"}
            alt="share icon"
            width={20}
            height={20}
          />
          <p>Upload your files</p>
        </div>
        <div className="bg-white absolute bottom-10 left-20 font-medium flex gap-2 items-center border rounded-3xl shadow-sm p-4 text-[12px]">
          <Image
            src={"/images/pngs/shield.png"}
            alt="share icon"
            width={20}
            height={20}
          />
          <p>Secure your files</p>
        </div>
        <div className="absolute top-32 left-22 -z-20">
          <Image
            src={"/images/pngs/cloud.png"}
            alt="cloud icon"
            width={150}
            height={150}
          />
        </div>
      </div>
    </div>
  );
};

export default AnimatedFeaturesSection;
