
const CustomDatePicker = ({
    label,
    name,
    value,
    onChange,
}) => {

    const formatDate = (dateStr) => {
        if (!dateStr) return ""
        const date = new Date(dateStr);  // Current date
        const dd = String(date.getDate()).padStart(2, '0');       // Day with leading zero
        const mm = String(date.getMonth() + 1).padStart(2, '0');  // Month with leading zero (getMonth() returns 0-11)
        const yyyy = date.getFullYear();                          // Full year

        const formattedDate = `${yyyy}-${mm}-${dd}`;
        return formattedDate
    }


    return (


        <div className="flex flex-col gap-2">
            <label id={name} className="text-md font-bold">{label}</label>
            <input
                id="startDate"
                value={formatDate(value)}
                onChange={onChange}
                name={name}
                type="date"
                className="bg-gray-50 min-w-sm capitalize border border-gray-400 text-gray-900 placeholder:text-gray-900 text-sm rounded-lg   grow p-2.5 "
                placeholder="Select date start"
            />
        </div>





    )
}

export default CustomDatePicker