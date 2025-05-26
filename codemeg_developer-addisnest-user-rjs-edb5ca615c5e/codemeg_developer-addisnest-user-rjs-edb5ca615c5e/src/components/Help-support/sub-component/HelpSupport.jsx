import React from "react";
import { LogoIcon } from "../../../assets/images";
import { Link } from "react-router-dom";
import {
  SvgLongArrowIcon,
  SvgSearchIcon,
} from "../../../assets/svg-files/SvgFiles";

const HelpSupport = () => {
  return (
    <>
      <section className="common-section help-support-section">
        <div className="container">
          <div className="hlpsupporty-main">
            <div className="hlpsupport-srchtp">
              <div className="hlpsuport-logo">
                <img src={LogoIcon} alt="" />
              </div>
              <div className="hlpsuport-srch">
                <h3>How can we help you?</h3>
                <div className="findagent-srcg-input">
                  <input type="text" placeholder="Search here" />
                  <Link to="#" className="btn btn-primary">
                    <SvgLongArrowIcon />
                  </Link>
                </div>
              </div>
            </div>
            <div className="hlpsupport-list">
              <div className="hlpsupport-desp">
                <h3>Need Assistance? We’re Here to Help!</h3>
                <p>
                  Whether you have questions about buying, selling, or
                  navigating our platform, our support team is ready to assist
                  you every step of the way.
                </p>
              </div>
              <div className="hlpsupport-desp">
                <h3>Frequently Asked Questions</h3>
                <p>
                  Find quick answers to the most common questions about using
                  our platform, managing listings, and more.
                </p>
              </div>
              <div className="hlpsupport-desp">
                <h3>Contact Support</h3>
                <p>
                  For personalized assistance, reach out to our support team via
                  chat, email, or phone
                </p>
                <div className="hlpsupport-inner-list">
                  <p>
                    <span></span> <em>Live Chat:</em> Available 24/7 for instant
                    help.
                  </p>
                  <p>
                    <span></span>
                    <em>Email Us:</em> Send us an email, and we’ll respond
                    within 24 hours
                  </p>
                  <p>
                    <span></span> <em>Phone Support:</em>Call us directly at
                    [Phone Number] for immediate assistance
                  </p>
                </div>
              </div>
              <div className="hlpsupport-desp">
                <h3>Guides & Resources</h3>
                <p>
                  Explore step-by-step guides, tips, and articles designed to
                  help you make the most of our platform
                </p>
              </div>
              <div className="hlpsupport-desp">
                <h3>Become an Expert</h3>
                <p>
                  For more in-depth support, learn about our premium assistance
                  options, including dedicated agent support and personalized
                  market insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HelpSupport;
