import React, { useState } from 'react'
import Tabs from '../../components/tabs/Tabs';
import CustomerDetails from '../customerDetails';
import Employeedetails from '../employeeDetails/Employeedetails';

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