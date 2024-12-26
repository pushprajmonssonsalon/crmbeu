import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fade from '@mui/material/Fade';

export default function CheckBox({ staffData, selectedStaff, setSelectedStaff, expanded, setExpanded }) {
  // const [expanded, setExpanded] = React.useState(false);
  //   const [selectedStaff, setSelectedStaff] = React.useState({});

  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  const handleCheckboxChange = (event) => {
    const checkedId = event.target.value;
    const staffName = staffData.find((item) => item._id === checkedId)?.name;
    if (event.target.checked) {
      // Check if the employeeId is already in selectedStaff
      if (!selectedStaff.some((staff) => staff.employeeId === checkedId)) {
        setSelectedStaff([...selectedStaff, { employeeId: checkedId, name: staffName }]);
      }
    } else {
      setSelectedStaff(selectedStaff.filter((staff) => staff.employeeId !== checkedId));
    }
  }




  return (
    <div className="bg-gray-50   min-w-sm capitalize border border-gray-400 text-gray-900 text-sm rounded-lg   grow  "
    >
      <Accordion
        className='bg-gray-50'
        expanded={expanded}
        onChange={handleExpansion}
        slots={{ transition: Fade }}
        slotProps={{ transition: { timeout: 400 } }}
        sx={{
          p:0,
          '& .MuiAccordion-region': { height: expanded ? 'h-[39px]' : 0 },
          '& .MuiAccordionDetails-root': { display: expanded ? 'block' : 'none' },
        }}
      >
        <AccordionSummary
        sx={{m:0,  p:0,}}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography sx={{
            fontSize: "0.87rem",
            lineHeight:"1.25rem"
          }}>Select Staff</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className=''>
            {staffData?.map((item) => (
              <label key={item?._id} className="flex justify-start items-center w-auto text-center ">
                <input
                  type="checkbox"
                  value={item._id}
                  className="mr-2"
                  onChange={handleCheckboxChange}
                  checked={selectedStaff.some((staff) => staff.employeeId === item._id)}
                />
                {item?.name}
              </label>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
