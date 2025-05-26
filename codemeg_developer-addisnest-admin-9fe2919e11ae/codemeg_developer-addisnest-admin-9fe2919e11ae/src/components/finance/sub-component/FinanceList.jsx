import React, { useEffect, useRef, useState } from "react";
const FinanceList = () => {
  const [currentItem, setCurrentItem] = useState(null);
  const selectRefs = useRef([]);
  const FinanceData = [
    {
      Id: "1",
      Name: "Emily Brown ",
      PaymentDate: "12/11/2024",
      Amount: "20210",
      PropertyStatus: "Paid",
      transactionId: "655554563",
    },
    {
      Id: "2",
      Name: "Patrick Jephcott",
      PaymentDate: "12/11/2024",
      Amount: "20210",
      PropertyStatus: "Paid",
      transactionId: "655554563",
    },
    {
      Id: "3",
      Name: "Emily Brown ",
      PaymentDate: "12/11/2024",
      Amount: "20210",
      PropertyStatus: "Unpaid",
      transactionId: "655554563",
    },
    {
      Id: "4",
      Name: "Emily Brown ",
      PaymentDate: "12/11/2024",
      Amount: "20210",
      PropertyStatus: "Paid",
      transactionId: "655554563",
    },
    {
      Id: "5",
      Name: "Patrick Jephcott ",
      PaymentDate: "12/11/2024",
      Amount: "20210",
      PropertyStatus: "Paid",
      transactionId: "655554563",
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
    <div className="finance-main">
      <div className="dashborad-details">
        <ul>
          <li>
            <div class="card dashcrd-bdy">
              <div className="card-body">
                <div className="dash-main">
                  <div className="dash-left">
                    <div className="dash-total">
                      <p>Total Revenue</p>
                      <h3>2,000</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <h3>Finance List</h3>
          </div>
        </div>
        <div className="card-body">
          <div className="responsive-table">
            <table className="table table-row-dashed">
              <thead>
                <tr>
                  <th className="w-10px text-start">S.no</th>
                  <th className="w-100px text-start">Name</th>
                  <th className="w-100px text-start">Amount</th>
                  <th className="w-100px text-center">Transaction Id</th>
                  <th className="w-100px text-center">Date</th>
                  <th className="w-100px text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {FinanceData.map((item, index) => (
                  <tr key={item.Id}>
                    <td>#{index + 1}</td>
                    <td className="text-start">{item.Name}</td>
                    <td className="text-start">
                      <span className="text-success">{item.Amount}</span>
                    </td>
                    <td className="text-center">{item.transactionId}</td>
                    <td className="text-center">{item.PaymentDate}</td>

                    <td className="text-center">{item.PropertyStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceList;
