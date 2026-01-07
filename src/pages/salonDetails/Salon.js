import { useState } from 'react';
import Tabs from '../../components/tabs/Tabs';
import SalonDeatils from "./index.js"
import Expense from '../../components/Expense/Expense.js';
const Salon = () => {
      const [activeTab, setActiveTab] = useState(0);
     
     
    const handleTabChange = (id) => {
      setActiveTab(id)
      
      
    }
    const tabs=[
      {
      
        name:'Salon Details',
        component:<SalonDeatils />
      },
      {
      
        name:'Expense',
        component:<Expense/>
  
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

export default Salon