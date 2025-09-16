import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Select from 'react-select';
import { BsStars } from 'react-icons/bs';
import { HiOutlineCode } from 'react-icons/hi';
import Editor from '@monaco-editor/react';
import { IoClose, IoCopy } from 'react-icons/io5';
import { PiExportBold } from 'react-icons/pi';
import { ImNewTab } from 'react-icons/im';
import { SyncLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI model
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

const Home = () => {
  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-', label: 'HTML + Bootstrap' },
    { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind + Bootstrap' },
    { value: 'ReactJS', label: 'ReactJS' },
    { value: 'NextJS', label: 'NextJS' },
    { value: 'Vue', label: 'Vue' },
    { value: 'Angular', label: 'Angular' },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);

  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  async function getResponse() {
    setLoading(true);
    try {
      // Get the generative model
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

      // Prepare the prompt
      const promptText = `You are an experienced programmer with expertise in web development and UI/UX design. Create modern, animated, and fully responsive UI components using ${frameWork.value}.

      Task: Generate a UI component for: ${prompt}

      Requirements:
      - Clean, well-structured, and easy to understand code
      - SEO optimized where applicable
      - Modern, animated, and responsive UI design
      - Include hover effects, shadows, animations, colors, and typography
      - Return ONLY the code in a markdown code block
      - Single HTML file output
      `;

      // Generate content
      const result = await model.generateContent(promptText);
      const response = await result.response;
      const text = response.text();
      
      // Process and set the code
      setCode(extractCode(text));
      setOutputScreen(true);
    } catch (error) {
      console.error('Generation Error:', error);
      toast.error(error.message || "Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  }
    const copyCode = async () => {
     try {
      await navigator.clipboard.writeText(code);
      toast.success("Code Copied to Clipboard");
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy code");
    }
  }

  const downloadFile = () => {
    const fileName = "GenUI-Code.html";
    const blob = new Blob([code], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File Downloaded");
  }

  return (
    <>
        <Navbar />


        <div className='flex items-center px-[100px] justify-between gap-[30px] '>
          <div className="left w-[50%] h-[auto] py-[40px] rounded-xl bg-[#141319] mt-5 p-[20px] ">
            <h3 className='text-[25px] font-semibold sp-text '>
              AI Component Generator
            </h3>
            <p className='text-[gray] mt-2 text-[16px] '>
              Desribe Your Component and AI will Generate it for you
            </p>
            <p className='text-[15px] font-[700] mt-4'>FrameWork</p>
            <Select
              className='mt-2'
              options={options}
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  backgroundColor: "#101216",
                  borderColor: state.isFocused ? "#444" : "#222",
                  boxShadow: state.isFocused ? "0 0 0 1px #666" : "none",
                  "&:hover": {
                    borderColor: "#c084fc",
                  },
                  color: "#fff",
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: "#101216",
                  borderRadius: "8px",
                  border: "1px solid #333",
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected
                    ? "#333"
                    : state.isFocused
                    ? "#222"
                    : "#101216",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#222",
                  },
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "#fff",
                }),
                input: (provided) => ({
                  ...provided,
                  color: "#fff",
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: "#aaa",
                }),
              }}
              onChange={(e) => {
                setFrameWork(e.value);
              }}
            />
            <p className='text-[15px] font-[700] mt-5'>Describe your Component</p>
            <textarea onChange={(e) => {setPrompt(e.target.value)}} value={prompt} className='w-full min-h-[200px] rounded-xl bg-[#09090b] mt-3 p-[10px]' placeholder='Describe your component in detail and let AI generate it for you'></textarea>
            <div className="flex items-center justify-between">
              <p className='text-[gray]'>Click on Generate Button to generate your component</p>
              <button onClick={getResponse} className="generate flex items-center p-[10px] rounded-lg border-0 bg-gradient-to-r from-purple-400  to-purple-600 mt-3 text-center gap-[10px] px-[20px] font-[700]" id='button-generate'> Generate 
              {
                loading === false ? 
                <>
                  <i><BsStars /></i>
                </>
                : ""
              }  
                {
                  loading === true ? 
                  <>
                    <>
                      <SyncLoader 
                        size={10}
                      />
                    </>
                  </> : ""
                }
              </button>
            </div>
          </div>
          <div className="right relative w-[50%] h-[80vh] mt-2 bg-[#141319] mt-5 rounded-xl">
            {
              // conditional rendering of monaco editor
              outputScreen === false ? 
              <>             
                <div className="skeleton w-full h-full flex items-center flex-col justify-center" >
                  <div className="circle p-[20px] w-[70px] flex items-center justify-center text-[30px] h-[70px] rounded-[50%] bg-gradient-to-r from-purple-400  to-purple-600">
                    <HiOutlineCode />
                  </div>
                  <p className='text-[20px] mt-5 text-[gray]'>Your Component and Code will appear here</p>
                </div>
              </> : <>
                <div className="top w-full h-[60px]  flex items-center gap-[15px] px-[20px]">
                  <button onClick={() => {setTab(1)}} className={`btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all ${tab == 1 ? "bg-gradient-to-r from-purple-400  to-purple-600 " : ""}`}>Code</button>
                  <button onClick={() => {setTab(2)}} className={`btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all ${tab == 2 ? "bg-gradient-to-r from-purple-400  to-purple-600 " : ""}`}>Preview</button>
                </div>
                  {/* <div className="left">
                    <p className='font-bold'>Code Editor</p>
                    </div> */}
                  <div className="right flex items-center gap-[10px]">
                    {
                      tab === 1 ? 
                      <>
                      <div className="top-2 w-full h-[60px] flex items-center justify-between gap-[15px] px-[30px]">
                        <div className="left">
                          <p className='font-bold'>Code Editor</p>
                        </div>
                      </div>
                        <button id='copy' className="copy w-[110px] h-[40px] gap-[5px] rounded-xl border-[1px] border-zinc-700 flex items-center justify-center" onClick={copyCode}>Copy <i><IoCopy /></i></button>
                        <button id='preview' className="export w-[120px] h-[40px] gap-[5px] rounded-xl border-[1px] border-zinc-700 flex items-center justify-center" onClick={downloadFile}>Export <i><PiExportBold /></i></button>
                      </> : <>
                      <div className="top-2 w-full h-[60px] flex items-center justify-between gap-[15px] px-[20px]">
                        <div className="left">
                          <p className='font-bold'>Preview</p>
                        </div>
                      </div>
                        <button id='copy' className="copy w-[250px] h-[40px] gap-[5px] rounded-xl border-[1px] border-zinc-700 flex items-center justify-center" onClick={() => {setIsNewTabOpen(true)}}>Open in New Tab <i><ImNewTab /></i></button>
                        {/* <button id='preview' className="export w-[165px] h-[40px] gap-[5px] rounded-xl border-[1px] border-zinc-700 flex items-center justify-center">Refresh <i><IoMdRefresh /></i></button> */}
                      </>
                    }
                  </div>
                <div className="editor h-full ">
                  {
                    tab === 1 ? 
                    <>
                      <Editor value={code} height="100%" theme='vs-dark' language="html"  />
                    </> : <>
                      <iframe srcDoc={code} className='preview w-full h-full bg-white text-black flex items-center justify-center'>
                        
                      </iframe>
                    </>
                  }
                </div>
              </>
            }
          </div>
        </div>

        {
          isNewTabOpen === true ? 
          <>
            <div className=" absolute left-0 top-0 right-0 bottom-0 bg-[#09090f] w-screen min-h-screen oberflow-auto ">
              <div className="top w-full h-[60px] flex items-center justify-center px-[20px] gap-[1200px]">
                <div className="left">
                  <p className='font-bold sp-text'>Preview</p>
                </div>
                <div className="right flex items-center gap-[10px]" >
                  <button id='openInNewTab' className="copy w-[40px] h-[40px] gap-[5px] rounded-xl border-[1px] border-zinc-700 flex items-center justify-center transition-all hover:" onClick={() => {setIsNewTabOpen(false)}}><IoClose /></button>
                </div>
              </div>
              <iframe srcDoc={code} className="w-full h-full  ">

              </iframe>
            </div>
            {/* <div className="close absolute top-[100px] right-[100px] w-[50px] h-[50px] flex items-center justify-center rounded-[50%] bg-gradient-to-r from-purple-400  to-purple-600 cursor-pointer">
              <IoClose />
            </div> */}
            
          </> : ""
        }
    </>
  )
}

export default Home;