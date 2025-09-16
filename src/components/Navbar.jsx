// import React from 'react'
// import { HiSun } from 'react-icons/hi'
// import { FaUser } from 'react-icons/fa'
// import { RiSettings3Fill } from 'react-icons/ri'

// const Navbar = () => {
//   return (
//     <>
//         <div className="nav flex items-center justify-between px-[100px] h-[90px] border-b-[1px] border-gray-800 ">
//             <div className="logo">
//                 <h3 className='text-[25px] font-[700] sp-text'>
//                     Gen UI
//                 </h3>
//             </div>
//             <div className="icons flex items-center gap-[15px] " id='nav-icons'>
//                 <div className="icon ">
//                     <HiSun />
//                 </div>
//                 <div className="icon">
//                     <FaUser />
//                 </div>
//                 <div className="icon">
//                     <RiSettings3Fill />
//                 </div>
//             </div>
//         </div>
//     </>
//   )
// }

// export default Navbar


import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { RiSettings3Fill } from "react-icons/ri";

const Navbar = () => {
  const [showHelp, setShowHelp] = useState(false);

  // ✅ Redirect to LinkedIn
  const handleLinkedInRedirect = () => {
    window.open("https://www.linkedin.com/in/manav-bhatt1409/", "_blank");
  };

  // ✅ Toggle help modal
  const handleHelpToggle = () => {
    setShowHelp(true);
  };

  return (
    <>
      <div className="nav flex items-center justify-between px-[100px] h-[90px] border-b border-gray-800">
        <div className="logo">
          <h3 className="text-[25px] font-[700] sp-text">Gen UI</h3>
        </div>

        <div className="icons flex items-center gap-[15px]" id="nav-icons">
          {/* LinkedIn Redirect */}
          <div className="icon cursor-pointer" onClick={handleLinkedInRedirect}>
            <FaUser />
          </div>

          {/* Help Modal */}
          <div className="icon cursor-pointer" onClick={handleHelpToggle}>
            <RiSettings3Fill />
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-[#141319] text-white rounded-2xl shadow-lg w-[600px] max-w-[90%] p-6 relative">
            <h2 className="text-[22px] font-bold mb-3">How to Use Gen UI</h2>
            <ol className="list-decimal list-inside space-y-2 text-[15px] leading-relaxed">
              <li>Choose a framework from the dropdown (HTML, React, JavaScript, HTML + Tailwind CSS, etc).</li>
              <li>Describe your component idea in detail in the textarea box.</li>
              <li>Click <b>Generate</b> to let AI create your component.</li>
              <li>Switch between <b>Code</b> and <b>Preview</b> tabs to view the generated result.</li>
              <li>Use <b>Copy</b> button to copy the code to clipboard.</li>
              <li>Use <b>Export</b> button to download the component in the correct file format.</li>
              <li>In Preview mode, you can also <b>Open in New Tab</b> for a bigger view.</li>
            </ol>
            <button
              className="absolute top-3 right-3 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-full px-3 py-1 font-bold hover:opacity-80"
              onClick={() => setShowHelp(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
