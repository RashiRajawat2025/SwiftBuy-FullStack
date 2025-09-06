import { Button, Divider } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  sumCartItemMrpPrice,
  sumCartItemSellingPrice,
} from "../../../util/cartCalculator";
import { useAppSelector } from "../../../Redux Toolkit/Store";

const PricingCard = ({ showBuyButton, SubmitButton }: any) => {
  const navigate = useNavigate();
  const { cart } = useAppSelector((store) => store);

  const cartItems = cart.cart?.cartItems || [];
  const mrpTotal = sumCartItemMrpPrice(cartItems);
  const sellingTotal = sumCartItemSellingPrice(cartItems);
  const discount = mrpTotal - sellingTotal;
  const shipping = 79;
  const total = sellingTotal + shipping;

  return (
    <div>
      <div className="space-y-3 p-5">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span>₹ {mrpTotal}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Discount</span>
          <span>₹ {discount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Shipping</span>
          <span>₹ {shipping}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Platform Fee</span>
          <span className="text-teal-600">Free</span>
        </div>
      </div>
      <Divider />

      <div className="font-medium px-5 py-2 flex justify-between items-center">
        <span>Total</span>
        <span>₹ {total}</span>
      </div>

      {showBuyButton && (
        <div className="p-5">
          {SubmitButton ? (
            SubmitButton
          ) : (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => navigate("/checkout")}
            >
              Proceed to Buy
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PricingCard;
