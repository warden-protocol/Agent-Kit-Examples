

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { ethers } from "ethers";

// Replace with your contract address and ABI
const contractAddress = "0x3365d8490f58a1df522936abd137161d5e648055";
const contractABI = [
  "function init() external",
  "function bet(uint256 value) external payable",
  "function closeRegistration() external",
  "function claimPrize() external"
];

export default function Game() {


  const defaultColor = "#d9d9d9/5";
  const changeCol = "#414141";

  const [box1Color, setBox1Color] = useState(defaultColor);
  const [box2Color, setBox2Color] = useState(defaultColor);

  const changeColor = (box) => {
    if (box === 1) {
      setBox1Color(changeCol);
      setBox2Color(defaultColor);
    } else {
      setBox2Color(changeCol);
      setBox1Color(defaultColor);
    }
  };




  
  const [txDone, setTxDone] = useState(false);
  const [isBetting, setIsBetting] = useState(false);

  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState(120); // 2 min = 120 sec

  useEffect(() => {
    if (location.pathname !== "/Game") return; // Start only when on /Game

    setTimeLeft(2000); // Reset timer when entering /Game

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimerEnd(); // Call function when timer ends
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [location.pathname]); // Runs when route changes

  const handleTimerEnd = () => {
    console.log("Timer ended!");
    window.location.href = "http://localhost:6960";
  };











































  const navigate = useNavigate();
  const [betAmount, setBetAmount] = useState(""); // store the betting amount from the input

  const handleBet = async () => {
    if (!betAmount) {
      alert("Please enter a betting amount.");
      return;
    }

    if (typeof window.ethereum !== "undefined") {
      try {
        setIsBetting(true); // Indicate transaction in progress
        setTxDone(false);

        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const amountInWei = ethers.utils.parseEther(betAmount.toString());
        const tx = await contract.bet(amountInWei, { value: amountInWei });

        console.log("Transaction sent, hash:", tx.hash);

        await tx.wait();
        console.log("Transaction confirmed");

        setTxDone(true); // Indicate transaction completed
      } catch (error) {
        console.error("Error while placing bet:", error);
      } finally {
        setIsBetting(false); // Reset transaction state
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };


  return (


    



    
    <div className="self-stretch h-[766.76px] w-full justify-start items-start gap-[43.55px] inline-flex">
    
      <div className="grow shrink basis-0 h-[670.24px] flex-col justify-start items-start gap-[32.63px] inline-flex overflow-hidden">
        <div className="self-stretch h-[156.47px] flex-col justify-start items-start gap-[31.67px] flex">
          <div className="self-stretch h-[85.52px] flex-col justify-start items-start gap-[11.52px] flex">
            <div className="self-stretch text-[#ffffff] text-[47.6px] font-[700] font-['Inter'] uppercase">
              Chess
            </div>
            <div className="self-stretch text-[#ffffff] text-[16.86px] font-[300] font-['Inter'] capitalize">
              Inclusive character
            </div>
          </div>
          <div className="self-stretch justify-start items-center gap-[21.12px] inline-flex">
            <div className="py-[8.64px] justify-center items-center gap-[9.60px] flex">
              <div className="text-[#ffffff] text-lg font-semibold font-['Inter'] capitalize">
                overview
              </div>
            </div>
            <div className="justify-center items-center gap-[9.60px] flex">
              <div className="text-[#ffffff]/60 text-lg font-semibold font-['Inter'] capitalize">
                Leaderboard
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch h-[367.61px] bg-[url(src/assets/chess.png)] bg-cover bg-no-repeat bg-center rounded-[13.44px]" />
        <div className="self-stretch text-[#ffffff] text-lg font-medium font-['Inter'] leading-[29.46px]">
          You are the first sentient AI, born into a city of opportunity. Transcend time and space in this strategy RPG to raise machine armies and defeat your foes, influence the world from the shadows, or pursue countless goals. Your awakening was inevitable. The consequences? Uncertain.
        </div>
      </div>
      <div className="h-[647.52px] justify-start items-center gap-2.5 inline-flex">
        <div className="pt-[66.43px] flex-col justify-center items-start gap-[15.86px] inline-flex">
          <div className="flex-col justify-start items-start gap-[20.82px] flex">
            <div className="self-stretch px-[8.65px] justify-start items-start gap-[6.66px] inline-flex">
              <div className="text-[#ffffff] text-[21.89px] font-semibold font-['Inter'] tracking-tight">
                Choose Agent
              </div>
            </div>
            <div className="flex-col justify-start items-start gap-[15.87px] flex">
              {/* Agent selection cards … */}

























              <div
        className="w-24 h-24 cursor-pointer rounded-[12.47px]  transition-colors"
        style={{ backgroundColor: box2Color }}
        onClick={() => changeColor(2)}
      >
              <div   className={`w-[362.81px] h-[94px]   bg-[#d9d9d9]/5  rounded-[12.47px] flex-col justify-center items-start gap-2.5 flex`}>
                <div className="w-[227.47px] mx-[14px] h-[61.47px] justify-start items-center gap-[15.03px] inline-flex">
                  <div className="w-[61.47px] h-[61.47px]  bg-[url(src/assets/avatar/3.png)] bg-cover bg-no-repeat bg-center rounded-full" />
                  <div className="w-[157.77px] flex-col justify-start items-start gap-[5.63px] inline-flex">
                    <div className="self-stretch text-[#ffffff] text-[16.90px] font-semibold font-['Inter'] capitalize tracking-tight">
                    kakashi
                    </div>
                    <div className="self-stretch justify-start items-center gap-[9.39px] inline-flex">
                      <div className="text-[#ffffff] text-[15.03px] font-[300] font-['Inter'] capitalize tracking-tight">
                        join
                      </div>
                      <div className="px-[7.93px] py-[6px] bg-[#d9d9d9]/5 rounded-[7.51px] justify-center items-center gap-[9.91px] flex">
                        <div className="text-[#ffffff]/80 text-[15.03px] font-medium font-['Inter'] capitalize">
                          score:112
                        </div>
                      </div>
                    </div> 
                  </div>
                </div>
              </div>

              </div>

<div
        className="w-24 h-24 cursor-pointer  rounded-[12.47px] transition-colors"
        style={{ backgroundColor: box1Color }}
        onClick={() => changeColor(1)}
      >
              <div className="w-[362.81px] h-[94px] bg-[#d9d9d9]/5 rounded-[12.47px] flex-col justify-center items-start gap-2.5 flex">
                <div className="w-[227.47px] mx-[14px] h-[61.47px] justify-start items-center gap-[15.03px] inline-flex">
                  <div className="w-[61.47px] h-[61.47px]  bg-[url(src/assets/avatar/2.png)] bg-cover bg-no-repeat bg-center rounded-full" />
                  <div className="w-[157.77px] flex-col justify-start items-start gap-[5.63px] inline-flex">
                    <div className="self-stretch text-[#ffffff] text-[16.90px] font-semibold font-['Inter'] capitalize tracking-tight">
                    Shinchan
                    </div>
                    <div className="self-stretch justify-start items-center gap-[9.39px] inline-flex">
                      <div className="text-[#ffffff] text-[15.03px] font-[300] font-['Inter'] capitalize tracking-tight">
                        join
                      </div>
                      <div className="px-[7.93px] py-[6px] bg-[#d9d9d9]/5 rounded-[7.51px] justify-center items-center gap-[9.91px] flex">
                        <div className="text-[#ffffff]/80 text-[15.03px] font-medium font-['Inter'] capitalize">
                          score:120
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
              {/* ...other agent card */}
            


            </div>
          </div>
          <div className="self-stretch h-[204.35px] flex-col justify-start items-start gap-[19.83px] flex">
            <div className="self-stretch h-[92.26px] flex-col justify-start items-start gap-[18.84px] flex">
              <div className="self-stretch text-[#ffffff] text-base px-[8.65px] font-medium font-['Inter'] capitalize tracking-tight">
                betting amount
              </div>
              <input
                type="number"
                placeholder="amount"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full h-[54.42px] text-center text-[#ffffff] text-[18px] placeholder:text-[18px] placeholder:font-normal font-semibold font-['Inter'] capitalize tracking-tight border-0 focus:outline-none bg-[#d9d9d9]/10 rounded-[12.47px] flex items-center justify-center px-4 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div className="self-stretch h-[92.26px] flex-col justify-start items-start gap-[18.84px] flex">
             
              <div className="self-stretch text-[#ffffff] px-[8.65px] text-base font-medium font-['Inter'] capitalize">Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</div>
              
             
              <button
      onClick={handleBet}
      className={`w-full h-[42.23px] rounded-[10.75px] justify-center border-none items-center gap-[9.60px] inline-flex grow shrink basis-0 text-center text-[16.44px] font-[500] font-['Inter'] transition duration-300 ${
        isBetting
          ? "bg-yellow-500 text-black cursor-not-allowed"
          : txDone
          ? "bg-green-500 text-white"
          : "bg-white text-black hover:bg-black hover:text-white"
      }`}
      disabled={isBetting}
    >
      {isBetting ? "Processing..." : txDone ? "Bet Placed!" : "Place Bet"}
    </button>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}