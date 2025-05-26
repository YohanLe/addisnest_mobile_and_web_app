import React from "react";
import { ChatProfileOne, ChatProfileThree, ChatProfileTwo } from "../../../assets/images";
import { SvgSearchIcon } from "../../../assets/svg/Svg";
import { useSelector } from "react-redux";
import { GetAllUserList } from "../../../Redux-store/Slices/AllUserListSlice";

const chatUsers = [
    {
        id: 1,
        name: "Jackson Allen",
        message: "I came across your profile and...",
        image: ChatProfileOne,
    },
    {
        id: 2,
        name: "John Doe",
        message: "Looking forward to our meeting...",
        image: ChatProfileThree,
    },
    {
        id: 3,
        name: "Sophia Smith",
        message: "Let me know your thoughts...",
        image: ChatProfileTwo,
    },
    {
        id: 4,
        name: "Emma Johnson",
        message: "I reviewed the documents...",
        image: ChatProfileOne,
    },
    {
        id: 5,
        name: "Liam Williams",
        message: "Please send over the details...",
        image: ChatProfileThree,
    },
    {
        id: 6,
        name: "Olivia Brown",
        message: "Let’s reschedule the meeting...",
        image: ChatProfileTwo,
    },
];

// const AllUserData = useSelector((state) => state.AllUserList.Details);
// const AllUserList = AllUserData?.data;
// console.log('_______________POO',AllUserList)
// useEffect(() => {
//     dispatch(GetAllUserList());
// }, [])


const ChatList = ({ activeUser, setActiveUser }) => {
    return (
        <>
            <div className="chat-left">
                <div className="chat-users-main">
                    <div className="chat-header">
                        <div className="chathead-convrdtl">
                            <h3>Active Conversations</h3>
                        </div>
                        <div className="active-chats">
                            <span>{chatUsers.length}</span>
                        </div>
                    </div>
                    <div className="chat-wraper">
                        <div className="chat-filter">
                            <div className="ticket-search">
                                <div className="inputwth-icon">
                                    <input type="text" placeholder="Search.." />
                                    <div className="input-icon">
                                        <span>
                                            <SvgSearchIcon />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="chat-list">
                            <ul>
                                {chatUsers.map((user) => (
                                    <li key={user.id}>
                                        <div
                                            className={`chat-user-card ${activeUser?.id === user.id ? "active" : ""
                                                }`}
                                            onClick={() => setActiveUser(user)}
                                        >
                                            <div className="chat-user-bg">
                                                <span
                                                    style={{ backgroundImage: `url(${user.image})` }}
                                                ></span>
                                                <em className="online"></em>
                                            </div>
                                            <div className="chat-user-detail">
                                                <h3>{user.name}</h3>
                                                <p>{user.message}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatList;
