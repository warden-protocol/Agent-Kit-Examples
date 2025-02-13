import React, { useState } from "react";
import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Outlet,
} from "react-router-dom";
import Sidebar from "./Sidebar";
import WalletConnect from "./WalletConnect";

export default function Layout() {

  return (
    <div className='fixed w-screen  h-screen py-[63px] h-full flex-col justify-start items-start gap-[33px] inline-flex'>
      





             <div className="self-stretch px-[60px]   justify-start items-center gap-[300px] inline-flex">
                <div className="justify-start items-center gap-[65px] flex">
                  <div className="w-[209px] flex-col justify-start items-start gap-[2.5px] inline-flex">
                    <div className="self-stretch h-[46px] bg-[url(src/assets/logo.png)] bg-cover bg-no-repeat bg-center  rounded-[10px]" />
                  </div>
                  <div className="justify-start items-center gap-[34px] flex">
                    <div className="w-[259.58px] h-[46.11px] px-[16px] bg-[#d9d9d9]/10 rounded-[35.54px] flex-col justify-center items-start gap-[2.5px] inline-flex">
                      <div className="justify-start items-center gap-[8.41px] inline-flex">
                        <div className="p-[3px] justify-start items-center gap-[2.5px] flex overflow-hidden">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M10.2884 10.3078L12.5073 12.5267M11.8063 6.40314C11.8063 7.83614 11.237 9.21046 10.2237 10.2237C9.21046 11.237 7.83615 11.8063 6.40314 11.8063C4.97014 11.8063 3.59583 11.237 2.58254 10.2237C1.56926 9.21046 1 7.83614 1 6.40314C1 4.97014 1.56926 3.59583 2.58254 2.58254C3.59583 1.56926 4.97014 1 6.40314 1C7.83615 1 9.21046 1.56926 10.2237 2.58254C11.237 3.59583 11.8063 4.97014 11.8063 6.40314Z"
                              stroke="white"
                              stroke-opacity="0.5"
                              stroke-width="1.08063"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="text-[#ffffff]/50 text-[12.45px] font-[400] font-['Inter']">
                          Search store
                        </div>
                      </div>
                    </div>
        
                    <div className=" justify-start items-start gap-[32.66px] flex">
                      <NavLink
                        to="/"
                        className={({ isActive }) =>
                          `text-[16.33px] font-[400] font-['Inter'] no-underline ${
                            isActive ? "text-[#ffffff]" : "text-[#ffffff]/60"
                          }`
                        }
                      >
                        Discover
                      </NavLink>
                      <NavLink
                        to="/Agent"
                        className={({ isActive }) =>
                          `text-[16.33px] font-[400] font-['Inter'] no-underline ${
                            isActive ? "text-[#ffffff]" : "text-[#ffffff]/60"
                          }`
                        }
                        activeClassName="text-[#ffffff]"
                      >
                        Agent
                      </NavLink>
                      <NavLink
                        to="/Profile"
                        className={({ isActive }) =>
                          `text-[16.33px] font-[400] font-['Inter'] no-underline ${
                            isActive ? "text-[#ffffff]" : "text-[#ffffff]/60"
                          }`
                        }
                        activeClassName="text-[#ffffff]"
                      >
                        Profile
                      </NavLink>
                    </div>
                  </div>
                </div>
                <div className="grow shrink basis-0   flex-col justify-center items-end gap-[2.5px] inline-flex">
                  <WalletConnect/>
                </div>
              </div>




      
         
      <div className="self-stretch h-full px-[60px]  justify-start items-start gap-[12px] inline-flex">
      <Sidebar/>
      <div className="self-stretch w-full overflow-y-auto custom-scrollbar  pb-[180px] justify-start items-start gap-12 inline-flex">
        <Outlet className=""/>
      </div>
     
      
     
      </div>
         
    </div>
   

  );
}
