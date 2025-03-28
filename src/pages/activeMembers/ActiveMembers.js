import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { getApiCall } from "../../utils/services";
import AccordianTable from "../../components/Table/AccordianTable";

const ActiveMembers = () => {
  const [members, setMembers] = useState([]);

  const cols = [
    {
      name: "Name",
      id: "name",
    },
    {
      name: "Phone Number",
      id: "phoneNumber",
    },
  ];
  const cols2 = [
    {
      name: "Membership Name",
      id: "name",
    },

    {
      name: "Credit Left",
      id: "creditsLeft",
    },
    {
      name: "Joined On",
      id: "createdAt",
      date:true
    },
    {
      name: "Expiring On",
      id: "validTo",
      date:true
    },
  ];

  const data = [
    {
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "123-456-7890",
      details: "Additional details about John Doe...",
    },
    {
      name: "Jane Smith",
      email: "janesmith@example.com",
      phone: "987-654-3210",
      details: "Additional details about Jane Smith...",
    },
    // Add more rows as needed
  ];

  useEffect(() => {
    getApiCall(
      "membership/getTotalActiveMembershipOfUser",
      (res) => {
        setMembers(
          res?.map((elm) => ({
            ...elm,
            activeMembership:
              elm?.activeMembership?.length > 0
                ? elm.activeMembership.map(
                    ({ _id, membershipSaleId, membershipId, ...rest }) => rest
                  )
                : [],
          }))
        );
      },
      () => {}
    );
  }, []);
  return (
    <>
      {" "}
    
        <div className="w-[90%] mx-auto mt-28 overflow-x-auto my-10 py-16">
          <h2 className="font-semibold text-4xl text-black text-center mb-5">
            Active Members
          </h2>
          <div className="w-full max-w-3xl mx-auto p-4">
            <AccordianTable
              cols={cols}
              rows={members}
              cols2={cols2}
              rows2={members}
            />
          </div>
        </div>
    
    </>
  );
};

export default ActiveMembers;
