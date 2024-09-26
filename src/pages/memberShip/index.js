import { useEffect, useState } from "react";
import "./membership.css";
import CustomInputFeild from "../../components/customInput";
import { getApiCall, postApiData } from "../../utils/services";
import Layout from "../../components/Layout";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { IoMdPersonAdd } from "react-icons/io";
import { MdCardMembership } from "react-icons/md";
import NewMembershipModal from "../../components/popup/NewMembershipPopup";
import CustomizedTables from "../../components/MaterialTable";
import MemComponent from "../../components/membership/MemComponent";
export default function Membership() {
  const [isNewMembershipModal, setIsNewMembershipModal] = useState(false);
  const [add, setAdd] = useState(true);
  const [membershiptype, setMembershipType] = useState([]);
  const [membership, setMemberShip] = useState("");

  const [userId, setUserId] = useState("");
  const [memberShipdata, setMemberShipData] = useState([]);
  const [memeberShipDetails, setmemeberShipDetails] = useState([]);
  const [buyNowclick, setBuyClickNow] = useState(false);
  const [todayMembership, setTodayMembership] = useState([]);
  //date
  const defaultStartDate = new Date();
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultStartDate);
  const [membershipName, setMembershipName] = useState("");
  const [isPayed, setIsPayed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getApiCall(
      "membership/membershipReport",
      (resp) => {
        setmemeberShipDetails(resp);
      },
      (error) => {
        console.log("error", error);
      }
    );
  }, [buyNowclick]);
  // today' membership buy api
  useEffect(() => {
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
      (error) => {
        console.log("error", error);
      }
    );
  }, [add]);

  useEffect(() => {
    getApiCall(
      "membership/getMembership",
      (resp) => {
        setMembershipType(resp.membershipList);
      },
      (error) => {
        console.log("error", error);
      }
    );
  }, [ isNewMembershipModal]);
  const membershipPress = (e) => {
    const selectedMembership = e.target.value;
    const filteredStaffData = membershiptype.filter(
      (item) => item.name === selectedMembership
    );

    setMemberShipData(filteredStaffData);
    setMembershipName(filteredStaffData[0]?.name);
    setMemberShip(filteredStaffData[0]?.price);
  };

  const onClickBuyNow = (item) => {
    const { selectedStaff, paymentMethods, phoneNumber } = item;
    const data = {
      paymentMethod: paymentMethods,
      userId: userId,
      employees: selectedStaff,

      membershipId: memberShipdata[0]?._id,
    };
    let res = true;
    if (
      phoneNumber !== "" &&
      selectedStaff.length > 0 &&
      memberShipdata !== null &&
      isPayed === true &&
      membershipName !== ""
    ) {
      postApiData(
        "membership/buyMembership",
        data,

        (resp) => {
          if (resp) {
            // alert("MemberShip Purchased SucessFully");
            toast.success("MemberShip Purchased SucessFully");
            setBuyClickNow(true);
            setMembershipName("");
            setIsPayed(false);
            setAdd(!add);
            res = true;
          }
        },
        (error) => {
          console.log("error", error);
          toast.error("Something went wrong, Please try again!!");
          res = false;
        }
      );
    } else {
      toast.error("Please provide the sutaible details!!");
      res = false;
    }

   
    return res;
    // setMemberShipData(null)
  };

  const onNewClose = () => {
    setIsNewMembershipModal(false);
  };
  const onPayed = () => {
    setIsPayed(true);
  };

  const handlePrint = (item) => {
    console.log("membership li h bsdk", item);
    navigate("/membershipinvoicegenerator", { state: item });
  };
  const searchClick = () => {
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
      (error) => {
        console.log("error", error);
      }
    );
  };

  const openNewMembershipModal = () => {
    setIsNewMembershipModal(true);
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
          onClick: () => {},
          icon: <IoMdPersonAdd />,
        },
      },
      {
        heading: "Add new membership",
        button: {
          onClick: openNewMembershipModal,
          icon: <MdCardMembership />,
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

  return (
    <Layout>
      <MemComponent
        fields={fields}
        setUserId={setUserId}
        memOptions={membershiptype?.map((elm) => ({
          name: elm.name,
          value: elm.value,
        }))}
        membership={membership}
        memValue={membershipName}
        memChange={membershipPress}
        memLabel={"Select MemberShip Type"}
        onPayed={onPayed}
        onClickBuyNow={onClickBuyNow}
      />

      <div className="flex my-6 items-start justify-center">
        <CustomInputFeild
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          submitClick={searchClick}
        />
      </div>

      {/* MEMBERSHIP TABLE */}
      <div className="mb-10 w-[95%] mx-auto ">
        {todayMembership.length > 0 && (
          <CustomizedTables
            headings={headings}
            data={todayMembership}
            handlePrint={handlePrint}
          />
        )}
      </div>

      {isNewMembershipModal && (
        <NewMembershipModal
          isVisible={isNewMembershipModal}
          onClose={onNewClose}
        />
      )}
    </Layout>
  );
}
