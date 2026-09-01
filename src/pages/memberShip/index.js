import { useEffect, useState } from "react";
import "./membership.css";
import { formatDate, getApiCall, postApiData } from "../../utils/services";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { IoMdPersonAdd } from "react-icons/io";
import CustomizedTables from "../../components/MaterialTable";
import MemComponent from "../../components/membership/MemComponent";
import { FaAngleDown, FaCalendarAlt } from "react-icons/fa";
import exportToExcel from "../../utils/exportToExcel";
import { useSearchParams } from "react-router-dom";
import CustomDatePicker from "../../components/customInput/CustomDatePicker";
export default function Membership() {
  const [membershiptype, setMembershipType] = useState([]);
  const [membership, setMemberShip] = useState("");

  const [userId, setUserId] = useState("");
  const [memberShipdata, setMemberShipData] = useState([]);
  const [memeberShipDetails, setmemeberShipDetails] = useState([]);
  const [todayMembership, setTodayMembership] = useState([]);
  //date
  // Get first day of the current month
  
  // Format both
  const today= new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const defaultStartDate = formatDate(firstDayOfMonth); // e.g. "2025-07-01"
const defaultEndDate = formatDate(today);             // e.g. "2025-07-23"

 

  const [searchParams] = useSearchParams();
  const start = searchParams.get("start");
  const end = searchParams.get("end")
  const [showDate, setShowDate] = useState(false)
  const [startDate, setStartDate] = useState(start ? start : defaultStartDate);
  const [endDate, setEndDate] = useState(end ? end : defaultEndDate);
  const [loading, setLoading] = useState(false)
  const [membershipName, setMembershipName] = useState("");
  const [isPayed, setIsPayed] = useState(false);
  const navigate = useNavigate();


  const fetchMembershipReport = () => {
    getApiCall(
      `membership/membershipReport?startDate=${startDate}&endDate=${endDate}`,
      (resp) => {
        setmemeberShipDetails(resp);
      },
      (error) => { }
    );
  }
  const fetchMembershipSale= () => {
     const data = {
      startDate: startDate,
      endDate: endDate,
    };
    postApiData(
      "membership/membershipSaleList",
      data,
      (resp) => {
        setTodayMembership(resp);
      },
      (error) => { }
    );
  }

  // today' membership buy api
  useEffect(() => {
   
   fetchMembershipSale()
    fetchMembershipReport()
  }, []);

  useEffect(() => {
    getApiCall(
      "membership/getMembership",
      (resp) => {
        setMembershipType(resp.membershipList);
      },
      (error) => { }
    );
  }, []);
  const membershipPress = (e) => {
    const selectedMembership = e.target.value;
    const filteredMemb = membershiptype?.find(
      (item) => item._id === selectedMembership
    );

    setMemberShipData(filteredMemb);
    setMembershipName(filteredMemb?.name);
    setMemberShip(filteredMemb?.price);
  };
  const handleDateChange = (e) => {
    const { id, value } = e.target;
    if (id === "startDate") {
      setStartDate(value)
    } else {
      setEndDate(value)
    }

  }

  const onClickBuyNow = (item) => {
    const { selectedStaff, paymentMethods, phoneNumber } = item;
    const data = {
      paymentMethod: paymentMethods,
      userId: userId,
      employees: selectedStaff,

      membershipId: memberShipdata?._id,
    };
    let res = true;
    if (
      phoneNumber !== "" &&
      selectedStaff.length > 0 &&
      memberShipdata !== null &&
      membershipName !== ""
    ) {
      postApiData(
        "membership/buyMembership",
        data,

        (resp) => {
          if (resp) {
            // alert("MemberShip Purchased SucessFully");
            toast.success("MemberShip Purchased SucessFully");
            setMembershipName("");
            setIsPayed(false);
            res = true;
          }
        },
        (error) => {
          toast.error("Something went wrong, Please try again!!");
          res = false;
        }
      );
      fetchMembershipReport()
       fetchMembershipSale()
    } else {
      toast.error("Please provide the sutaible details!!");
      res = false;
    }

    return res;
    // setMemberShipData(null)
  };

  
  const onPayed = () => {
    setIsPayed(true);
  };

  const handlePrint = (item) => {
    navigate("/membershipinvoicegenerator", { state: item });
  };
  const searchClick = () => {
    const data = {
      startDate: startDate,
      endDate: endDate,
    };
    setLoading(true)
    postApiData(
      "membership/membershipSaleList",
      data,
      (resp) => {
            setLoading(false);

        setTodayMembership(resp);
      },
      (error) => { }
    );
    fetchMembershipReport()
  };

  

  const headings = [
    "NAME",
    "PHONE NO.",
    "EMPLOYEE",
    "MEMBERSHIP NAME",
    "PRICE",
    "CREDITS",
    "VALID FROM",
    "EXPIRY",
    "ACTION",
  ];
  const fields = {
    heading: "BUY MEMBERSHIP",
    actions: [
      {
        heading: "Add new customer",
        button: {
          onClick: () => { },
          icon: <IoMdPersonAdd />,
        },
      },
   
    ],
    banners: [
      {
        name: "Total Members",
        value: memeberShipDetails[0]?.total,
      },
      {
        name: "Total Revenue",
        value: memeberShipDetails[0]?.totalrevenue,
      },
    ],
  };

  const handleExport = () => {
    if (todayMembership)
      exportToExcel(todayMembership, "Membership", "membership.xlsx");
  };

  return (
    <>
      
      <div className="w-full mx-auto">

        <MemComponent
          fields={fields}
          setUserId={setUserId}
          memOptions={membershiptype?.map((elm) => ({
            name: elm.name,
            value: elm._id,
          }))}
          membership={membership}
          memValue={memberShipdata?._id}
          memChange={membershipPress}
          memLabel={"Select MemberShip Type"}
          onPayed={onPayed}
          onClickBuyNow={onClickBuyNow}
        />

        {/* <div className="flex gap-9 my-6 items-start justify-center">
        <CustomInputFeild
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          submitClick={searchClick}
        />
        <button
          onClick={handleExport}
          className="bg-green-600 text-sm mt-auto mb-1 flex items-center justify-center gap-1 font-semibold hover:bg-green-500 text-white rounded-md w-[80px] active:scale-105 transition-all ease-in duration-100"
        >
          <span>Export</span>
          <FaFileExcel />
        </button>{" "}
      </div> */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">

          <div className={`mb-5 ${showDate ? "h-auto" : " h-[42px] overflow-hidden"} transition-all ease-in duration-300 w-full`}>
            <div className="flex items-center justify-between w-full flex-wrap gap-3">
              <div className="flex items-center  gap-3 md:gap-6 flex-wrap">
                <button onClick={() => setShowDate(!showDate)} className="flex border  shadow items-center bg-white gap-2 rounded-[5px] py-[10px] px-[15px]">
                  <FaCalendarAlt className="text-customPurple text-sm" />
                  <span className="text-secondary text-sm">Year-to-date </span>
                  <FaAngleDown className={`text-secondary text-sm ${showDate ? "rotate-180" : ""} `} />

                </button>
                <div className="flex gap-2 font-normal  items-center text-xs text-secondary">
                  <span>{formatDate(startDate, true)}</span>
                  <span>~</span>
                  <span>{formatDate(endDate, true)}</span>
                </div>
              </div>
              {todayMembership?.length > 0 && <button onClick={handleExport} className='bg-ternary text-white rounded-[16px] w-[110px] text-sm font-normal '>Export All</button>}

            </div>

            {showDate && <div className=" flex items-center my-4  gap-3">
              <CustomDatePicker
                startDate={startDate}
                endDate={endDate}
                loading={loading}
                className="bg-white gap-2 rounded-[5px] py-[10px] px-[15px] "
                onSubmit={searchClick}
                onChange={handleDateChange}


              />
            </div>}

          </div>

        </div>
        {/* MEMBERSHIP TABLE */}
        <div className="w-full">
          {todayMembership.length > 0 && (
            <CustomizedTables
              headings={headings}
              data={todayMembership}
              handlePrint={handlePrint}
            />
          )}
        </div>

     
      </div>
    </>
  );
}
