import { useState } from 'react';
import Tabs from '../../components/tabs/Tabs';
import CustomerDetails from '../customerDetails';
import Employeedetails from '../employeeDetails/Employeedetails';
import CustomersDetails from '../customerDetails/CustomersDetails';

const Contacts = () => {
     const [activeTab, setActiveTab] = useState(0);
         
         
         const handleTabChange = (id) => {
           setActiveTab(id)
           
           
         }
         const tabs=[
           {
           
             name:'Customer Details',
             component:<CustomerDetails />
           },
           {
           
             name:'Staff Contacts',
             component:<Employeedetails />
       
           },
           {
           
             name:'Customers Details',
             component:<CustomersDetails />
       
           },
         
         
           
         ]
       
       
         return (
           <>
             <div>
             <Tabs tabs={tabs} activeTab={activeTab}  handleTabChange={handleTabChange}/>
             </div>
           </>
         )
}

export default Contacts