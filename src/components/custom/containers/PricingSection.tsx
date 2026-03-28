import React from "react";
import { getPricingPlans } from "@/actions/plans";
import { PricingInteractive } from "./PricingInteractive";

const PricingSection = async () => {
  const dbPlans = await getPricingPlans();

  const serializedPlans = dbPlans.map((plan) => ({
    id: plan.id,
    name: plan.name,
    description: plan.description,
    price: plan.price,
    canShare: plan.canShare,
    numPeopleToShare: plan.numPeopleToShare,
    hasSecurity: plan.hasSecurity,
    storageLimit: plan.storageLimit.toString(),
  }));

  return <PricingInteractive plans={serializedPlans} />;
};

export default PricingSection;
