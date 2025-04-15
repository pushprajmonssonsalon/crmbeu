import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./index.css"
const localizer = momentLocalizer(moment)

const Appointments = ({ appointments }) => {
    const events = appointments.map((appointment) => {
        const dateString = appointment?.appointmentDate;
        const [datePart, timePart] = dateString.split("T");
        const [year, month, day] = datePart.split("-");

         
        const dateStr = `${year}-${month}-${day}T${timePart.slice(0,timePart.indexOf("."))}`;
        // Create a date object using the adjusted date string
        const start = moment.tz(dateStr, "Asia/Kolkata").toDate();

        const end = new Date(start.getTime() + 60 * 60 * 1000);
        // 1-hour duration
       
        return {
            id: appointment.id,
            title: `${appointment?.customer?.name}`, // Show employee name as title
            start: start,
            end: end,
        };
    });

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Appointments Calendar</h1>
            <Calendar
                localizer={localizer}
                events={events} // Pass events to Calendar
                startAccessor="start"
                endAccessor="end"
                min={new Date(0, 0, 10, 8, 0)} // Start time: 8:00 AM
                style={{ height: 900, padding: "20px", background: "white" }}
            />
        </div>
    );
}

export default Appointments