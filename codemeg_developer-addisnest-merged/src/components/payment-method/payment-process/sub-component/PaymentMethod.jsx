import React, { useEffect, useState } from "react";
import { Paypal, Upi, Visa } from "../../../../assets/images";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Api from "../../../../Apis/Api";
import { toast } from "react-toastify";


const settypeandvalue = (data)=>{
    if(data && data.length > 0){
        let newdata =  data.map((item)=>item?.value);
        return newdata.toString();
    }else{
        return '';
    }
}
const PaymentMethod = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const [Tax, setTax] = useState(12);
    const [TotalAmount, setTotalAmount] = useState(0);
    const [TaxAmount, setTaxAmount] = useState(0);
    console.log('______________><',state)

    const [Loading, setLoading] = useState(false);
    const MakePaymentFuns = async () => {
            let Newfeacture=[
                {
                    type:"kitchen_information",
                    value:settypeandvalue(state?.AllData?.kitchen_information)
                },
                {
                    type:'security_features',
                    value:settypeandvalue(state.AllData?.security_features)
                },
                {
                    type:'parking',
                    value:settypeandvalue(state.AllData?.parking),
                },
                {
                    type:'laundr_facilities',
                    value:settypeandvalue(state.AllData?.laundr_facilities),
                },
                {
                    type:'rooftop_terrace',
                    value:settypeandvalue(state.AllData?.rooftop_terrace)
                },
                {
                    type:'conference_facilities',
                    value:settypeandvalue(state?.AllData?.conference_facilities)
                },

                {
                    type:'underground_water_system',
                    value:state?.AllData?.underground_water_system
                },
                {
                    type:'barbecue_grills',
                    value:state?.AllData?.barbecue_grills
                },
                
            ]
            try {
                let body = {
                    latitude:state.AllData?.lat,
                    longitude:state.AllData?.lng,
                    address:state.AllData?.property_address,
                    status:'ACTIVE',
                    state:state?.AllData?.regional_state,
                    city:state?.AllData?.city,
                    country:state?.AllData?.country,
                    propertyFor:state.AllData?.property_for,
                    price:state.AllData?.total_price,
                    description:state.AllData?.description,
                    property_type:state.AllData?.property_type?.value,
                    readiness:state.AllData?.property_readiness,
                    property_size:state.AllData?.property_size,
                    condition:state.AllData?.condition?.value,
                    furnishing:state.AllData?.furnishing?.value,
                    bathroom_information:state?.AllData?.special_bathroom_features,

                    planType: state?.BasicPlan?.PlanData?.type,
                    activeDay:state?.BasicPlan?.PlanData?.range,
                    images:state?.AllData?.media_paths,
                    features:Newfeacture,
                    cooling_information:{
                        type:'Central AC',
                        value:state?.AllData?.cooling_information,
                    },
                    interior:{
                        type:'interior',
                        value:state?.AllData?.interior
                    },
                    heating_information:{
                        type:'Has Heating',
                        value:state?.AllData?.heating_information,
                    }
                    // cooling_information:state?.AllData?.cooling_information,
                    // heating_information:state?.AllData?.heating_information,
                    // interior:state?.AllData?.interior,
                    // underground_water_system:state?.AllData?.underground_water_system,

                    // parking:state.AllData?.parking,
                    // laundr_facilities:state.AllData?.laundr_facilities,
                    // rooftop_terrace:state.AllData?.rooftop_terrace,
                    // security_features:state.AllData?.security_features,
                    // kitchen_information:state?.AllData?.kitchen_information,
                    // conference_facilities:state?.AllData?.conference_facilities,

                }
                let formData = new FormData();
                for (let key in body) {
                    formData.append(key, body[key]);
                }
                setLoading(true);
                const response = await Api.postWithtoken("properties/create", body);
                const { data, message } = response;
                toast.success(message);
                navigate('/success-payment')
               
            } catch (error) {
                // toast.error(error.response.data.message);
                setLoading(false);
            }
        
    };

    useEffect(()=>{
        let newdata=state?.BasicPlan?.PlanData
        if(newdata){
           let newAmount =state?.BasicPlan?.PlanData?.price
           let TaxAmout=(newAmount*Tax)/100
           let TotaAmout=TaxAmout + state?.BasicPlan?.PlanData?.price
           setTaxAmount(TaxAmout)
            setTotalAmount(TotaAmout)
        }
       
    },[])
    return (
        <section className="common-section payment-section">
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
                            <div className="progress-step done">
                                <span></span>
                                <p>Make Payment</p>
                            </div>
                        </li>
                        <li>
                            <div className="progress-step">
                                <span></span>
                                <p>Confirmation</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="main-flex">
                    <div className="inner-flex-60">
                        <div className="card">
                            <div className="card-body">
                                <div className="paynt-heading">
                                    <h3>Payment</h3>
                                    <p>Choose Payment Method</p>
                                </div>
                                <div className="pymt-list">
                                    <div className="form-flex">
                                        <div className="form-inner-flex-100">
                                            <div className="pymt-process">
                                                <label htmlFor="creditCard">
                                                    <div className="pymt-mthd-img">
                                                        <img src={Visa} alt="Visa" />
                                                        <h5>Credit Card</h5>
                                                    </div>
                                                    <div className="slots-card">
                                                        <input
                                                            type="radio"
                                                            id="creditCard" // Unique ID
                                                            name="slots"
                                                        />
                                                        <span>
                                                            <em></em>
                                                        </span>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card mt-15">
                                        <div className="card-body">
                                            <div className="paymentcard-detail">
                                                <div className="form-flex">
                                                    <div className="form-inner-flex-100">
                                                        <label className="form-label">
                                                            Card Holder Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter your Card Hoilder Name"
                                                            className="alert-input"
                                                        />
                                                    </div>
                                                    <div className="form-inner-flex-100">
                                                        <label className="form-label">Card Number</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter your Card Number"
                                                            className="alert-input"
                                                        />
                                                    </div>
                                                    <div className="form-inner-flex-50">
                                                        <label className="form-label">
                                                            Expiration Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            // placeholder="Enter your Card Number"
                                                            className="alert-input"
                                                        />
                                                    </div>
                                                    <div className="form-inner-flex-50">
                                                        <label className="form-label">CVV</label>
                                                        <input
                                                            type="time"
                                                            // placeholder="Enter your Card Number"
                                                            className="alert-input"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="pymt-chck-main">
                                                    <div class="check-main">
                                                        <div class="custom-checkbox">
                                                            <label>
                                                                <input type="checkbox" name="checkbox" />
                                                                <em></em>
                                                            </label>
                                                        </div>
                                                        <p>Save card securely for further payments</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="option-pymt-mthd">
                                        <div className="form-flex">
                                            <div className="form-inner-flex-100">
                                                <div className="pymt-process">
                                                    <label htmlFor="upi">
                                                        <div className="pymt-mthd-img">
                                                            <img src={Upi} alt="UPI" />
                                                            <h5>UPI</h5>
                                                        </div>
                                                        <div className="slots-card">
                                                            <input type="radio" id="upi" name="slots" />
                                                            <span>
                                                                <em></em>
                                                            </span>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-inner-flex-100">
                                                <div className="pymt-process">
                                                    <label htmlFor="paypal">
                                                        <div className="pymt-mthd-img">
                                                            <img src={Paypal} alt="PayPal" />
                                                            <h5>PayPal</h5>
                                                        </div>
                                                        <div className="slots-card">
                                                            <input type="radio" id="paypal" name="slots" />
                                                            <span>
                                                                <em></em>
                                                            </span>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pymt-btn">
                                        <Link className="btn btn-secondary">Cancel</Link>
                                        <button onClick={MakePaymentFuns}  className="btn btn-primary">Make payment</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="inner-flex-40">
                        <div className="card">
                            <div className="card-body">
                                <div className="summary-heading">
                                    <h3>Summary</h3>
                                </div>
                                <div className="summay-total">
                                    <div className="summay-title">
                                        <h5>{state?.BasicPlan?.PlanData?.name}</h5>
                                    </div>
                                    <div className="summay-pym-list">
                                        <span>{state?.BasicPlan?.PlanData?.range}</span>
                                        <h3>
                                            <em>ETB</em>{state?.BasicPlan?.PlanData?.price}
                                        </h3>
                                    </div>
                                </div>
                                <div className="summay-tax">
                                    <p>Tax ({Tax}%)</p>
                                    <p>ETB {TaxAmount}</p>
                                </div>
                                <div className="summary-pyt-total">
                                    <h5>Total</h5>
                                    <div className="total-detail">
                                        <h4>ETB {TotalAmount}</h4>
                                        <p>+ applicable tax</p>
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

export default PaymentMethod;
