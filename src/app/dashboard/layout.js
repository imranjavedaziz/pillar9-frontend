"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import TopIcons from "@/components/topRightIcons/TopIcons";
import "material-icons/iconfont/material-icons.css";

const Layout = (props) => {
  return (
    <>
      <div className=" bg-no-repeat text-white bg-cover min-h-screen">
        <div className="flex h-full min-h-screen">
          {/*========== this is sidebar =============*/}

          <Sidebar />
          {/*-------- dashboard right ---------- */}
          <div
            className="h-screen w-full overflow-auto bg-white"
            // style={{borderLeft: '2px solid #e6d366',}}
          >
            <TopIcons />
            <main className="w-full min-h-screen bg-white">
              {props.children}{" "}
            </main>
          </div>
        </div>
      </div>
    </>
    // <div className='flex mx-auto w-full'>
    //   <div>
    //     <Sidebar />
    //   </div>
    //   <main className='w-full'>
    //     {props.children}
    //   </main>
    // </div>
  );
};

export default Layout;
