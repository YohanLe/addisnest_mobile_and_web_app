import React from "react";
import { PaymentGraph } from "../../../assets/images";
import {
  SvgCloseIcon,
  SvgDetailIcon,
} from "../../../assets/svg-files/SvgFiles";

const MortagageCalcuator = () => {
  return (
    <>
      <section className="common-section mortagage-section">
        <div className="container">
          <div className="pymt-ditl-list">
            <div className="main-flex">
              <div className="inner-flex-40">
                <img src={PaymentGraph} alt="" />
              </div>
              <div className="inner-flex-60">
                <div className="proprety-tax-list">
                  <div className="tax-prpty-dlte">
                    <p>
                      <span className="success-bg"></span>Principal & Interest
                    </p>
                    <h5>ETB 75,898</h5>
                  </div>
                  <div className="tax-prpty-dlte">
                    <p>
                      <span className="yllow-bg"></span>Property Taxes
                    </p>
                    <h5>ETB 1,435</h5>
                  </div>
                  <div className="tax-prpty-dlte">
                    <p>
                      <span className="blu-bg"></span>Home insurance
                    </p>
                    <h5>ETB 2,435</h5>
                  </div>
                  <div className="tax-prpty-dlte">
                    <p>
                      <span className="prpel-bg"></span>Association Fee
                    </p>
                    <h5>ETB 6,435</h5>
                  </div>
                  <div className="tax-prpty-dlte">
                    <p>
                      <span className="info-bg"></span>Mortgage insurance
                    </p>
                    <h5>ETB 435</h5>
                  </div>
                </div>
                <div className="tax-property-btn">
                  <button className="btn btn-primary">Get Pre-Approved</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mortagage-form-section">
      <div className="container">
      <div className="mortagage-form-main">
            <div className="card">
              <div className="main-flex">
                <div className="inner-flex-50">
                  <div className="card-body">
                    <div className="form-flex">
                      <div className="form-inner-flx-100">
                        <div className="single-input">
                          <label>Home location</label>
                          <div className="form-position-main">
                            <input
                              type="text"
                              placeholder="Beverly Hills, CA"
                            />
                            <div className="form-icon-absolut">
                              <span>
                                <SvgCloseIcon />
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="tax-prpty-dlte input-btn-title">
                          <p>
                            <span className="success-bg"></span>
                            Principal & Interest
                            <em>
                              <SvgDetailIcon />
                            </em>
                          </p>
                          <div className="mortagageinput-rate">
                            <h4>ETB 75,898</h4>
                          </div>
                        </div>
                      </div>
                      <div className="form-inner-flx-100">
                        <div className="single-input">
                          <label>Home price</label>
                          <div className="form-position-main">
                            <input
                              type="text"
                              placeholder="Beverly Hills, CA"
                            />
                            <div className="form-icon-absolut">
                              <span>
                                <SvgCloseIcon />
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="tax-prpty-dlte input-btn-title">
                          <p>
                            Estimated closing cost(4%): ETB 269,900
                            <em>
                              <SvgDetailIcon />
                            </em>
                          </p>
                        </div>
                      </div>
                      <div className="form-inner-flx-100">
                        <div className="single-input">
                          <label>Down payment</label>
                          <div className="form-position-main">
                            <input
                              type="text"
                              placeholder="Beverly Hills, CA"
                            />
                            <div className="form-icon-absolut">
                              <span>
                                <SvgCloseIcon />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-inner-flx-100">
                        <div className="single-input">
                          <label>
                            Loan type{" "}
                            <em>
                              <SvgDetailIcon />
                            </em>
                          </label>
                          <div className="form-position-main">
                            <input
                              type="text"
                              placeholder="Beverly Hills, CA"
                            />
                            <div className="form-icon-absolut">
                              <span>
                                <SvgCloseIcon />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-inner-flx-100">
                        <div className="single-input">
                          <label>
                            Interest rate{" "}
                            <em>
                              <SvgDetailIcon />
                            </em>
                          </label>
                          <div className="form-position-main">
                            <input
                              type="text"
                              placeholder="Beverly Hills, CA"
                            />
                            <div className="form-icon-absolut">
                              <span>
                                <SvgCloseIcon />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="inner-flex-50">
                  <div className="card-body">
                    <div className="form-flex">
                      <div className="form-inner-flx-100">
                        <div className="single-input">
                          <label>
                            <span className="yllow-bg"></span>
                            Property tax
                            <em>
                              <SvgDetailIcon />
                            </em>
                          </label>
                          <div className="form-position-main">
                            <input
                              type="text"
                              placeholder="Beverly Hills, CA"
                            />
                            <div className="form-icon-absolut">
                              <span>
                                <SvgCloseIcon />
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="tax-prpty-dlte input-btn-title">
                          <p>
                            Total tax/year (1.25% of home price): ETB 84,348
                          </p>
                        </div>
                      </div>
                      <div className="form-inner-flx-100">
                        <div className="single-input">
                          <label>
                            <span className="blu-bg"></span>
                            Home insurance
                            <em>
                              <SvgDetailIcon />
                            </em>
                          </label>
                          <div className="form-position-main">
                            <input
                              type="text"
                              placeholder="Beverly Hills, CA"
                            />
                            <div className="form-icon-absolut">
                              <span>
                                <SvgCloseIcon />
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="tax-prpty-dlte input-btn-title">
                          <p>compare rate</p>
                        </div>
                      </div>
                      <div className="form-inner-flx-100">
                        <div className="single-input">
                          <label>
                            <span className="prpel-bg"></span>
                            Association Fee
                            <em>
                              <SvgDetailIcon />
                            </em>
                          </label>
                          <div className="form-position-main">
                            <input
                              type="text"
                              placeholder="Beverly Hills, CA"
                            />
                            <div className="form-icon-absolut">
                              <span>
                                <SvgCloseIcon />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-inner-flx-100">
                        <div className="single-input">
                          <label>
                            <span className="info-bg"></span>
                            Mortgage insurance
                            <em>
                              <SvgDetailIcon />
                            </em>
                          </label>
                          <div className="form-position-main">
                            <input
                              type="text"
                              placeholder="Beverly Hills, CA"
                            />
                            <div className="form-icon-absolut">
                              <span>
                                <SvgCloseIcon />
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="tax-prpty-dlte input-btn-title">
                          <p>ETB 0 if down payment is 20%+</p>
                        </div>
                      </div>
                      <div className="form-inner-flx-100">
                        <div className="single-input">
                          <label>Commission Percentage</label>
                          <div className="form-position-main">
                            <input
                              type="text"
                              placeholder="Beverly Hills, CA"
                            />
                            <div className="form-icon-absolut">
                              <span>
                                <SvgCloseIcon />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
          </section>
    </>
  );
};

export default MortagageCalcuator;
