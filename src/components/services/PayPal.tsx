import React, { useEffect, useState } from "react";
import "../../style/css/main.css";
import Firebase, { db } from "./Firebase";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";

declare global {
  interface Window {
    paypal: any;
  }
}

function PayPal() {
  const [paypalStatus, setPaypalStatus] = useState("");
  const paypalRef = React.useRef(null);
  const PRO_AMOUNT = 4.99;

  useEffect(() => {
    const user = Firebase.auth().currentUser;
    window.paypal
      .Buttons({
        createOrder: (data: any, actions: any, error: any) => {
          setPaypalStatus("Waiting for a payment...");
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "Permanent Pro Membership for JustType",
                amount: {
                  currency_code: "USD",
                  value: PRO_AMOUNT,
                },
              },
            ],
          });
        },
        onApprove: async (data: any, actions: any) => {
          const order = await actions.order.capture();
          setPaypalStatus(
            "Transaction completed, in a few seconds you will have your account updated."
          );

          db.collection("users")
            .doc(user?.uid)
            .update({
              payment: {
                country: order.payer.address.country_code,
                email: order.payer.email_address,
                fullName: `${order.payer.name.given_name} ${order.payer.name.surname}`,
                payerId: order.payer.payer_id,
                paypalId: order.id,
                date: order.update_time,
              },
              pro: true,
            });
        },
        onError: () => {
          setPaypalStatus(
            "Something went wrong, please try again and make sure you have the corresponding amount."
          );
        },
      })
      .render(paypalRef.current);
  }, []);

  return (
    <>
      <div className="paypal">
        <div className="ppButtons" ref={paypalRef}></div>
        <p className="ppStatus">{paypalStatus}</p>
        <div className="redirectedButtons">
          <Link to="/play">
            <button>Main Page</button>
          </Link>
          <Link to="/profile">
            <button>Your Profile</button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default PayPal;
