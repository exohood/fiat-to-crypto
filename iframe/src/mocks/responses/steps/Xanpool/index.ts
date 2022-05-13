const getNextStep = (currentStep: string) => {
  switch (currentStep) {
    case "firstStep":
    case "iframe":
      return firstStep;
    default:
      return completedStep;
  }
};

const firstStep = {
  type: "iframe",
  url: "https://widget.xanpool.com?apiKey=89eed7612765d2ef7a1ed34221a023e9&cryptoCurrency=BTC&currency=PHP&transactionType=buy&partnerData=pk_test_oDsXkHokDdr06zZ0_sxJGw00",
  fullscreen: true,
};

const completedStep = {
  type: "completed",
  trackingUrl: "https://onramper.com",
};

export default {
  getNextStep,
};
