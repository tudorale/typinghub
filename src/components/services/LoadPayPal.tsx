const LoadPayPal = (callback: () => void) => {
  const existingScript = document.getElementById("payPal"); // *

  if (!existingScript) {
    const script = document.createElement("script");

    script.src =
      "https://www.paypal.com/sdk/js?client-id=ASiIUDqkrBm72ddzEjV4A0wOOHH0JfwHtyB91nOtH2vyMDU7xCWb020-VHYT2RlU58kffD91lMZm0nEO&currency=USD";
    script.id = "payPal"; // for checking later if we already have the api in body *

    document.body.appendChild(script);

    script.onload = () => {
      if (callback) callback();
    };
  }

  if (existingScript && callback) callback(); // *
};

export default LoadPayPal;
