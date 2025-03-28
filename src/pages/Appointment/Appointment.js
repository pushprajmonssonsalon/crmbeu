import Tabs from '../../components/tabs/Tabs'
import ViewAppointment from '../viewAppointment/ViewAppointment'
import BookAppointment from '../bookAppointment/BookAppointment'

const Appointment = () => {
  const tabs=[
    {
      id:"book",
      name:'Booking',
      component:<BookAppointment/>
    },
    {
      id:"view",
      name:'View',
      component:<ViewAppointment/>

    }
  ]
  return (
    <>
      <div>
      <Tabs tabs={tabs}/>
      </div>
    </>
  )
}

export default Appointment