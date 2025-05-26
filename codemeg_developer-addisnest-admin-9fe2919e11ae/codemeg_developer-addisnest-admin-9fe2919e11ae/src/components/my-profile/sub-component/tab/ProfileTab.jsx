import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile, updateProfile, clearUpdateStatus } from "../../../../Redux-store/Slices/AdminProfileSlice";
import { ValidateAdminProfileUpdate } from "../../../../utils/Validation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileTab = ({ setProfileImage, imageFile, existingProfileImage }) => {
  const dispatch = useDispatch();
  const { profile, updateLoading, updateError, updateSuccess } = useSelector(
    (state) => state.adminProfile
  );

  

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    address: "",
    phone: "",
    email: "",
    profile_img: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfile());
    } else {
      setFormData({
        name: profile.name || "",
        username: profile.username || "",
        address: profile.address || "",
        phone: profile.phone || "",
        email: profile.email || "",
        profile_img: profile.profile_img || "",
      });
      if (profile.profile_img) {
        setProfileImage(profile.profile_img);
      }
    }
  }, [profile, dispatch, setProfileImage]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success(updateSuccess);
      dispatch(clearUpdateStatus());
    }
    if (updateError) {
      toast.error(updateError);
      dispatch(clearUpdateStatus());
    }
  }, [updateSuccess, updateError, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleUpdate = async () => {
    const validationResult = ValidateAdminProfileUpdate(formData);
    if (!validationResult.isValid) {
      setErrors(validationResult.errors || {});
      return;
    }

    const baseUrl = "https://addisnest-node.codemeg.com/";

    // Use imageFile if selected, otherwise use existingProfileImage
    let profileImageToSend = imageFile && imageFile !== "DefaultProfileImg" ? imageFile : existingProfileImage;

    // Normalize to avoid double base URL and ensure relative path
    if (profileImageToSend && profileImageToSend.startsWith(baseUrl)) {
      profileImageToSend = profileImageToSend.replace(baseUrl, "");
    }

    const adminProfile = {
      name: formData.name,
      username: formData.username,
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      profile_img: profileImageToSend, // string path
    };

    console.log(adminProfile);
    await dispatch(updateProfile(adminProfile));
    dispatch(fetchProfile());
  };
  
  

  return (
    <>
      <div className="profile-detail">
        <div className="card-body">
          <div className="form-main">
            <div className="form-flex">
              <div className="form-flex-inner-50">
                <div className="single-input">
                  <label htmlFor="name" className="form-label">
                    Name <i>*</i>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter Your Name"
                    className={errors.name ? "alert-input" : ""}
                  />
                  {errors.name && (
                    <p className="error-input-msg">{errors.name}</p>
                  )}
                </div>
              </div>

              <div className="form-flex-inner-50">
                <div className="single-input">
                  <label htmlFor="username" className="form-label">
                    Username <i>*</i>
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter Your Username"
                    className={errors.username ? "alert-input" : ""}
                  />
                  {errors.username && (
                    <p className="error-input-msg">{errors.username}</p>
                  )}
                </div>
              </div>

              <div className="form-flex-inner-50">
                <div className="single-input">
                  <label htmlFor="address" className="form-label">
                    Address <i>*</i>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter Your Address"
                    className={errors.address ? "alert-input" : ""}
                  />
                  {errors.address && (
                    <p className="error-input-msg">{errors.address}</p>
                  )}
                </div>
              </div>

              <div className="form-flex-inner-50">
                <div className="single-input">
                  <label htmlFor="phone" className="form-label">
                    Phone Number <i>*</i>
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter Your Phone Number"
                    className={errors.phone ? "alert-input" : ""}
                  />
                  {errors.phone && (
                    <p className="error-input-msg">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="form-flex-inner-50">
                <div className="single-input">
                  <label htmlFor="email" className="form-label">
                    Email <i>*</i>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter Your Email"
                    className={errors.email ? "alert-input" : ""}
                  />
                  {errors.email && (
                    <p className="error-input-msg">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="form-btn">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdate}
                disabled={updateLoading}
              >
                {updateLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileTab;
