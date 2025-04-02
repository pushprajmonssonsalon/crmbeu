import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function Tabs({ tabs, activeTab, handleTabChange }) {

  const [searchParams, setSearchParams] = useSearchParams();

  const onChange = (index) => {
    handleTabChange(index);
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set('tab', index);
    setSearchParams(updatedParams);
  }

  useEffect(()=>{
   const tab =parseInt(searchParams.get("tab"));
   if(!isNaN(tab))handleTabChange(tab)
  },[searchParams])

  return (
    <div className="w-full ">
      {/* Tabs */}
      <div className="w-full border-b border-gray-300">
        <div className="relative w-full flex ">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`relative flex-1 py-2 min-w-[150px] whitespace-nowrap  transition-colors duration-300 ${activeTab === index ? "text-gray2 bg-ternary/10 shadow" : "text-secondary"
                }`}
              onClick={() => onChange(index)}
            >
              <span style={{}} className=" text-sm 2xl:text-lg">{tab.name}</span>
              {/* Underline Animation */}
              <div
                className={`absolute left-0 right-0 h-[2px] bg-ternary bottom-0 transition-all duration-300 ${activeTab === index ? "scale-100" : "scale-0"
                  }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4  transition-opacity duration-500 opacity-100">
        {/* Content with Fade Animation */}
        {tabs.filter((tab, index) => index === activeTab)?.map((elm, index) => {

          return <>
            {
              elm.component
            }
          </>

        })}

      </div>
    </div>
  );
}
