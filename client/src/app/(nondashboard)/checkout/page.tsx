"use client";
import Loading from "@/components/Loading";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { useCheckoutNavigation } from "@/hooks/useCheckoutNavigation";
import WizardStepper from "@/components/WizardStepper";
import CheckoutDetailsPage from "./details";
import PaymentPage from "./payment";
import CompletionPage from "./completion";

const CheckoutWizard = () => {
  const { isLoaded } = useUser();
  const { checkoutStep } = useCheckoutNavigation();
  if (!isLoaded) return <Loading></Loading>;
  const renderStep = () => {
    switch (checkoutStep) {
      case 1:
        return <CheckoutDetailsPage />;
      case 2: 
        return <PaymentPage />; 
      case 3:
        return <CompletionPage />;
      default:
        return "checkout details page";
    }
  };

  return (
    <div className="checkout">
      <WizardStepper currentStep={checkoutStep} />
      <div className="checkout__content">{renderStep()}</div>
    </div>
  );
};

export default CheckoutWizard;
