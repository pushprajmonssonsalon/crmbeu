import DatePicker from "react-datepicker";
import { useNavigate } from "react-router";

export default function CustomSearchInputFeild({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  submitClick,
}) {
  const navigate = useNavigate();
  const handleClick = () => {
     console.log(startDate, endDate,"date");
     const temp =new Date(startDate).toLocaleDateString();
     console.log(temp,"temp",new Date(temp));
    navigate(`?start=${startDate}&end=${endDate}`);
    submitClick()
  };
  return (
    <div
    className="flex items-center flex-wrap justify-center"
     
    >
      
      <div
   

        style={{

          flexDirection: "column",
          display: "flex",
        }}
      >
        <label>Start Date</label>

        <DatePicker
          selectsStart
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          startDate={startDate}
        />
      </div>

      <div
        style={{
          marginLeft: "10px",
          flexDirection: "column",
          display: "flex",
        }}
      >
        <label>End Date</label>
        <DatePicker
          selectsEnd
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          endDate={endDate}
          startDate={startDate}
          minDate={startDate}
        />
      </div>

      <button
        className="px-3 py-2 grow md:grow-0 rounded-lg bg-black text-white font-bold mt-6 ml-4"
        onClick={handleClick}
      >
        Search
      </button>
    </div>
    // <div style={{}}>

    //     <input value={value} placeholder='Search By Name or Number' type='date' className='outline-none px-4 w-[250px]'
    //     onChange={onchange}
    //     />
    // </div>
  );
}
