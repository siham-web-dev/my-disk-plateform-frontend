import AnimatedFeaturesSection from "./AnimatedFeaturesSection";

const FeaturesSection = () => {
  return (
    <div className="flex flex-col gap-4 lg:gap-10 text-center items-center py-3.5 px-7 my-8">
      <h4 className="text-2xl font-semibold lg:text-4xl">
        Cloud storage made easy
      </h4>
      <p className="text-muted-foreground">
        Simple and scalable cloud storage for people, and for teams of all
        sizes. Upload, open, share and edit files from any device.
      </p>
      {/* <div className="flex flex-col gap-4 justify-center items-center"> */}
      <AnimatedFeaturesSection />
      {/* <FeaturesCarousel />
      </div> */}
    </div>
  );
};

export default FeaturesSection;
