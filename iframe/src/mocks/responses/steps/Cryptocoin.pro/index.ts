const getNextStep = (currentStep: string) => {
  switch (currentStep) {
    case "email":
      return {
        type: "completed",
        trackingUrl: "https://onramper.com",
      };
  }
};

export default {
  getNextStep,
};
