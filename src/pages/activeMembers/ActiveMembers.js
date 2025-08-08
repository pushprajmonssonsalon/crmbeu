import { useEffect, useState } from "react";
import { formatDate, getApiCall } from "../../utils/services";
import AccordianTable from "../../components/Table/AccordianTable";
import { AiOutlineSearch } from "react-icons/ai";
import NormalInput from "../../components/customInput/NormalInput";
import { useSearchParams } from "react-router-dom";
import CustomTable from "../../components/Table/CustomTable";
import NormalSelect from "../../components/customInput/NormalSelect";

const ActiveMembers = () => {
  const [members, setMembers] = useState([]);
  const [searchParams] = useSearchParams()
  const [expiringMemberships,setExpiringMemberships]=useState([]);
  const [filteredMemberships,setFilteredMemberships]=useState([])
  const phone = searchParams.get("phone")
  const [phoneNumber, setPhoneNumber] = useState(phone ? phone : "");
    const [days, setDays] = useState(30);

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

  const daysOptions = [
    { name: "This Week", value: 7 },
    { name: "This Month", value: 30 },
    

  ]
   
  const fetchInActiveUser = () => {
    getApiCall(`reports/getMembershipExpiringFromDays`,
      (res) => {
        console.log(res)
       
          let newObj={};
          Object.keys(res).forEach((key)=>{
              newObj[key]=res[key]?.length>0?res[key]?.map((elm)=>({...elm, validTo: formatDate(elm?.validTo)})):[];
          })
          console.log(newObj,"newObj")
          setExpiringMemberships(newObj)
          setFilteredMemberships(newObj["30"]||[])
        
      }, () => { })

  }
  useEffect(()=>{
fetchInActiveUser()
  },[])
  useEffect(()=>{
  setFilteredMemberships(expiringMemberships[days])
  },[days])
  
 
  const expMemCols = [{
    name: "Customer Name",
    id: "name",
  }, {
    name: "Contact Number",
    id: 'phoneNumber',
  }, {
    name: "Membership",
    id: 'membershipName'
  },{
    name: "Expiry",
    id: 'validTo'
  }]
 

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

         <div className="col-span-full h-full  border my-5 shadow-graph bg-white rounded-[16px] p-5">
                  <div>
                    <h2 className="text-black  text-start text-xl 2xl:text-2xl leading-[28px] font-normal mb-5">Membership Expiry Overview</h2>
                    <div className="flex flex-col gap-1 ">
                      <NormalSelect
                        label="Select Days"
                        options={daysOptions}
                        placeholder="Select Days"
                        value={days}
                        lableStyles={{
                          'fontWeight': '400',
                          "fontSize": "16px",
                          'color': '#000000'
                        }}
                        inputStyles={{
                          width: "250px"
                        }}
                        onChange={(e) => setDays(e.target.value)}
                      />
                    </div>
               
                  </div>
      
        {filteredMemberships?.length > 0 ? <CustomTable
                      columns={expMemCols}
                      rows={filteredMemberships}
                    /> : <div className="h-[20vh] flex items-center justify-center">
                      <h2 className="text-gray2  text-md  mb-5">Users Not Found</h2>
                    </div>}
                </div>
      <div className=" rounded-[16px] border border-primaryGray p-5  ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <h2 className="text-black text-start  font-normal text-[22px] leading-[28px]">Active Members</h2>
            <span className="rounded-[16px] text-xs px-6 border border-gray2">{members?.length} Members</span>


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
