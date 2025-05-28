import React from "react";
import { EthionestIcon1, EthionestIcon2, EthionestIcon3 } from "../../../assets/images";

const EthionestOffersSection = () => {
    return (
        <>
            <section className="ethionestoffers-section">
                <div className="container">
                    <div className="top-heading">
                        <h3>What Addisnest Offers</h3>
                    </div>
                    <div className="ethionestoffers-list">
                        <ul>
                            <li>
                                <div className="ethionestoffers-card">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="ethionestoffers-detail">
                                                <span>
                                                    <img src={EthionestIcon1} alt="" />
                                                </span>
                                                <h3>Buy</h3>
                                                <p>
                                                    Find the perfect property to call home. Browse
                                                    listings tailored to your needs and budget.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="ethionestoffers-card">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="ethionestoffers-detail">
                                                <span>
                                                    <img src={EthionestIcon2} alt="" />
                                                </span>
                                                <h3>Sell</h3>
                                                <p>
                                                    List your property effortlessly and reach serious
                                                    buyers with maximum visibility
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="ethionestoffers-card">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="ethionestoffers-detail">
                                                <span>
                                                    <img src={EthionestIcon3} alt="" />
                                                </span>
                                                <h3>Rent</h3>
                                                <p>
                                                    Discover rental options that fit your lifestyle,
                                                    whether for the short or long term.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </>
    );
};

export default EthionestOffersSection;
