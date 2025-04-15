const CustomDateMonth = ({ name, label, placeholder, value1,value2, onChange }) => {
    const monthoptions = [
        {
            name: "January",
            value: "01"
        },
        {
            name: "February",
            value: "02"
        },
        {
            name: "March",
            value: "03"
        },
        {
            name: "April",
            value: "04"
        },
        {
            name: "May",
            value: "05"
        },
        {
            name: "June",
            value: "06"
        },
        {
            name: "July",
            value: "07"
        },
        {
            name: "August",
            value: "08"
        },
        {
            name: "September",
            value: "09"
        },
        {
            name: "October",
            value: "10"
        },
        {
            name: "November",
            value: "11"
        },
        {
            name: "December",
            value: "12"
        },

    ]


    return (
        <div className="flex flex-col gap-1">
            <label id={name} className="text-[14px] text-black">{label}</label>
            <div className="flex gap-2">
                <select
                    name={`${name}-date`}
                    value={value1}
                    onChange={onChange}
                    className="bg-gray-50 w-1/2   border border-primaryGray text-black text-sm rounded-[10px]    py-[10px] px-[15px] "

                >
                    <option value="">Date</option>
                    {
                        Array.from({ length: 31 }, (_, index) => index + 1).map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                        ))
                    }

                </select>
                <select
                    name={`${name}-month`}
                    value={value2}
                    onChange={onChange}
                    className="bg-gray-50 w-1/2  capitalize border border-primaryGray text-black text-sm rounded-[10px]    py-[12px] px-[15px] "

                >
                    <option value="">Month</option>
                    {
                        monthoptions.map((item, index) => (
                            <option key={index} value={item.value}>{item.name}</option>
                        ))
                    }

                </select>
            </div>
            
        </div>
    )
}

export default CustomDateMonth