import React from "react";
import { EthisnestBg, EthisnestImage, Logo2 } from "../../../assets/images";
import {
  SvgMake1Icon,
  SvgMake2Icon,
  SvgMake3Icon,
} from "../../../assets/svg-files/SvgFiles";

const MakeEthniNestSection = () => {
  return (
    <>
      <section
        className="common-section makeethninest-section"
        style={{ backgroundImage: `url(${EthisnestBg})` }}
      >
        <div className="container">
          <div className="main-flex">
            <div className="inner-flex-50">
              <div
                className="makeethinest-image"
                style={{ backgroundImage: `url(${EthisnestImage})` }}
              >
                <span>
                  <img src={Logo2} alt="" />
                </span>
              </div>
            </div>
            <div className="inner-flex-50">
              <div className="makethninest-detail-main">
                <div className="top-heading leftalign-heading">
                  <h3>Make Your Mark with EthniNest </h3>
                  <p>
                    Join our platform to access a large network of clients,
                    showcase your properties, and elevate your real estate
                    career. Become part of a community that values expertise and
                    drives success.
                  </p>
                </div>
                <div className="makethninest-list">
                  <ul>
                    <li>
                      <div className="makethinest-list-main">
                        <span>
                          <SvgMake1Icon />
                        </span>
                        <p>
                          <em>Expand Your Reach:</em> Connect with serious
                          buyers and sellers
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="makethinest-list-main">
                        <span>
                          <SvgMake2Icon />
                        </span>
                        <p>
                          <em>Showcase Listings:</em> Stand out with optimized
                          property listings
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="makethinest-list-main">
                        <span>
                          <SvgMake3Icon />
                        </span>
                        <p>
                          <em> Supportive Platform:</em> Tools and resources to
                          help you succeed
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="makeethninest-btn">
                  <button className="btn btn-secondary">
                    Apply to Become an Agent
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MakeEthniNestSection;
