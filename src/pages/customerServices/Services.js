import React, { useState } from 'react'
import CustomerServices from './customerServices';
import Tabs from '../../components/tabs/Tabs';

const Services = () => {
  const [activeTab, setActiveTab] = useState(0);
      
      
      const handleTabChange = (id) => {
        setActiveTab(id)
        
        
      }
      const tabs=[
        {
        
          name:'All Services',
          component:<CustomerServices onTabChange={handleTabChange} tab={activeTab}/>
        },
        {
        
          name:'My Services',
          component:<CustomerServices onTabChange={handleTabChange} tab={activeTab}/>
    
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

export default Services