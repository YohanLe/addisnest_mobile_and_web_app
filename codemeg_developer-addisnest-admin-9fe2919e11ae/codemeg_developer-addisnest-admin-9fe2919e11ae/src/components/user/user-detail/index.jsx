import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import CommanHeader from "../../common/common-header/CommonHeader";
import { UserDetailInfo, UserHistoryList } from "./sub-component";
import { fetchUserDetails } from "../../../Redux-store/Slices/UserDetailsSlice";

const Index = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(fetchUserDetails(id));
    }
  }, [id, dispatch]);

  return (
    <>
      <div className="main-wrapper">
        <CommanHeader title={"User Detail"} />
        <UserDetailInfo />
        <UserHistoryList />
      </div>
    </>
  );
};

export default Index;
