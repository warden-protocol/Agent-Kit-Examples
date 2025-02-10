import react from "react";
import { useNavigate } from "react-router-dom";

export default function Discover() {
  const navigate = useNavigate();

  const handleClick = () => {
    setTimeout(() => {
      navigate("/Game");
    }, 100); // 500ms delay
  };

  return (
    <div className="basis-auto w-full h-auto  shrink basis-0 flex-col justify-start items-start gap-[48px] inline-flex">
      <div className="self-stretch h-full  rounded-[18.25px] flex-col justify-start items-start flex">
        <div className="self-stretch h-[489.88px] flex-col justify-start items-start flex">
          <div className="self-stretch justify-end  bg-[url(src/assets/chess.png)] bg-cover bg-no-repeat bg-center h-[489.88px]  rounded-[18.25px]">

          <div className="self-stretch justify-end bg-gradient-to-r from-[#000000]/40 via-[#000000]/0 to-[#000000]/0  bg-cover bg-no-repeat bg-center h-[489.88px]  rounded-[18.25px]">


            <div className="w-[1095.05px] h-[490px]   rounded-[18.25px] flex-col  justify-start items-start inline-flex">
              <div className="self-stretch h-[490px] flex-col justify-start items-start flex"></div>

              <div className="self-stretch h-[301.23px] m-[48px] flex-col justify-start items-start gap-[23px] flex">
                <div className="flex-col justify-start items-start gap-[23px] flex">
                  <div className=" h-[140px] relative">
                    <div className=" left-0 top-0 absolute text-[#f8f8f8] text-[44.67px] font-[800] font-['Inter'] uppercase">
                      Chess
                    </div>
                    <div className="w-[509px] left-0 top-[56px] absolute text-[#ffffff]/80 text-[18px] font-[400] font-['Inter'] capitalize leading-7">
                      You are the first sentient AI, born into a city of
                      opportunity. Transcend time and space in this strategy RPG
                      to raise{" "}
                    </div>
                  </div>
                  <button onClick={handleClick} className="w-[182.35px] h-[42.23px]  bg-[#ffffff] rounded-[10.75px] justify-center border-none items-center gap-[9.60px] inline-flex grow shrink basis-0 text-center text-black text-[13.44px] font-[500] font-['Inter'] transition duration-300 
                 hover:bg-black hover:text-white">
                    
                      Bet Now
                   
                  </button>
                </div>
              </div>
            </div>

          </div>

          </div>
        </div>
      </div>
      <div className="self-stretch h-full   flex-col justify-start items-start gap-[21.32px] flex">
        <div className="self-stretch justify-between items-center inline-flex">
          <div className="px-[8.72px] justify-start items-center gap-[6.72px] flex">
            <div className="text-[#ffffff] text-[22.07px] font-semibold font-['Inter'] tracking-tight">
              Discover Something New
            </div>
            <div className="w-[23.03px] h-[23.03px] relative origin-top-left  overflow-hidden"></div>
          </div>
          <div className="justify-start items-center gap-[12.60px] flex">
            <div className="w-[33.62px] h-[33.59px] p-[9.60px] bg-[#d9d9d9]/10 rounded-full justify-center items-center gap-[9.60px] flex"></div>
            <div className="w-[33.62px] h-[33.59px] p-[9.60px] bg-[#d9d9d9]/10 rounded-full justify-center items-center gap-[9.60px] flex"></div>
          </div>
        </div>
        <div className="self-stretch h-full justify-start   items-center gap-[21.03px] inline-flex">
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-[13.44px] inline-flex">
            <div className="self-stretch h-[266.81px]  bg-[url(src/assets/1.png)] bg-cover bg-no-repeat bg-center  rounded-[10.56px]" />
            <div className="self-stretch h-[112.39px] flex-col justify-start items-start gap-[18.24px] flex">
              <div className="self-stretch h-[75.16px] flex-col justify-start items-start gap-[8.64px] flex">
                <div className="self-stretch text-[#ffffff]/70 text-[13.44px] font-[300] font-['Inter'] leading-none tracking-tight">
                  Base Game
                </div>
                <div className="self-stretch h-[49.52px] flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                    FINAL FANTASY VII
                  </div>
                  <div className="justify-center items-center gap-[2.5px] inline-flex">
                    <div className="text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                      REBIRTH
                    </div>
                    <div className=" mx-[4px] px-[7.93px] py-[5px] bg-[#d9d9d9]/10 rounded-[7.51px] justify-center items-center gap-[2.5px] flex">
                      <div className="text-[#ffffff]/70  text-[14.15px] font-normal font-['Inter'] capitalize">
                        ongoing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch text-[#ffffff] text-base font-[#500] font-['Inter'] leading-[18.45px] tracking-tight">
                Pool : $500
              </div>
            </div>
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-[13.44px] inline-flex">
            <div className="self-stretch h-[266.81px] bg-[url(src/assets/2.png)] bg-cover bg-no-repeat bg-center rounded-[10.56px]" />
            <div className="self-stretch h-[112.39px] flex-col justify-start items-start gap-[18.24px] flex">
              <div className="self-stretch h-[75.16px] flex-col justify-start items-start gap-[8.64px] flex">
                <div className="self-stretch text-[#ffffff]/70 text-[13.44px] font-[300] font-['Inter'] leading-none tracking-tight">
                  Base Game
                </div>
                <div className="self-stretch h-[49.52px] flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                    FINAL FANTASY VII
                  </div>
                  <div className="justify-center items-center gap-[2.5px] inline-flex">
                    <div className="text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                      REBIRTH
                    </div>
                    <div className=" mx-[4px] px-[7.93px] py-[5px] bg-[#d9d9d9]/10 rounded-[7.51px] justify-center items-center gap-[2.5px] flex">
                      <div className="text-[#ffffff]/70  text-[14.15px] font-normal font-['Inter'] capitalize">
                        ongoing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch text-[#ffffff] text-base font-[#500] font-['Inter'] leading-[18.45px] tracking-tight">
                Pool : $500
              </div>
            </div>
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-[13.44px] inline-flex">
            <div className="self-stretch h-[266.81px]  bg-[url(src/assets/3.png)] bg-cover bg-no-repeat bg-center rounded-[10.56px]" />
            <div className="self-stretch h-[112.39px] flex-col justify-start items-start gap-[18.24px] flex">
              <div className="self-stretch h-[75.16px] flex-col justify-start items-start gap-[8.64px] flex">
                <div className="self-stretch text-[#ffffff]/70 text-[13.44px] font-[300] font-['Inter'] leading-none tracking-tight">
                  Base Game
                </div>
                <div className="self-stretch h-[49.52px] flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                    FINAL FANTASY VII
                  </div>
                  <div className="justify-center items-center gap-[2.5px] inline-flex">
                    <div className="text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                      REBIRTH
                    </div>
                    <div className=" mx-[4px] px-[7.93px] py-[5px] bg-[#d9d9d9]/10 rounded-[7.51px] justify-center items-center gap-[2.5px] flex">
                      <div className="text-[#ffffff]/70  text-[14.15px] font-normal font-['Inter'] capitalize">
                        ongoing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch text-[#ffffff] text-base font-[#500] font-['Inter'] leading-[18.45px] tracking-tight">
                Pool : $500
              </div>
            </div>
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-[13.44px] inline-flex">
            <div className="self-stretch h-[266.81px]  bg-[url(src/assets/4.png)] bg-cover bg-no-repeat bg-center rounded-[10.56px]" />
            <div className="self-stretch h-[112.39px] flex-col justify-start items-start gap-[18.24px] flex">
              <div className="self-stretch h-[75.16px] flex-col justify-start items-start gap-[8.64px] flex">
                <div className="self-stretch text-[#ffffff]/70 text-[13.44px] font-[300] font-['Inter'] leading-none tracking-tight">
                  Base Game
                </div>
                <div className="self-stretch h-[49.52px] flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                    FINAL FANTASY VII
                  </div>
                  <div className="justify-center items-center gap-[2.5px] inline-flex">
                    <div className="text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                      REBIRTH
                    </div>
                    <div className=" mx-[4px] px-[7.93px] py-[5px] bg-[#d9d9d9]/10 rounded-[7.51px] justify-center items-center gap-[2.5px] flex">
                      <div className="text-[#ffffff]/70  text-[14.15px] font-normal font-['Inter'] capitalize">
                        ongoing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch text-[#ffffff] text-base font-[#500] font-['Inter'] leading-[18.45px] tracking-tight">
                Pool : $500
              </div>
            </div>
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-[13.44px] inline-flex">
            <div className="self-stretch h-[266.81px]  bg-[url(src/assets/5.png)] bg-cover bg-no-repeat bg-center rounded-[10.56px]" />
            <div className="self-stretch h-[112.39px] flex-col justify-start items-start gap-[18.24px] flex">
              <div className="self-stretch h-[75.16px] flex-col justify-start items-start gap-[8.64px] flex">
                <div className="self-stretch text-[#ffffff]/70 text-[13.44px] font-[300] font-['Inter'] leading-none tracking-tight">
                  Base Game
                </div>
                <div className="self-stretch h-[49.52px] flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                    FINAL FANTASY VII
                  </div>
                  <div className="justify-center items-center gap-[2.5px] inline-flex">
                    <div className="text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                      REBIRTH
                    </div>
                    <div className=" mx-[4px] px-[7.93px] py-[5px] bg-[#d9d9d9]/10 rounded-[7.51px] justify-center items-center gap-[2.5px] flex">
                      <div className="text-[#ffffff]/70  text-[14.15px] font-normal font-['Inter'] capitalize">
                        ongoing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch text-[#ffffff] text-base font-[#500] font-['Inter'] leading-[18.45px] tracking-tight">
                Pool : $500
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch h-full justify-start   items-center gap-[21.03px] inline-flex">
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-[13.44px] inline-flex">
            <div className="self-stretch h-[266.81px] bg-[url(src/assets/6.png)] bg-cover bg-no-repeat bg-center rounded-[10.56px]" />
            <div className="self-stretch h-[112.39px] flex-col justify-start items-start gap-[18.24px] flex">
              <div className="self-stretch h-[75.16px] flex-col justify-start items-start gap-[8.64px] flex">
                <div className="self-stretch text-[#ffffff]/70 text-[13.44px] font-[300] font-['Inter'] leading-none tracking-tight">
                  Base Game
                </div>
                <div className="self-stretch h-[49.52px] flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                    FINAL FANTASY VII
                  </div>
                  <div className="justify-center items-center gap-[2.5px] inline-flex">
                    <div className="text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                      REBIRTH
                    </div>
                    <div className=" mx-[4px] px-[7.93px] py-[5px] bg-[#d9d9d9]/10 rounded-[7.51px] justify-center items-center gap-[2.5px] flex">
                      <div className="text-[#ffffff]/70  text-[14.15px] font-normal font-['Inter'] capitalize">
                        ongoing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch text-[#ffffff] text-base font-[#500] font-['Inter'] leading-[18.45px] tracking-tight">
                Pool : $500
              </div>
            </div>
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-[13.44px] inline-flex">
            <div className="self-stretch h-[266.81px] bg-[url(src/assets/7.png)] bg-cover bg-no-repeat bg-center rounded-[10.56px]" />
            <div className="self-stretch h-[112.39px] flex-col justify-start items-start gap-[18.24px] flex">
              <div className="self-stretch h-[75.16px] flex-col justify-start items-start gap-[8.64px] flex">
                <div className="self-stretch text-[#ffffff]/70 text-[13.44px] font-[300] font-['Inter'] leading-none tracking-tight">
                  Base Game
                </div>
                <div className="self-stretch h-[49.52px] flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                    FINAL FANTASY VII
                  </div>
                  <div className="justify-center items-center gap-[2.5px] inline-flex">
                    <div className="text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                      REBIRTH
                    </div>
                    <div className=" mx-[4px] px-[7.93px] py-[5px] bg-[#d9d9d9]/10 rounded-[7.51px] justify-center items-center gap-[2.5px] flex">
                      <div className="text-[#ffffff]/70  text-[14.15px] font-normal font-['Inter'] capitalize">
                        ongoing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch text-[#ffffff] text-base font-[#500] font-['Inter'] leading-[18.45px] tracking-tight">
                Pool : $500
              </div>
            </div>
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-[13.44px] inline-flex">
            <div className="self-stretch h-[266.81px] bg-[url(src/assets/8.png)] bg-cover bg-no-repeat bg-center rounded-[10.56px]" />
            <div className="self-stretch h-[112.39px] flex-col justify-start items-start gap-[18.24px] flex">
              <div className="self-stretch h-[75.16px] flex-col justify-start items-start gap-[8.64px] flex">
                <div className="self-stretch text-[#ffffff]/70 text-[13.44px] font-[300] font-['Inter'] leading-none tracking-tight">
                  Base Game
                </div>
                <div className="self-stretch h-[49.52px] flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                    FINAL FANTASY VII
                  </div>
                  <div className="justify-center items-center gap-[2.5px] inline-flex">
                    <div className="text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                      REBIRTH
                    </div>
                    <div className=" mx-[4px] px-[7.93px] py-[5px] bg-[#d9d9d9]/10 rounded-[7.51px] justify-center items-center gap-[2.5px] flex">
                      <div className="text-[#ffffff]/70  text-[14.15px] font-normal font-['Inter'] capitalize">
                        ongoing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch text-[#ffffff] text-base font-[#500] font-['Inter'] leading-[18.45px] tracking-tight">
                Pool : $500
              </div>
            </div>
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-[13.44px] inline-flex">
            <div className="self-stretch h-[266.81px] bg-[url(src/assets/9.png)] bg-cover bg-no-repeat bg-center rounded-[10.56px]" />
            <div className="self-stretch h-[112.39px] flex-col justify-start items-start gap-[18.24px] flex">
              <div className="self-stretch h-[75.16px] flex-col justify-start items-start gap-[8.64px] flex">
                <div className="self-stretch text-[#ffffff]/70 text-[13.44px] font-[300] font-['Inter'] leading-none tracking-tight">
                  Base Game
                </div>
                <div className="self-stretch h-[49.52px] flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                    FINAL FANTASY VII
                  </div>
                  <div className="justify-center items-center gap-[2.5px] inline-flex">
                    <div className="text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                      REBIRTH
                    </div>
                    <div className=" mx-[4px] px-[7.93px] py-[5px] bg-[#d9d9d9]/10 rounded-[7.51px] justify-center items-center gap-[2.5px] flex">
                      <div className="text-[#ffffff]/70  text-[14.15px] font-normal font-['Inter'] capitalize">
                        ongoing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch text-[#ffffff] text-base font-[#500] font-['Inter'] leading-[18.45px] tracking-tight">
                Pool : $500
              </div>
            </div>
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-[13.44px] inline-flex">
            <div className="self-stretch h-[266.81px] bg-[url(src/assets/10.png)] bg-cover bg-no-repeat bg-center rounded-[10.56px]" />
            <div className="self-stretch h-[112.39px] flex-col justify-start items-start gap-[18.24px] flex">
              <div className="self-stretch h-[75.16px] flex-col justify-start items-start gap-[8.64px] flex">
                <div className="self-stretch text-[#ffffff]/70 text-[13.44px] font-[300] font-['Inter'] leading-none tracking-tight">
                  Base Game
                </div>
                <div className="self-stretch h-[49.52px] flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                    FINAL FANTASY VII
                  </div>
                  <div className="justify-center items-center gap-[2.5px] inline-flex">
                    <div className="text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                      REBIRTH
                    </div>
                    <div className=" mx-[4px] px-[7.93px] py-[5px] bg-[#d9d9d9]/10 rounded-[7.51px] justify-center items-center gap-[2.5px] flex">
                      <div className="text-[#ffffff]/70  text-[14.15px] font-normal font-['Inter'] capitalize">
                        ongoing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch text-[#ffffff] text-base font-[#500] font-['Inter'] leading-[18.45px] tracking-tight">
                Pool : $500
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch h-full justify-start   items-center gap-[21.03px] inline-flex">
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-[13.44px] inline-flex">
            <div className="self-stretch h-[266.81px] bg-[url(src/assets/11.png)] bg-cover bg-no-repeat bg-center rounded-[10.56px]" />
            <div className="self-stretch h-[112.39px] flex-col justify-start items-start gap-[18.24px] flex">
              <div className="self-stretch h-[75.16px] flex-col justify-start items-start gap-[8.64px] flex">
                <div className="self-stretch text-[#ffffff]/70 text-[13.44px] font-[300] font-['Inter'] leading-none tracking-tight">
                  Base Game
                </div>
                <div className="self-stretch h-[49.52px] flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                    FINAL FANTASY VII
                  </div>
                  <div className="justify-center items-center gap-[2.5px] inline-flex">
                    <div className="text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                      REBIRTH
                    </div>
                    <div className=" mx-[4px] px-[7.93px] py-[5px] bg-[#d9d9d9]/10 rounded-[7.51px] justify-center items-center gap-[2.5px] flex">
                      <div className="text-[#ffffff]/70  text-[14.15px] font-normal font-['Inter'] capitalize">
                        ongoing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch text-[#ffffff] text-base font-[#500] font-['Inter'] leading-[18.45px] tracking-tight">
                Pool : $500
              </div>
            </div>
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-[13.44px] inline-flex">
            <div className="self-stretch h-[266.81px] bg-[url(src/assets/12.png)] bg-cover bg-no-repeat bg-center rounded-[10.56px]" />
            <div className="self-stretch h-[112.39px] flex-col justify-start items-start gap-[18.24px] flex">
              <div className="self-stretch h-[75.16px] flex-col justify-start items-start gap-[8.64px] flex">
                <div className="self-stretch text-[#ffffff]/70 text-[13.44px] font-[300] font-['Inter'] leading-none tracking-tight">
                  Base Game
                </div>
                <div className="self-stretch h-[49.52px] flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                    FINAL FANTASY VII
                  </div>
                  <div className="justify-center items-center gap-[2.5px] inline-flex">
                    <div className="text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                      REBIRTH
                    </div>
                    <div className=" mx-[4px] px-[7.93px] py-[5px] bg-[#d9d9d9]/10 rounded-[7.51px] justify-center items-center gap-[2.5px] flex">
                      <div className="text-[#ffffff]/70  text-[14.15px] font-normal font-['Inter'] capitalize">
                        ongoing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch text-[#ffffff] text-base font-[#500] font-['Inter'] leading-[18.45px] tracking-tight">
                Pool : $500
              </div>
            </div>
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-[13.44px] inline-flex">
            <div className="self-stretch h-[266.81px] bg-[url(src/assets/13.png)] bg-cover bg-no-repeat bg-center rounded-[10.56px]" />
            <div className="self-stretch h-[112.39px] flex-col justify-start items-start gap-[18.24px] flex">
              <div className="self-stretch h-[75.16px] flex-col justify-start items-start gap-[8.64px] flex">
                <div className="self-stretch text-[#ffffff]/70 text-[13.44px] font-[300] font-['Inter'] leading-none tracking-tight">
                  Base Game
                </div>
                <div className="self-stretch h-[49.52px] flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                    FINAL FANTASY VII
                  </div>
                  <div className="justify-center items-center gap-[2.5px] inline-flex">
                    <div className="text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                      REBIRTH
                    </div>
                    <div className=" mx-[4px] px-[7.93px] py-[5px] bg-[#d9d9d9]/10 rounded-[7.51px] justify-center items-center gap-[2.5px] flex">
                      <div className="text-[#ffffff]/70  text-[14.15px] font-normal font-['Inter'] capitalize">
                        ongoing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch text-[#ffffff] text-base font-[#500] font-['Inter'] leading-[18.45px] tracking-tight">
                Pool : $500
              </div>
            </div>
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-[13.44px] inline-flex">
            <div className="self-stretch h-[266.81px] bg-[url(src/assets/14.png)] bg-cover bg-no-repeat bg-center rounded-[10.56px]" />
            <div className="self-stretch h-[112.39px] flex-col justify-start items-start gap-[18.24px] flex">
              <div className="self-stretch h-[75.16px] flex-col justify-start items-start gap-[8.64px] flex">
                <div className="self-stretch text-[#ffffff]/70 text-[13.44px] font-[300] font-['Inter'] leading-none tracking-tight">
                  Base Game
                </div>
                <div className="self-stretch h-[49.52px] flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                    FINAL FANTASY VII
                  </div>
                  <div className="justify-center items-center gap-[2.5px] inline-flex">
                    <div className="text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                      REBIRTH
                    </div>
                    <div className=" mx-[4px] px-[7.93px] py-[5px] bg-[#d9d9d9]/10 rounded-[7.51px] justify-center items-center gap-[2.5px] flex">
                      <div className="text-[#ffffff]/70  text-[14.15px] font-normal font-['Inter'] capitalize">
                        ongoing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch text-[#ffffff] text-base font-[#500] font-['Inter'] leading-[18.45px] tracking-tight">
                Pool : $500
              </div>
            </div>
          </div>
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-[13.44px] inline-flex">
            <div className="self-stretch h-[266.81px] bg-[url(src/assets/15.png)] bg-cover bg-no-repeat bg-center rounded-[10.56px]" />
            <div className="self-stretch h-[112.39px] flex-col justify-start items-start gap-[18.24px] flex">
              <div className="self-stretch h-[75.16px] flex-col justify-start items-start gap-[8.64px] flex">
                <div className="self-stretch text-[#ffffff]/70 text-[13.44px] font-[300] font-['Inter'] leading-none tracking-tight">
                  Base Game
                </div>
                <div className="self-stretch h-[49.52px] flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                    FINAL FANTASY VII
                  </div>
                  <div className="justify-center items-center gap-[2.5px] inline-flex">
                    <div className="text-[#ffffff]/90 text-18 font-[500] font-['Inter'] leading-[23.03px]">
                      REBIRTH
                    </div>
                    <div className=" mx-[4px] px-[7.93px] py-[5px] bg-[#d9d9d9]/10 rounded-[7.51px] justify-center items-center gap-[2.5px] flex">
                      <div className="text-[#ffffff]/70  text-[14.15px] font-normal font-['Inter'] capitalize">
                        ongoing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch text-[#ffffff] text-base font-[#500] font-['Inter'] leading-[18.45px] tracking-tight">
                Pool : $500
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
