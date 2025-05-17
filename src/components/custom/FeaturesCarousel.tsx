import { FileSearch, Share2, Shield, Upload } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { Card, CardContent } from "../ui/card";

interface CloudFeature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeaturesCarousel = () => {
  const cloudFeatures: CloudFeature[] = [
    {
      title: "Easy Upload",
      description:
        "Quickly upload files of any size with our drag-and-drop interface or file selector.",
      icon: <Upload className="h-12 w-12 text-sky-500" />,
    },
    {
      title: "Seamless Sharing",
      description:
        "Share files and folders with anyone using secure, customizable links.",
      icon: <Share2 className="h-12 w-12 text-emerald-500" />,
    },
    {
      title: "Instant Preview",
      description:
        "Preview documents, images, videos, and more without downloading them first.",
      icon: <FileSearch className="h-12 w-12 text-amber-500" />,
    },
    {
      title: "Enterprise Security",
      description:
        "Keep your data protected with end-to-end encryption and advanced security features.",
      icon: <Shield className="h-12 w-12 text-purple-500" />,
    },
  ];
  return (
    <Carousel
      className="w-full max-w-[300px] md:max-w-[1280px]"
      opts={{ loop: true, align: "start" }}
    >
      <CarouselContent>
        {cloudFeatures.map((feature, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
            <Card className="border shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="mb-5 p-4 rounded-full bg-slate-100">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default FeaturesCarousel;
