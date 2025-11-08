import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const CustomTab = ({ allTabs = [] }) => {
    const tabsRef = useRef([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTabIndex, setActiveTabIndex] = useState(0);

     const onChange = (index) => {
        // handleTabChange(index);
        const updatedParams = new URLSearchParams(searchParams);
        updatedParams.set('childtab', index);
        setSearchParams(updatedParams);
      }
    
      useEffect(()=>{
       const tab =parseInt(searchParams.get("childtab"));
       if(!isNaN(+tab))setActiveTabIndex(+tab)
      },[searchParams])
      
      
    return (
        <>
            <div>
                <div className="flew shadow-md w-fit gap-5 relative mx-auto flex h-12 mb-5 rounded-3xl bg-white px-2">
                    {/* <span
        className="absolute bottom-0 top-0 -z-10 flex overflow-hidden rounded-3xl py-2 transition-all duration-300"
        style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
      >
        <span className="h-full w-full rounded-3xl bg-gray-200/30" />
      </span> */}
                    {allTabs.map((tab, index) => {
                        const isActive = activeTabIndex === index;

                        return (
                            <button
                                key={index}
                                ref={(el) => (tabsRef.current[index] = el)}
                                className={`md:min-w-[150px] font-medium ${isActive ? `bg-ternary text-white` : `hover:text-ternary/90`
                                    } my-auto cursor-pointer select-none rounded-full px-4 text-center font-light text-ternary`}
                                onClick={() => onChange(index)}
                            >
                                {tab.name}
                            </button>
                        );
                    })}

                </div>
                <div className="mt-4  transition-opacity duration-500 opacity-100">
                    {/* Content with Fade Animation */}
                    {allTabs
                        .filter((tab, index) => index === activeTabIndex)
                        .map((elm) => (
                            <React.Fragment key={elm.id}>
                                {React.cloneElement(elm.component, { key: elm.id })}
                            </React.Fragment>
                        ))}


                </div>
            </div>
        </>
    )
}

export default CustomTab