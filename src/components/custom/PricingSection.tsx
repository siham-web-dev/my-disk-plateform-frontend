import React from "react";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";

interface Plan {
  name: string;
  mainPricing: string;
  secondaryPricing?: string;
  features: {
    description: string;
    isAvalaible: boolean;
  }[];
}

const PricingSection = () => {
  const monthlyPlans: Plan[] = [
    {
      name: "Free plan",
      mainPricing: "$0/month",
      features: [
        {
          description: "15 GO of storage",
          isAvalaible: true,
        },
        {
          description: "No share",
          isAvalaible: false,
        },
        {
          description: "No security",
          isAvalaible: false,
        },
      ],
    },
    {
      name: "Pro plan",
      mainPricing: "$5/month",
      features: [
        {
          description: "250 GO of storage",
          isAvalaible: true,
        },
        {
          description: "share to 10 people",
          isAvalaible: true,
        },
        {
          description: "No security",
          isAvalaible: false,
        },
      ],
    },
    {
      name: "Entreprise plan",
      mainPricing: "$250/month",
      features: [
        {
          description: "1 TO of storage",
          isAvalaible: true,
        },
        {
          description: "share with no limit",
          isAvalaible: true,
        },
        {
          description: "security",
          isAvalaible: true,
        },
      ],
    },
  ];
  return (
    <div className="bg-[#edeff0] w-full relative pb-20">
      <div className="absolute -top-[40px] left-[20%] lg:left-[40%] text-muted-foreground w-fit mx-auto p-2.5  shadow-xl rounded-full bg-white flex gap-2 items-center">
        <div className="bg-[#edf0f2] rounded-3xl p-3 font-semibold">
          Monthly
        </div>
        <div className="items-center rounded-3xl p-3 font-semibold flex gap-3">
          <span>Yearly</span>
          <span className="text-black bg-yellow-400 p-1 rounded-3xl text-[12px]">
            Save 20%
          </span>
        </div>
      </div>
      <div className="mt-[80px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mx-3 lg:mx-7">
        {monthlyPlans.map((plan, index) => (
          <div
            key={index}
            className=" bg-white rounded-xl p-6 flex flex-col gap-7 h-[450px]"
          >
            <h5 className="font-bold">{plan.name}</h5>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <p className="font-semibold">{plan.mainPricing}</p>
              {plan.secondaryPricing && (
                <p className="text-[12px]">{plan.secondaryPricing}</p>
              )}
            </div>
            <Button>Subscribe</Button>
            <hr />
            <ul className="flex flex-col text-[12px] gap-6">
              {plan.features.map((f, i) => (
                <li key={i} className="flex gap-1 items-center">
                  {f.isAvalaible ? (
                    <Check color="green" size={14} />
                  ) : (
                    <X color="red" size={14} />
                  )}
                  <span>{f.description}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingSection;
