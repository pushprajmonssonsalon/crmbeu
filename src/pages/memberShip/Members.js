import { useState } from 'react';
import Tabs from '../../components/tabs/Tabs';
import Membership from './index';
import Advances from '../advances/Advances';
import ActiveMembers from '../activeMembers/ActiveMembers';

const Members = () => {
    const [activeTab, setActiveTab] = useState(0);
     
     
    const handleTabChange = (id) => {
      setActiveTab(id)
      
      
    }
    const tabs=[
      {
      
        name:'Buy Membership',
        component:<Membership  tab={activeTab}/>
      },
      {
      
        name:'Active Members',
        component:<ActiveMembers />
  
      },
      {
      
        name:'Advance Payment',
        component:<Advances  />
  
      },
     
      
    ]
  
  return (
     <div>
             <Tabs tabs={tabs} activeTab={activeTab}  handleTabChange={handleTabChange}/>
    </div>
  )
}

export default Members