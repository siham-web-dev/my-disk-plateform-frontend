"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";
import { Check } from "lucide-react";

export const formatStorage = (bytes: string | number | bigint) => {
  const num = Number(bytes);
  if (num >= 1024 * 1024 * 1024) {
    return `${num / (1024 * 1024 * 1024)} GB`;
  }
  return `${num / (1024 * 1024)} MB`;
};

export type UpgradePlanProps = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  storageLimit: string;
  canShare: boolean;
  numPeopleToShare: number;
  hasSecurity: boolean;
  stripeMonthlyPriceId: string | null;
  stripeYearlyPriceId: string | null;
};

interface UpgradePlansListProps {
  plans: UpgradePlanProps[];
  currentPlanName: string;
  hasActiveSubscription?: boolean;
  subscriptionEndDate?: Date | null;
}

export const UpgradePlansList: React.FC<UpgradePlansListProps> = ({ plans, currentPlanName, hasActiveSubscription = false, subscriptionEndDate }) => {
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(false);

  const onSubscribe = async (priceId: string | null) => {
    if (!priceId) {
      toast.error("This plan isn't configured for checkout yet.");
      return;
    }

    setLoadingPriceId(priceId);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Checkout link missing");
        setLoadingPriceId(null);
      }
    } catch {
      toast.error("Failed to proceed to checkout");
      setLoadingPriceId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white min-h-[400px] w-full">
      <div className="flex justify-center items-center gap-3 my-4">
        <span className={!isYearly ? "font-bold text-sm" : "text-muted-foreground text-sm"}>Monthly</span>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} />
        <span className={isYearly ? "font-bold text-sm" : "text-muted-foreground text-sm"}>Yearly</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {plans.map((plan) => {
          const normalizeName = (name: string) => name.toLowerCase().replace(/\s+plan/i, '').trim();
          const isCurrentPlan = normalizeName(plan.name) === normalizeName(currentPlanName);
          const yearlyPrice = plan.price * 12 * 0.8;
          const priceDisplay = isYearly
            ? (plan.price === 0 ? "$0" : `$${yearlyPrice.toFixed(2)}/yr`)
            : (plan.price === 0 ? "$0" : `$${plan.price.toFixed(2)}/mo`);

          const currentPriceId = isYearly ? plan.stripeYearlyPriceId : plan.stripeMonthlyPriceId;
          const isButtonLoading = loadingPriceId !== null && loadingPriceId === currentPriceId;

          return (
            <div key={plan.id} className={`border rounded-xl p-6 flex flex-col gap-4 ${isCurrentPlan ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500' : 'border-gray-200'}`}>
              <div>
                <h3 className="font-bold text-xl">{plan.name}</h3>
                <p className="text-3xl font-extrabold mt-2">{priceDisplay}</p>
                <p className="text-sm text-muted-foreground mt-1">{plan.description || "The perfect solution for you."}</p>
              </div>

              <div className="mt-4 flex flex-col gap-3 flex-grow text-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-500" />
                  <span>Storage: {formatStorage(plan.storageLimit)}</span>
                </div>
                {plan.canShare && (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-500" />
                    <span>Share with {plan.numPeopleToShare > 0 ? plan.numPeopleToShare : 'unlimited'} people</span>
                  </div>
                )}
                {plan.hasSecurity && (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-500" />
                    <span>Advanced Security</span>
                  </div>
                )}
              </div>

              <div className="mt-6">
                {isCurrentPlan ? (
                  <Button variant="outline" className="w-full text-blue-600 bg-blue-50 border-blue-200" disabled>
                    Current Plan
                  </Button>
                ) : hasActiveSubscription && plan.price > 0 ? (
                  <div className="space-y-1">
                    <Button variant="outline" className="w-full" disabled>
                      Locked
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      {subscriptionEndDate
                        ? `Available after ${subscriptionEndDate.toLocaleDateString()}`
                        : "Cancel your current plan first"}
                    </p>
                  </div>
                ) : (
                  <Button
                    variant={plan.price === 0 ? "outline" : "default"}
                    className="w-full"
                    onClick={() => onSubscribe(currentPriceId)}
                    disabled={isButtonLoading}
                  >
                    {isButtonLoading ? "Redirecting..." : "Subscribe"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
