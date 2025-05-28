import React, { useEffect, useState } from "react";
import { Agent1, Agent1 as DefaultProfileImg } from "../../../../assets/images";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { AuthUserDetails } from "../../../../Redux-store/Slices/AuthSlice";
import { ValidateUserCusProfileUpdate } from "../../../../utils/Validation";
import Api from "../../../../Apis/Api";
import { toast } from "react-toastify";
const MyProfileTab = () => {
    const dispatch = useDispatch();
    const [profileImage, setProfileImage] = useState(DefaultProfileImg); // Default image
    const StateList = [
        { value:1, label: "India" },
        { value:1, label: "India" }
    ];
    const [Loading, setLoading] = useState(false);
    const [MediaPaths, setMediaPaths] = useState('');
    const [error, setError] = useState({ isValid: false });
    const ProfileDetail = useSelector((state) => state.Auth.Details);
    const profiledata = ProfileDetail?.data;
    const [image, setImage] = useState({ uri:profiledata?.profile_img, file: '' });
    const [inps, setInps] = useState({
        email: '',
        name:'',
        phone:'',
    })

    useEffect(()=>{
      setInps({
            email:profiledata?.email,
            name:profiledata?.name,
            phone:profiledata?.phone,
        })
    },[profiledata])
    const onInpChanged = (event) => {
        setError(p => {
            const obj = { ...p }
            obj?.errors && delete obj?.errors[event?.target?.name]
            return obj
        })
        setInps((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }));
    };
    useEffect(() => {
        dispatch(AuthUserDetails());
    }, []);

    
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const data = { 
                    uri: reader.result,
                    file 
                };
                setImage(data);
               
            };
            reader.readAsDataURL(file);
            await ImagesUpload(file);
        }
    };

    const ImagesUpload = async (file) => {
        try {
            setLoading(true);
            let formData = new FormData();
            formData.append("mediaFiles", file);
            
            const response = await Api.postWithtoken("media/public", formData);
            const { files, message } = response;
            setLoading(false);
    
            if (files && typeof files === 'string') {
                setMediaPaths(files);
            } else if (files && Array.isArray(files) && files.length > 0) {
                setMediaPaths(files[0]);
            } else {
                throw new Error("Invalid response from server");
            }
    
            toast.success(message);
        } catch (error) {
            setLoading(false);
            console.error("Upload Error:", error);
            toast.error(error?.response?.data?.message || "Image upload failed!");
        }
    };
    const UpdateProfile = async () => {
        const errorMessage = ValidateUserCusProfileUpdate(inps);
        if (errorMessage.isValid == false) {
            setError(errorMessage);
        } else {
           
            try {
                let body = {
                    email:inps.email,
                    name:inps.name,
                    phone:inps.phone,
                    profile_img:MediaPaths,
                }
                // let formData = new FormData();
                // for (let key in body) {
                //     formData.append(key, body[key]);
                // }
                setLoading(true);
                const response = await Api.postWithtoken("auth/updateProfile",body);
                const { data,message} = response;
                dispatch(AuthUserDetails());
                toast.success(message);
            } catch (error) {
                toast.error(error.response.data.message);
                setLoading(false);
            }
        }
    };

    return (
        <>
            <div className="myprofile-main-section">
                <div className="card-body">
                    <div className="imgupl-reslt">
                        {/* Image Upload Section */}
                        <label htmlFor="imageInput" className="camera-icon">
                            <div className="pancil-icon">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clip-path="url(#clip0_2226_5057)">
                                        <path
                                            d="M12.0003 6.66671L9.33368 4.00004M1.66699 14.3334L3.92324 14.0827C4.1989 14.0521 4.33673 14.0367 4.46556 13.995C4.57985 13.958 4.68862 13.9058 4.78892 13.8396C4.90196 13.7651 5.00002 13.667 5.19614 13.4709L14.0003 4.66671C14.7367 3.93033 14.7367 2.73642 14.0003 2.00004C13.264 1.26366 12.0701 1.26366 11.3337 2.00004L2.52948 10.8042C2.33336 11.0003 2.2353 11.0984 2.16075 11.2114C2.09461 11.3117 2.04234 11.4205 2.00533 11.5348C1.96363 11.6636 1.94831 11.8015 1.91769 12.0771L1.66699 14.3334Z"
                                            stroke="#FAFAFA"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_2226_5057">
                                            <rect width="16" height="16" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <input
                                type="file"
                                id="imageInput"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                            {/* Profile Image Preview */}
                            <div id="imagePreview">
                                <div className="uplinr-pic">
                                    <span
                                        style={{
                                            backgroundImage: `url(${image?.uri})`,
                                        }}
                                    ></span>
                                </div>
                            </div>
                        </label>
                        <div className="img-uploader">
                            <h3>Upload Picture</h3>
                            <p>Size: less than 3MB</p>
                        </div>
                    </div>
                    <div className="form-flex">
                        <div className="form-inner-flex-100">
                            <div className="single-input">
                                <label for="">Full Name</label>
                                <input type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    onChange={onInpChanged}
                                    value={inps?.name}
                                    className={`${error.errors?.name ? "alert-input" : ""}`}
                                />
                                {error.errors?.name && <p className="error-input-msg">{error.errors?.name}</p>}
                            </div>
                        </div>
                        <div className="form-inner-flex-50">
                            <div className="single-input">
                                <label for="">Email Address</label>
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="Enter your email"
                                    onChange={onInpChanged}
                                    value={inps?.email}
                                    className={`${error.errors?.email ? "alert-input" : ""}`}
                                />
                                {error.errors?.email && <p className="error-input-msg">{error.errors?.email}</p>}
                            </div>
                        </div>
                        <div className="form-inner-flex-50">
                            <div className="single-input">
                                <label for="">Phone</label>
                                <input
                                    type="text"
                                    placeholder="Enter your number"
                                    name="phone"
                                    onChange={onInpChanged}
                                    value={inps?.phone}
                                    className={`${error.errors?.phone ? "alert-input" : ""}`}
                                />
                                {error.errors?.phone && <p className="error-input-msg">{error.errors?.phone}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="myprofile-btn">
                        <button className="btn btn-secondary">Cancel</button>
                        <button onClick={UpdateProfile} className="btn btn-primary">Update</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyProfileTab;
