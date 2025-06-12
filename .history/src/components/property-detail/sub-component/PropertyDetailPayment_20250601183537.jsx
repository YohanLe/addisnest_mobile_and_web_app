import React, { useState, useEffect } from "react";
import { PaymentGraph, PropertyPaymentDetail } from "../../../assets/images";
import { SvgRestIcon } from "../../../assets/svg-files/SvgFiles";
import { toast } from "react-toastify";
import Api from "../../../Apis/Api";


const PropertyDetailPayment = ({PropertyDetails}) => {
    const [homePrice, setHomePrice] = useState(0);
    const [downPayment, setDownPayment] = useState(100000);
    const [interestRate, setInterestRate] = useState(10);
    const [loanType, setLoanType] = useState(20);
    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [propertyTaxes, setPropertyTaxes] = useState(0);
    const [homeInsurance, setHomeInsurance] = useState(0);
    const [associationFee, setAssociationFee] = useState(0);
    const [mortgageInsurance, setMortgageInsurance] = useState(0);
    const [Loading, setLoading] = useState(false);

    const calculateMonthlyPayment = () => {
        const loanAmount = homePrice - downPayment;
        const monthlyInterestRate = interestRate / 100 / 12;
        const numberOfPayments = loanType * 12;
        let payment = 0;
        if (monthlyInterestRate > 0) {
            payment =
                (loanAmount * monthlyInterestRate) /
                (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
        } else {
            payment = loanAmount / numberOfPayments;
        }

        setMonthlyPayment(payment || 0);
    };

    // Function to set other dynamic values
    const updateAdditionalCosts = () => {
        setPropertyTaxes((homePrice * 0.015) / 12 || 0);
        setHomeInsurance((homePrice * 0.002) / 12 || 0);
        setAssociationFee(500 || 0);
        setMortgageInsurance(downPayment < homePrice * 0.2 ? 250 : 0);
    };

    useEffect(() => {
        calculateMonthlyPayment();
        updateAdditionalCosts();
        if(PropertyDetails){
            setHomePrice(PropertyDetails?.price);
        }
    }, [PropertyDetails]);

    useEffect(() => {
        calculateMonthlyPayment();
        updateAdditionalCosts();
    }, [homePrice, downPayment, interestRate, loanType]);

    const handleRangeChange = (setter, maxValue) => (e) => {
        const newValue = Number(e.target.value);
        setter(newValue);
        e.target.style.background = `linear-gradient(to right, #a6f255 ${(newValue / maxValue) * 100}%, #e0e0e0 ${(newValue / maxValue) * 100}%)`;
    };

    const PreApprovedFun = async () => {
        let body = {
            propertyId: PropertyDetails?.id,
        };
        try {
            setLoading(true);
            const response = await Api.postWithtoken("pre-approved", body);
            const { data, status, message } = response;
            setLoading(false);
            toast.success(message);
        } catch (error) {
            setLoading(false);
            toast.error(error.response.data.message);
        }
    };

    return (
        <section className="property-payment-section" style={{ backgroundImage: `url(${PropertyPaymentDetail})` }}>
            <div className="container">
                <div className="property-payment-main">
                    <div className="card">
                        <div className="main-flex">
                            <div className="inner-flex-40">
                                <div className="card-body">
                                    <div className="home-price-main">

                                        <div className="home-price-field">
                                            <p>Home Price</p>
                                            <input type="text" value={`ETB ${homePrice?.toLocaleString("en-US")}`} readOnly />
                                        </div>
                                        <div className="range-payment">
                                            <input type="range" min="0" max="500000000" step="100000" value={homePrice} onChange={handleRangeChange(setHomePrice, 50000000)} className="slider" />
                                        </div>

                                        <div className="discount-price-field">
                                            <p>Down Payment</p>
                                            <div className="discount-fild-input">
                                                <input type="text" value={`ETB ${downPayment.toLocaleString("en-US")}`} readOnly />
                                                <div className="discount-icon">
                                                    <input type="text" value={((downPayment / homePrice) * 100).toFixed(1) || 0} readOnly />
                                                    <span>%</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="range-payment">
                                            <input type="range" min="0" max={homePrice} step="100000" value={downPayment} onChange={handleRangeChange(setDownPayment, homePrice)} className="slider" />
                                        </div>

                                        <div className="interest-field">
                                            <p>Interest Rate</p>
                                            <div className="interst-fild-input">
                                                <input type="text" value={interestRate} readOnly />
                                                <span>%</span>
                                            </div>
                                        </div>
                                        <div className="range-payment">
                                            <input type="range" min="0" max="20" step="0.1" value={interestRate} onChange={handleRangeChange(setInterestRate, 20)} className="slider" />
                                        </div>

                                        {/* Loan Type Section (NOW CHANGEABLE) */}
                                        <div className="loan-field">
                                            <p>Loan Type</p>
                                            <div className="interst-fild-input">
                                                <input type="text" value={loanType} readOnly />
                                                <span>Years</span>
                                            </div>
                                        </div>
                                        <div className="range-payment">
                                            <input type="range" min="5" max="30" step="1" value={loanType} onChange={handleRangeChange(setLoanType, 30)} className="slider" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="inner-flex-60">
                                <div className="card-body">
                                    <div className="pymt-detail-main">
                                        <div className="pymt-detail-top">
                                            <div className="pymet-detail-title">
                                                <h4>Payment Calculator</h4>
                                                <p>
                                                    Estimate Costs for this home <span>ETB {monthlyPayment.toFixed(2)}</span>/month
                                                </p>
                                            </div>
                                            <div className="reset-btn">
                                                <button onClick={() => window.location.reload()}>
                                                    Reset
                                                    <span>
                                                        <SvgRestIcon />
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="pymt-ditl-list">
                                            <div className="main-flex">
                                                <div className="inner-flex-40">
                                                    <img src={PaymentGraph} alt="Payment Breakdown" />
                                                </div>
                                                <div className="inner-flex-60">
                                                    <div className="proprety-tax-list">
                                                        <div className="tax-prpty-dlte">
                                                            <p><span className="success-bg"></span>Principal & Interest</p>
                                                            <h5>ETB {monthlyPayment.toFixed(2)}</h5>
                                                        </div>
                                                        <div className="tax-prpty-dlte">
                                                            <p><span className="yllow-bg"></span>Property Taxes</p>
                                                            <h5>ETB {propertyTaxes.toFixed(2)}</h5>
                                                        </div>
                                                        <div className="tax-prpty-dlte">
                                                            <p><span className="blu-bg"></span>Home insurance</p>
                                                            <h5>ETB {homeInsurance.toFixed(2)}</h5>
                                                        </div>
                                                        <div className="tax-prpty-dlte">
                                                            <p><span className="prpel-bg"></span>Association Fee</p>
                                                            <h5>ETB {associationFee.toFixed(2)}</h5>
                                                        </div>
                                                        <div className="tax-prpty-dlte">
                                                            <p><span className="info-bg"></span>Mortgage insurance</p>
                                                            <h5>ETB {mortgageInsurance.toFixed(2)}</h5>
                                                        </div>

                                                        <div className="tax-property-btn">
                                                            <button onClick={PreApprovedFun} className="btn btn-primary">
                                                                Get Pre-Approved
                                                            </button>
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
            </div>
        </section>
    );
};

export default PropertyDetailPayment;
