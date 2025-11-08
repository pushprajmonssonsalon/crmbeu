import CustomTab from '../../components/tabs/CustomTab';
import AdvanceHistory from './AdvanceHistory';
import AdvanceLogs from './AdvanceLogs';
import Advances from './Advances';

const AdvanceTab = () => {
    let allTabs = [
        {
            id: "advancePayment",
            name: "Advance Payment",
            component:<Advances/>
        },
        {
            id: "advanceLogs",
            name: "Advance History",
            component:<AdvanceHistory/>
        },
        {
            id: "advanceSummary",
            name: "Advance Summary",
            component:<AdvanceLogs/>

        },

    ];
    return (
        <>
            <div className=" rounded-[16px] border border-primaryGray p-5  ">

             
                <div>
                    <CustomTab allTabs={allTabs} />
                </div>
            </div>

        </>
    )
}

export default AdvanceTab