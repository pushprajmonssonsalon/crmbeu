import { useState } from 'react';
import Tabs from '../../components/tabs/Tabs';
import Membership from './index';
import Advances from '../advances/Advances';
import ActiveMembers from '../activeMembers/ActiveMembers';
import ActiveMembership from './ActiveMembership';
import AdvanceTab from '../advances/AdvanceTab';

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
      
        name:'Membership List',
        component:<ActiveMembership />
      },
      {
      
        name:'Active Members',
        component:<ActiveMembers />
  
      },
      {
      
        name:'Advance',
        component:<AdvanceTab  />
  
      },
     
      
    ]
  
  return (
     <div>
             <Tabs tabs={tabs} activeTab={activeTab}  handleTabChange={handleTabChange}/>
    </div>
  )
}

export default Members