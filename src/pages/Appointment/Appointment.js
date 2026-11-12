import Tabs from '../../components/tabs/Tabs';
import ViewAppointment from '../viewAppointment/ViewAppointment';
// The previous booking screen is kept in ../bookAppointment/BookAppointment.js;
// swap this import back to return to it.
import BookAppointment from '../bookAppointment/NewBookAppointment';
import { useState } from 'react';

const Appointment = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  
  const handleTabChange = (id) => {
    setActiveTab(id)
    
    
  }
  const tabs=[
    {
     
      name:'Booking',
      component:<BookAppointment onTabChange={handleTabChange}/>
    },
    {
     
      name:'View',
      component:<ViewAppointment/>

    }
  ]

 
   
  return (
    <>
      <div>
      <Tabs tabs={tabs} activeTab={activeTab}  handleTabChange={handleTabChange}/>
      </div>
    </>
  )
}

export default Appointment