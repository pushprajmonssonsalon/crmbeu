export default function Tabs({ tabs,activeTab,handleTabChange }) {
  
  return (
    <div className="w-full ">
      {/* Tabs */}
      <div className="w-full border-b border-gray-300">
      <div className="relative w-fit flex ">
        {tabs.map((tab,index) => (
          <button
            key={index}
            className={`relative flex-1 py-2 min-w-[150px] whitespace-nowrap  transition-colors duration-300 ${activeTab === index ? "text-gray2" : "text-secondary"
              }`}
            onClick={() => handleTabChange(index)}
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
        {tabs.filter((tab,index) => index=== activeTab)?.map((elm, index) => {

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
