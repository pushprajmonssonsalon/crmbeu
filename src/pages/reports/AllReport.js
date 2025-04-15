import { useState } from 'react';
import Tabs from '../../components/tabs/Tabs';
import Report from './Report';
import InvoiceWise from '../../components/invoicewise';
import Categorywise from '../../components/categorywise/Categorywise';
import Revenue from '../../components/revenue';
import WeeklyReport from '../weeklyReport';

const AllReport = () => {
    const [activeTab, setActiveTab] = useState(0);
     
     
    const handleTabChange = (id) => {
      setActiveTab(id)
      
      
    }
    const tabs=[
      {
      
        name:'Report',
        component:<Report />
      },
      {
      
        name:'Invoice Wise Report',
        component:<InvoiceWise />
  
      },
      {
      
        name:'Category Wise Report',
        component:<Categorywise />
  
      },
      {
      
        name:'Revenue',
        component:<Revenue />
  
      },
      {
      
        name:'Weekly Report',
        component:<WeeklyReport />
  
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

export default AllReport