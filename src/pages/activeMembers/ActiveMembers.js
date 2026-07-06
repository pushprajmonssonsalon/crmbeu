import { useEffect, useState } from "react";
import { getApiCall } from "../../utils/services";
import AccordianTable from "../../components/Table/AccordianTable";
import { AiOutlineSearch } from "react-icons/ai";
import NormalInput from "../../components/customInput/NormalInput";
import { useSearchParams } from "react-router-dom";
import exportToExcel from "../../utils/exportToExcel";

const ActiveMembers = () => {
  const [members, setMembers] = useState([]);
  const [searchParams] = useSearchParams()

  const phone = searchParams.get("phone")
  const [phoneNumber, setPhoneNumber] = useState(phone ? phone : "");

  const cols = [
  
    {
      name: "Member Name",
      id: "name",
    },
    {
      name: "Phone Number",
      id: "phoneNumber",
    },
    {
      name:"Details",
      id:"details"
    }
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
      date: true
    },
    {
      name: "Expiring On",
      id: "validTo",
      date: true
    },
  ];

const handleExportActiveMembership = () => {
  const data = members.flatMap((member) =>
    (member.activeMembership || []).map((membership, index) => ({
      Name: member?.name,
      "Phone Number": member?.phoneNumber,
      "Membership Name": membership?.name,
      "Credit Left": membership?.creditsLeft,
      "Joined On": membership?.createdAt
        ? new Date(membership.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "",
      "Expiring On": membership?.validTo
        ? new Date(membership.validTo).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "",
    }))
  );

  const finalData = data.map((item, index) => ({
    "S.no": index + 1,
    ...item,
  }));

  exportToExcel(finalData, "ActiveMembers", "active_members.xlsx");
};

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
      () => { }
    );
  }, []);
  return (
    <>
      {" "}

       
      <div className=" rounded-[16px] border border-primaryGray p-5  ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <h2 className="text-black text-start  font-normal text-[22px] leading-[28px]">Active Members</h2>
            <span className="rounded-[16px] text-xs px-6 border border-gray2">{members?.length} Members</span>

             <button
                className="w-[150px] bg-ternary font-normal h-[36px] flex items-center justify-center active:bg-ternary/90 transition-colors ease-in duration-100 rounded-[16px] text-white text-sm leading-[24px]"
                onClick={handleExportActiveMembership}
              >
                Export All
              </button>
          </div>
            <div className="relative flex items-center">
              <AiOutlineSearch className="absolute text-lg text-lightGray left-[10px]" />
              <NormalInput
                inputStyles={{
                  'width': "280px",
                  borderRadius: "16px",
                  padding: "5px 40px",
                  fontSize: "14px",
                  borderColor: "#D9D9D9"
                }}
                value={phoneNumber}
                placeholder="Search by Phone Number"
                onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
         
        </div>
        <div className="w-full mt-6">
          <AccordianTable
            cols={cols}
            rows={members}
            cols2={cols2}
            phoneNumber={phoneNumber}
            rows2={members}
          />
        </div>
      </div>

    </>
  );
};

export default ActiveMembers;
