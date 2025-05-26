import React, { useEffect, useRef, useState } from "react";
const NotificationList = () => {
  const [currentItem, setCurrentItem] = useState(null);
  const selectRefs = useRef([]);
  const NotificationData = [
   
    {
      Id: "5",
      Title: "New Property Add",
      Description: "  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatibus, qui.",
      Date: "Last Wednesday at 9:42 AM"
    },
  ];


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        currentItem !== null &&
        selectRefs.current[currentItem] &&
        !selectRefs.current[currentItem].contains(event.target)
      ) {
        setCurrentItem(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [currentItem]);

  return (
    <>
      <div className="responsive-table">
        <table className="table table-row-dashed">
          <thead>
            <tr>
              <th className="w-10px text-start">S.no</th>
              <th className="w-200px text-start">Description</th>
              <th className="w-70px text-end">Date</th>
            </tr>
          </thead>
          <tbody>
            {NotificationData.map((item, index) => (
              <tr key={item.Id}>
                <td>#{index + 1}</td>
                <td className="text-start">
                  <div className="prd-descrp">
                          <span className="d-block titl-view">
                          {item.Title}
                          </span>
                          <span className="d-block titl-userid">
                          {item.Description}
                          </span>
                        </div>
                  </td>
                <td className="text-end">{item.Date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default NotificationList;
