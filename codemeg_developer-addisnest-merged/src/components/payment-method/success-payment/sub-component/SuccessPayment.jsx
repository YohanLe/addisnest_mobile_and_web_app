import React from "react";
import {
  SvgCheckCircleIcon,
  SvgLongArrowIcon,
} from "../../../../assets/svg-files/SvgFiles";
import { Link } from "react-router-dom";

const SuccessPayment = () => {
  return (
    <section className="common-section success-payment-section">
      <div className="container">
      <div className="progressbar-main">
            <ul>
              <li>
                <div className="progress-step active">
                  <span></span>
                  <p>Choose Promotion</p>
                </div>
              </li>
              <li>
                <div className="progress-step active">
                  <span></span>
                  <p>Make Payment</p>
                </div>
              </li>
              <li>
                <div className="progress-step done">
                  <span></span>
                  <p>Confirmation</p>
                </div>
              </li>
            </ul>
          </div>
        <div className="card">
          <div className="card-body">
            <div className="pymt-succes-icon">
              <SvgCheckCircleIcon />
            </div>
            <div className="pymet-success-title">
              <h3>Thanks for your payment</h3>
              <p>Congratulations!! Your Ad is now live</p>
            </div>
            <div className="pymt-success-btn">
              <Link to="/" className="btn ">
                View Listing
                <span>
                  <SvgLongArrowIcon />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessPayment;
