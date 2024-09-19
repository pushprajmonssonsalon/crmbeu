import { useState } from 'react';
import Layout from '../../components/Layout';
import MemComponent from '../../components/membership/MemComponent';

const Subscription = () => {
  const [userId, setUserId] = useState("");
  const [buyNowclick, setBuyClickNow] = useState(false);

  const fields = {
    heading: "BUY Subsription",
    actions: [
      {
        heading: "Add new customer",
        button: {
          
          onClick: ()=>{},
          icon: <IoMdPersonAdd />,
         
        },
      },
    
    ],
    banners: [
      {
        name: "Total Suscribers",
        value: 0,
      },
      {
        name: "Total Revenue",
        value: 0,
      },
    ],
  };

  return (
    <>
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
        memLabel={"Select Subsription Type"}
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
      {/* <div className="mb-10 w-[95%] mx-auto ">
        {todayMembership.length > 0 && (
          <CustomizedTables
            headings={headings}
            data={todayMembership}
            handlePrint={handlePrint}
          />
        )}
      </div>
      {alertVisible && (
        <CustomAlert message={alertMessage} onClose={handleAlertClose} />
      )}

    {isNewMembershipModal&&  <NewMembershipModal
        isVisible={isNewMembershipModal}
        onClose={onNewClose}
      />} */}
    </Layout>
    </>
  )
}

export default Subscription