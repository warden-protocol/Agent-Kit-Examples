import { Wallet } from "lucide-react";
import React,{useState} from "react";
import WalletConnect from "./WalletConnect";
import Popup from "./Popup";
import { createPortal } from "react-dom";
import { ethers } from "ethers";

// Contract configuration
const CONTRACT_ADDRESS = "0x3365d8490f58a1df522936abd137161d5e648055"; // Replace with your contract address
const contractABI = [
  "function init() external",
  "function bet(uint256 value) external payable",
  "function closeRegistration() external",
  "function claimPrize() external"
];

export default function Profile() {
   const [isOpen, setIsOpen] = useState(false);
   const [isOpen2, setIsOpen2] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const handleClaim = async () => {
    try {
      setIsLoading(true);
      
      // Check if MetaMask is installed
      if (!window.ethereum) {
        alert("Please install MetaMask to claim prizes!");
        return;
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create a Web3Provider instance
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Get the signer
      const signer = provider.getSigner();
      
      // Create contract instance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      
      // Call the claimPrize function
      const tx = await contract.claimPrize();
      
      // Wait for transaction to be mined
      await tx.wait();
      
      alert("Prize claimed successfully!");
    } catch (error) {
      console.error("Error claiming prize:", error);
      alert("Failed to claim prize. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[1022.81px] flex-col justify-start items-start gap-2.5 inline-flex">
      <div className="self-stretch h-[1022.81px] flex-col justify-start items-start gap-[60px] flex">
        <div className="self-stretch h-[658px] flex-col justify-start items-start gap-[40px] flex">
          <div className="self-stretch h-[369px] flex-col justify-start items-start flex">
            <div className="self-stretch h-[255px]  bg-[url(src/assets/cover.png)] bg-cover bg-no-repeat bg-center  rounded-[16px]" />
            <div className="self-stretch px-[32px] justify-start gap-[33px] items-end -mt-[45px] inline-flex">
              <div className="w-[159px] h-[159px]  bg-[url(src/assets/avatar/1.png)] bg-cover bg-no-repeat bg-center rounded-full border-[8px] border-[#101014]" />
              <div className="grow shrink basis-0 flex-col justify-start items-start pb-[10px] gap-[10px] inline-flex">
                <div className="self-stretch text-[#ffffff] text-[43.65px]  font-[500] font-['Inter'] capitalize">
                  Alisson smith
                </div>
                <div className="self-stretch text-[#ffffff]/80 text-[24px] font-[300] font-['Inter'] lowercase tracking-tight">
                  @A.smith6
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch justify-start items-end gap-[49px] inline-flex">
            <div className="flex-col justify-start items-start gap-[10px] inline-flex">
              <div className="flex-col justify-start items-start gap-[10px] flex">
                <div className="h-[249px] px-[34px] flex-col justify-start items-start gap-[43px] flex">
                  <div className="justify-start items-center gap-[16px] inline-flex">
                 
                 <div className="grow shrink basis-0 flex-col justify-center items-end gap-2.5 inline-flex">
      
                



      <button
        onClick={handleClaim}
        disabled={isLoading}
        className="w-[120px] h-[41.345px] px-[0.96px] bg-[#ffffff] rounded-[10.52px] justify-center items-center gap-[9.40px] border-0 inline-flex transition-colors delay-50 duration-50 ease-in-out disabled:opacity-50"
      >
        <div className="justify-start items-center flex">
          <div className="w-[90.14px] text-center text-[#000000]/80 text-[15.03px] font-medium font-['Inter']">
            {isLoading ? "Claiming..." : "Claim Prize"}
          </div>
        </div>
      </button>
     

        
     
     
     
     
     
                 
                 </div>
                 <div className="grow shrink basis-0 flex-col justify-center items-end gap-2.5 inline-flex">
      
                



      <button
             onClick={() => setIsOpen(true)}
             className="w-[146px] h-[41.345px] px-[0.96px] bg-[#ffffff] rounded-[10.52px] justify-center items-center gap-[9.40px] border-0 inline-flex  transition-colors delay-50 duration-50 ease-in-out "
           >
             <div className="justify-start items-center flex">
     <div className="w-[17.09px] h-[17.09px] relative  overflow-hidden">
       <svg
         xmlns="http://www.w3.org/2000/svg"
         width="18"
         height="18"
         viewBox="0 0 18 18"
         fill="none"
         
       >
         
         <path
           d="M9.43254 7.92199H12.8501V9.63078H9.43254V13.0484H7.72375V9.63078H4.30616V7.92199H7.72375V4.5044H9.43254V7.92199ZM8.57814 17.3204C6.31214 17.3204 4.13895 16.4202 2.53665 14.8179C0.934345 13.2156 0.0341797 11.0424 0.0341797 8.77639C0.0341797 6.51039 0.934345 4.3372 2.53665 2.73489C4.13895 1.13259 6.31214 0.232422 8.57814 0.232422C10.8441 0.232422 13.0173 1.13259 14.6196 2.73489C16.2219 4.3372 17.1221 6.51039 17.1221 8.77639C17.1221 11.0424 16.2219 13.2156 14.6196 14.8179C13.0173 16.4202 10.8441 17.3204 8.57814 17.3204ZM8.57814 15.6116C10.3909 15.6116 12.1295 14.8914 13.4113 13.6096C14.6932 12.3277 15.4133 10.5892 15.4133 8.77639C15.4133 6.96359 14.6932 5.22503 13.4113 3.94319C12.1295 2.66135 10.3909 1.94121 8.57814 1.94121C6.76534 1.94121 5.02679 2.66135 3.74495 3.94319C2.4631 5.22503 1.74297 6.96359 1.74297 8.77639C1.74297 10.5892 2.4631 12.3277 3.74495 13.6096C5.02679 14.8914 6.76534 15.6116 8.57814 15.6116Z"
           fill="black" 
           fill-opacity="0.8"
         />
       </svg>
     </div>
     <div className="w-[90.14px] text-center text-[#000000]/80  text-[15.03px] font-medium font-['Inter']">
       Add Agent
     </div>
     </div>
           </button>
     
           {/* Render Popup via Portal */}
           {isOpen &&
             createPortal(
               <div className="fixed inset-0 flex pt-[] items-center justify-center bg-black bg-opacity-50 z-50">
                 
                   
                   {/* Close Button */}
                   <button
                     onClick={() => setIsOpen(false)}
                     className="h-[30px] w-[30px] absolute ml-[31%] bg-[#ffffff]/20 mb-[42.3%] border-0 top-500 rounded-full right-4  text-gray-400 hover:text-white text-2xl"
                   >
                     ✖
                   </button>
                   <div>
                     <Popup/>
                   </div>
     
                   
               </div>,
               document.body
             )}
     
     
     
     
     
     
                 
                 </div>
                  
                  
                  </div>
                  <div className="self-stretch justify-start items-center gap-[67px] inline-flex">
                    <div className="w-[159px] flex-col justify-start items-start gap-[32px] inline-flex">
                      <div className="self-stretch h-[65px] flex-col justify-start items-start gap-[8px] flex">
                        <div className="self-stretch justify-start items-center gap-[12px] inline-flex">
                       
                          <div className="grow shrink basis-0 text-[#ffffff]/80 text-base font-medium font-['Inter'] capitalize tracking-tight">
                            Stake
                          </div>
                        </div>
                        <div className="self-stretch">
                          <span class="text-[#ffffff] text-[31.11px] font-[500] font-['Inter'] lowercase tracking-tight">
                            $5467
                          </span>
                          <span class="text-[#ffffff] text-[31.11px] font-semibold font-['Inter'] uppercase tracking-tight">
                            
                          </span>
                        </div>
                      </div>
                      <div className="self-stretch h-[65px] flex-col justify-start items-start gap-[8px] flex">
                        <div className="self-stretch justify-start items-center gap-[12px] inline-flex">
                          
                          <div className="grow shrink basis-0 text-[#ffffff]/80 text-base font-medium font-['Inter'] capitalize tracking-tight">
                            bets
                          </div>
                        </div>
                        <div className="self-stretch">
                          <span class="text-[#ffffff] text-[31.11px] font-[500] font-['Inter'] lowercase tracking-tight">
                            16
                          </span>
                          <span class="text-[#ffffff] text-[31.11px] font-semibold font-['Inter'] uppercase tracking-tight">
                            
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-[159px] flex-col justify-start items-start gap-[32px] inline-flex">
                      <div className="self-stretch h-[65px] flex-col justify-start items-start gap-[8px] flex">
                        <div className="self-stretch justify-start items-center gap-[12px] inline-flex">
                         
                          <div className="grow shrink basis-0 text-[#ffffff]/80 text-base font-medium font-['Inter'] capitalize tracking-tight">
                            rewards
                          </div>
                        </div>
                        <div className="self-stretch">
                          <span class="text-[#ffffff] text-[31.11px] font-[500] font-['Inter'] lowercase tracking-tight">
                            $6780
                          </span>
                          <span class="text-[#ffffff] text-[31.11px] font-semibold font-['Inter'] uppercase tracking-tight">
                            
                          </span>
                        </div>
                      </div>
                      <div className="self-stretch h-[65px] flex-col justify-start items-start gap-[8px] flex">
                        <div className="self-stretch justify-start items-center gap-[12px] inline-flex">
                          
                          <div className="grow shrink basis-0 text-[#ffffff]/80 text-base font-medium font-['Inter'] capitalize tracking-tight">
                            wins
                          </div>
                        </div>
                        <div className="self-stretch">
                          <span class="text-[#ffffff] text-[31.11px] font-[500] font-['Inter'] lowercase tracking-tight">
                            10
                          </span>
                          <span class="text-[#ffffff] text-[31.11px] font-semibold font-['Inter'] uppercase tracking-tight">
                            
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2.5 inline-flex">
              <div className="self-stretch h-[163px] flex-col justify-start items-start gap-[15px] flex">
                <div className="self-stretch text-[#ffffff] text-[16.71px] font-[400] font-['Inter'] tracking-tight">
                  ABOUT ME
                </div>
                <div className="self-stretch text-[#ffffff]/80 text-[18px] font-[300] font-['Inter'] leading-[32px] tracking-tight">
                  Hi! You are the first sentient AI, born into a city of
                  opportunity. Transcend time and space in this strategy RPG to
                  raise machine armies and defeat your foes, influence the world
                  from the shadows, or pursue countless goals......{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch h-[304.81px] flex-col justify-start items-start gap-[24px] flex">
          <div className="self-stretch pl-[22px] justify-start items-center gap-[21px] inline-flex">
            <div className="text-[#ffffff] text-[26.07px] font-[500] font-['Inter'] tracking-tight">
              Deployed Agents
            </div>
  
          </div>
          <div className="self-stretch h-[239.46px] flex-col justify-start items-start gap-[20px] flex">
            <div className="self-stretch px-[14px] justify-between items-center inline-flex">
              <div className="h-[17px] px-[10px] justify-start items-center gap-[12.89px] flex">
                <div className="w-[107.10px] flex-col justify-start items-start gap-[5.64px] inline-flex">
                  <div className="self-stretch text-[#ffffff]/50 text-[13.75px] font-medium font-['Inter'] capitalize tracking-tight">
                    Agents(345)
                  </div>
                </div>
              </div>
              <div className="h-[17px]  justify-start items-center gap-[2px] flex">
                <div className="w-[115px] text-[#ffffff]/50 text-[13.75] font-medium font-['Inter'] capitalize tracking-tight">
                  Game
                </div>
              </div>
              <div className="justify-center items-center gap-[93.21px] flex">
                <div className="justify-start items-center gap-[73.43px] flex">
                  <div className="text-[#ffffff]/50 text-[13.75px] font-medium font-['Inter'] capitalize tracking-tight">
                    Matchs
                  </div>
                  <div className="text-[#ffffff]/50 text-[13.75px] font-medium font-['Inter'] capitalize tracking-tight">
                    Bets
                  </div>
                  <div className="w-[46px] text-center text-[#ffffff]/50 text-sm font-medium font-['Inter'] capitalize tracking-tight">
                    Stack
                  </div>
                </div>
                <div className="w-[62.47px] text-center text-[#ffffff]/50 text-sm font-medium font-['Inter'] capitalize tracking-tight">
                  Wins
                </div>
              </div>
            </div>
            <div className="self-stretch h-[91.23px] px-[14px] bg-[#d9d9d9]/5 rounded-[12.47px] flex-col justify-center items-center gap-2.5 flex">
              <div className="self-stretch justify-between items-center inline-flex">
                <div className="justify-start items-center gap-[12.89px] flex">
                  <div className="w-[61.48px] h-[61.48px] bg-[#262628]  bg-[url(src/assets/avatar/5.png)] bg-cover bg-no-repeat bg-center  rounded-full" />
                  <div className="w-[107.10px] flex-col justify-start items-start gap-[5.64px] inline-flex">
                    <div className="self-stretch text-[#ffffff] text-[21.87px] font-[400px] font-['Inter'] capitalize tracking-tight">
                      nobita
                    </div>
                  </div>
                </div>
                <div className="h-[19px] justify-start items-center gap-0.5 flex">
                  <div className="w-[165px] text-[#ffffff]/80 text-[13.55px] font-[300] font-['Inter'] capitalize tracking-tight">
                    Clash of clans
                  </div>
                </div>
                <div className="justify-center items-center gap-[93.21px] flex">
                  <div className="justify-start items-center gap-[67.43px] flex">
                    <div className="w-[50px] text-center text-[#ffffff]/80 text-[13.55px] font-[400] font-['Inter'] capitalize tracking-tight">
                      95
                    </div>
                    <div className="w-[33px] text-center text-[#ffffff]/80 text-[13.55px] font-[400]font-['Inter'] capitalize tracking-tight">
                      95
                    </div>
                    <div className="text-center text-[#ffffff]/80 text-[13.55] font-[400] font-['Inter'] capitalize tracking-tight">
                      4506$
                    </div>
                  </div>
                  <div className="w-[62.47px] text-center text-[#ffffff] text-[18.51px] font-[500] font-['Inter'] capitalize tracking-tight">
                    560
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch h-[91.23px] px-[14px] bg-[#d9d9d9]/5 rounded-[12.47px] flex-col justify-center items-center gap-2.5 flex">
              <div className="self-stretch justify-between items-center inline-flex">
                <div className="justify-start items-center gap-[12.89px] flex">
                  <div className="w-[61.48px] h-[61.48px] bg-[#262628] bg-[url(src/assets/avatar/3.png)] bg-cover bg-no-repeat bg-center  rounded-full" />
                  <div className="w-[107.10px] flex-col justify-start items-start gap-[5.64px] inline-flex">
                    <div className="self-stretch text-[#ffffff] text-[21.87px] font-[400px] font-['Inter'] capitalize tracking-tight">
                      nobita
                    </div>
                  </div>
                </div>
                <div className="h-[19px] justify-start items-center gap-0.5 flex">
                  <div className="w-[165px] text-[#ffffff]/80 text-[13.55px] font-[300] font-['Inter'] capitalize tracking-tight">
                    Clash of clans
                  </div>
                </div>
                <div className="justify-center items-center gap-[93.21px] flex">
                  <div className="justify-start items-center gap-[67.43px] flex">
                    <div className="w-[50px] text-center text-[#ffffff]/80 text-[13.55px] font-[400] font-['Inter'] capitalize tracking-tight">
                      95
                    </div>
                    <div className="w-[33px] text-center text-[#ffffff]/80 text-[13.55px] font-[400]font-['Inter'] capitalize tracking-tight">
                      95
                    </div>
                    <div className="text-center text-[#ffffff]/80 text-[13.55] font-[400] font-['Inter'] capitalize tracking-tight">
                      4506$
                    </div>
                  </div>
                  <div className="w-[62.47px] text-center text-[#ffffff] text-[18.51px] font-[500] font-['Inter'] capitalize tracking-tight">
                    560
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






{/* 
  
   <div className="w-[146px] h-[41.345px] px-[0.96px]  rounded-[10.52px] justify-center items-center gap-[9.40px] inline-flex  transition-colors delay-50 duration-50 ease-in-out hover:bg-[#ffffff]/10">
  <div className="justify-start items-center flex">
<div className="w-[17.09px] h-[17.09px] relative  overflow-hidden">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
  >
    <path
      d="M9.43254 7.92199H12.8501V9.63078H9.43254V13.0484H7.72375V9.63078H4.30616V7.92199H7.72375V4.5044H9.43254V7.92199ZM8.57814 17.3204C6.31214 17.3204 4.13895 16.4202 2.53665 14.8179C0.934345 13.2156 0.0341797 11.0424 0.0341797 8.77639C0.0341797 6.51039 0.934345 4.3372 2.53665 2.73489C4.13895 1.13259 6.31214 0.232422 8.57814 0.232422C10.8441 0.232422 13.0173 1.13259 14.6196 2.73489C16.2219 4.3372 17.1221 6.51039 17.1221 8.77639C17.1221 11.0424 16.2219 13.2156 14.6196 14.8179C13.0173 16.4202 10.8441 17.3204 8.57814 17.3204ZM8.57814 15.6116C10.3909 15.6116 12.1295 14.8914 13.4113 13.6096C14.6932 12.3277 15.4133 10.5892 15.4133 8.77639C15.4133 6.96359 14.6932 5.22503 13.4113 3.94319C12.1295 2.66135 10.3909 1.94121 8.57814 1.94121C6.76534 1.94121 5.02679 2.66135 3.74495 3.94319C2.4631 5.22503 1.74297 6.96359 1.74297 8.77639C1.74297 10.5892 2.4631 12.3277 3.74495 13.6096C5.02679 14.8914 6.76534 15.6116 8.57814 15.6116Z"
      fill="white"
      fill-opacity="0.8"
    />
  </svg>
</div>
<div className="w-[90.14px] text-center text-[#ffffff]/80 text-[15.03px] font-medium font-['Inter']">
  Add Agent
</div>
</div>
</div>
*/}