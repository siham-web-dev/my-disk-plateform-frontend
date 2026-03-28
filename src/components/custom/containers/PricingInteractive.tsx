"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const formatStorage = (bytes: string | number) => {
  const num = Number(bytes);
  if (num >= 1024 * 1024 * 1024) {
    return `${num / (1024 * 1024 * 1024)} GB`;
  }
  return `${num / (1024 * 1024)} MB`;
};

export type SerializedPlan = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  storageLimit: string;
  canShare: boolean;
  numPeopleToShare: number;
  hasSecurity: boolean;
};

export const PricingInteractive = ({ plans }: { plans: SerializedPlan[] }) => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="bg-[#edeff0] w-full relative pb-20">
      <div
        className="absolute -top-[40px] left-[20%] lg:left-[40%] text-muted-foreground w-fit mx-auto p-2.5 shadow-xl rounded-full bg-white flex gap-2 items-center cursor-pointer select-none"
        onClick={() => setIsYearly(!isYearly)}
      >
        <div className={`rounded-3xl p-3 font-semibold transition-colors duration-300 ${!isYearly ? "bg-[#edf0f2] text-black" : ""}`}>
          Monthly
        </div>
        <div className={`items-center rounded-3xl p-3 font-semibold flex gap-3 transition-colors duration-300 ${isYearly ? "bg-[#edf0f2] text-black" : ""}`}>
          <span>Yearly</span>
          <span className="text-black bg-yellow-400 p-1 rounded-3xl text-[12px]">
            Save 20%
          </span>
        </div>
      </div>
      <div className="mt-[80px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mx-3 lg:mx-7">
        {plans.map((plan) => {
          const yearlyPrice = plan.price * 12 * 0.8;
          const priceDisplay = isYearly
            ? (plan.price === 0 ? "$0/year" : `$${yearlyPrice}/year`)
            : (plan.price === 0 ? "$0/month" : `$${plan.price}/month`);

          return (
            <div
              key={plan.id}
              className="bg-white rounded-xl p-6 flex flex-col gap-7 h-[450px]"
            >
              <h5 className="font-bold">{plan.name}</h5>
              <div className="flex flex-col gap-2 text-muted-foreground">
                <p className="font-semibold text-2xl text-black">{priceDisplay}</p>
                {/* Fallback to original description if needed, otherwise skip to keep clean design */}
              </div>
              <hr />
              <ul className="flex flex-col text-[12px] gap-6">
                <li className="flex gap-1 items-center">
                  <Check color="green" size={14} />
                  <span>{formatStorage(plan.storageLimit)} of storage</span>
                </li>
                <li className="flex gap-1 items-center">
                  {plan.canShare ? (
                    <Check color="green" size={14} />
                  ) : (
                    <X color="red" size={14} />
                  )}
                  <span>
                    {plan.canShare
                      ? plan.numPeopleToShare > 0
                        ? `Share to ${plan.numPeopleToShare} people`
                        : "Share with no limit"
                      : "No share"}
                  </span>
                </li>
                <li className="flex gap-1 items-center">
                  {plan.hasSecurity ? (
                    <Check color="green" size={14} />
                  ) : (
                    <X color="red" size={14} />
                  )}
                  <span>{plan.hasSecurity ? "Security included" : "No security"}</span>
                </li>
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};
