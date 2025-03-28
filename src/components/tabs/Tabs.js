import { useEffect } from "react";
import { useState } from "react";



export default function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);


  const handleTabChange = (tab) => {
    const { id } = tab;
    setActiveTab(id)


  }
  useEffect(() => {
    setActiveTab(tabs[0]?.id)
  }, [tabs])
  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="relative w-fit flex border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`relative flex-1 py-2 min-w-[150px] whitespace-nowrap  transition-colors duration-300 ${activeTab === tab.id ? "text-gray2" : "text-secondary"
              }`}
            onClick={() => handleTabChange(tab)}
          >
            <span style={{}} className=" text-sm 2xl:text-lg">{tab.name}</span>
            {/* Underline Animation */}
            <div
              className={`absolute left-0 right-0 h-[2px] bg-ternary bottom-0 transition-all duration-300 ${activeTab === tab.id ? "scale-100" : "scale-0"
                }`}
            />
          </button>
        ))}
      </div>
      <div className="mt-4  transition-opacity duration-500 opacity-100">
        {/* Content with Fade Animation */}
        {tabs.filter((tab) => tab.id === activeTab)?.map((elm, index) => {

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
