import { useState } from 'react';
import Inventorydetails from '../../pages/Inventorydetails/Inventorydetails';
import Tabs from '../tabs/Tabs';

const Inventory = () => {
    const [activeTab, setActiveTab] = useState(0);
     
     
     const handleTabChange = (id) => {
       setActiveTab(id)
       
       
     }
     const tabs=[
       {
       
         name:'All Products',
         component:<Inventorydetails onTabChange={handleTabChange} tab={activeTab}/>
       },
       {
       
         name:'My Products',
         component:<Inventorydetails onTabChange={handleTabChange} tab={activeTab}/>
   
       },
     
       {
        
         name:'All Services',
         component:<Inventorydetails onTabChange={handleTabChange}/>
   
       },
       {
         id:"myServ",
         name:'My Services',
         component:<Inventorydetails onTabChange={handleTabChange}/>
   
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

export default Inventory