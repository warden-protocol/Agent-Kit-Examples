import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const contractAddress = '0x4e0a477ab23678569483c0a05cbdcedff1b57e83';
const contractABI = [
    "function init() external",
    "function bet(uint256 value) external payable",
    "function closeRegistration() external",
    "function claimPrize() external"
];

const PrizeDistributor = () => {



  











































    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [userAddress, setUserAddress] = useState(null);
    const [betAmount, setBetAmount] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', () => window.location.reload());
            window.ethereum.on('chainChanged', () => window.location.reload());
        }
    }, []);

    const showStatus = (message, type) => {
        setStatus(message);
    };

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                throw new Error('Please install MetaMask to use this application');
            }
            
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const newProvider = new ethers.BrowserProvider(window.ethereum);
            const newSigner = await newProvider.getSigner();
            const newContract = new ethers.Contract(contractAddress, contractABI, newSigner);

            const address = await newSigner.getAddress();
            console.log("Connected Address:", address);

            setProvider(newProvider);
            setSigner(newSigner);
            setContract(newContract);
            setUserAddress(address);

            showStatus('Wallet connected successfully!', 'success');
        } catch (error) {
            showStatus('Error connecting wallet: ' + error.message, 'error');
        }
    };

    const placeBet = async () => {
        try {
            if (!betAmount || betAmount <= 0) {
                throw new Error('Please enter a valid bet amount');
            }
            
            const betAmountWei = ethers.parseEther(betAmount.toString());
            console.log("Bet Amount in Wei:", betAmountWei.toString());

            const tx = await contract.bet(betAmountWei, { 
                value: betAmountWei, 
                gasLimit: ethers.parseUnits("500000", "wei") // Explicit gas limit
            });

            showStatus('Transaction submitted. Waiting for confirmation...', 'success');
            await tx.wait();
            showStatus('Bet placed successfully!', 'success');
            setBetAmount('');
        } catch (error) {
            showStatus('Error placing bet: ' + error.message, 'error');
        }
    };

    const claimPrize = async () => {
        try {
            const tx = await contract.claimPrize();
            showStatus('Transaction submitted. Waiting for confirmation...', 'success');
            await tx.wait();
            showStatus('Prize claimed successfully!', 'success');
        } catch (error) {
            showStatus('Error claiming prize: ' + error.message, 'error');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Prize Distributor</h1>
            {!userAddress ? (
                <button onClick={connectWallet} className="px-4 py-2 bg-blue-500 text-white rounded">Connect Wallet</button>
            ) : (
                <div className="w-full max-w-md p-4 bg-white shadow rounded">
                    <p className="mb-2">Connected Address: <span className="font-mono text-blue-600">{userAddress}</span></p>
                    <div className="flex gap-2 mb-4">
                        <input 
                            type="number" 
                            value={betAmount} 
                            onChange={(e) => setBetAmount(e.target.value)} 
                            step="0.000000000000000001" 
                            min="0" 
                            placeholder="Enter ETH amount" 
                            className="flex-grow px-2 py-1 border rounded"
                        />
                        <button onClick={placeBet} className="px-4 py-2 bg-green-500 text-white rounded">Place Bet</button>
                    </div>
                    <button onClick={claimPrize} className="w-full px-4 py-2 bg-purple-500 text-white rounded">Claim Prize</button>
                </div>
            )}
            {status && <div className="mt-4 p-2 bg-gray-200 rounded text-center">{status}</div>}
        </div>
    );
};

export default PrizeDistributor;
