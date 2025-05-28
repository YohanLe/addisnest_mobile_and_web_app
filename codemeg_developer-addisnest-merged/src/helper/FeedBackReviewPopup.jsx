import React, { useState } from "react";
import Api from "../Apis/Api";
import { toast } from "react-toastify";
const FeedBackReviewPopup = ({ handlePopup,Data}) => {
  const [rating, setRating] = useState(0);
  const [isValid, setIsValid] = useState(true);
  const [Loading, setLoading] = useState(false);
  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const [InputData, setInputData] = useState({
    comment: "",
});
const handleInputChange = (event) => {
    setInputData((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }));
    setIsValid(event.target.value);
};

  const FeedBackFun = async () => {
    if (InputData.comment == '') {
        setIsValid(false)
    } else if (isValid) {
        let body = {
            agentId:Data.id,
            rating:rating,
            comment: InputData.comment,
        }
        try {
            setLoading(true)
            const response = await Api.postWithtoken("create-agentReview", body);
            const { data, status, message } = response;
            setLoading(false)
            handlePopup();
            setInputData({
                comment: "",
            });
            toast.success(message);
        } catch (error) {
            setLoading(false)
            toast.error(error.response.data.message);
        }
    }
};

  return (
    <>
      <div className="main-popup feedback-review">
        <div className="lm-outer">
          <div className="lm-inner">
            <div className="popup-inner">
              <div className="card-body">
                <div className="feedback-main">
                  <div className="fdbck-rating">
                    {[...Array(5)].map((_, index) => (
                      <span
                        key={index}
                        onClick={() => handleStarClick(index)}
                        style={{ cursor: "pointer" }}
                      >
                        <svg
                          width="37"
                          height="36"
                          viewBox="0 0 37 36"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.9573 1.55161C18.0812 1.17018 18.6208 1.17018 18.7448 1.55161L22.419 12.8596C22.5852 13.3713 23.0621 13.7178 23.6002 13.7178H35.4901C35.8912 13.7178 36.0579 14.231 35.7335 14.4668L26.1143 21.4555C25.679 21.7717 25.4969 22.3324 25.6631 22.8441L29.3373 34.1521C29.4612 34.5335 29.0247 34.8507 28.7002 34.615L19.0811 27.6262C18.6458 27.31 18.0563 27.31 17.621 27.6262L8.00185 34.615C7.67738 34.8507 7.24081 34.5335 7.36475 34.1521L11.0389 22.8441C11.2052 22.3324 11.0231 21.7717 10.5877 21.4555L0.968603 14.4668C0.644133 14.231 0.81089 13.7178 1.21195 13.7178H13.1018C13.6399 13.7178 14.1168 13.3713 14.2831 12.8596L17.9573 1.55161Z"
                            fill={index < rating ? "#B7EB58" : "#E5E7EA"}
                            stroke={index < rating ? "#B7EB58" : "#E5E7EA"}
                            strokeWidth="0.828025"
                          />
                        </svg>
                      </span>
                    ))}
                  </div>
                  <div className="fdck-field">
                    <h3>Give Feedback</h3>
                    <textarea
                      rows={4}
                      cols={4}
                      name="comment"
                      id="feedback"
                      placeholder="Share the details of your own experience at this place"
                      value={InputData?.comment}
                      onChange={handleInputChange}
                      className={`form-control ${!isValid == true ? "alert-input" : ""}`}
                    ></textarea>
                      {!isValid && <p style={{ color: 'red' }}>Please enter Discription</p>}
                  </div>
                  <div className="fdback-btn">
                    <button className="btn btn-secondary" onClick={handlePopup}>
                      Cancel
                    </button>
                    <button  className="btn btn-primary" onClick={FeedBackFun}>
                      Give
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="popup-overlay" onClick={handlePopup}></div>
      </div>
    </>
  );
};

export default FeedBackReviewPopup;
