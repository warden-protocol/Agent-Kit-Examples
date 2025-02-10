import { useState } from "react";

const WalletConnect = () => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask.");
    }
  };

  return (
    
      <button onClick={connectWallet} className="w-[182.99px] h-[42.23px] bg-[#ffffff] rounded-[10.75px] justify-center items-center gap-[4.60px] inline-flex grow shrink basis-0 text-center text-black text-[13.44px] font-[500] font-['Inter']">
       {account ? (
        <>
          <div className="w-[31.23px]  h-[31.23px]   bg-[url(src/assets/avatar/2.png)] bg-cover bg-no-repeat bg-center   rounded-full" />
          <span className="w-[130.76px]  text-black  text-sm font-medium">
            {`${account.substring(0, 9)}...${account.slice(-4)}`}
          </span>
        </>
      ) : (
        <span className="text-center text-black text-[13.44px] font-[500] font-['Inter']">Connect Wallet</span>
      )}
      </button>
    
  );
};

export default WalletConnect;

