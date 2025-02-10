import { ethers } from "ethers"

const NETWORK_CONFIG = {
  chainId: 545,
  rpcUrl: "https://testnet.evm.nodes.onflow.org",
  privateKey:
    "0x45e40ba25677e08f574d22af580f759d686aa84d5188be8d9420385a784f726a",
}

const CONTRACT_CONFIG = {
  address: "0xBBfA869CF253aB76742AB9bc7902f783546BC830",
  abi: [
    {
      inputs: [
        { internalType: "string", name: "_name", type: "string" },
        { internalType: "string", name: "_symbol", type: "string" },
        { internalType: "uint256", name: "_totalSupply", type: "uint256" },
      ],
      name: "launchToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "memeTokenAddress", type: "address" },
        { internalType: "uint256", name: "totalCost", type: "uint256" },
      ],
      name: "buyTokens",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "memeTokenAddress", type: "address" },
        { internalType: "uint256", name: "numTokens", type: "uint256" },
      ],
      name: "sellTokens",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllMemeTokens",
      outputs: [
        {
          components: [
            { internalType: "string", name: "name", type: "string" },
            { internalType: "address", name: "tokenAddress", type: "address" },
            { internalType: "uint256", name: "supply", type: "uint256" },
          ],
          internalType: "struct PumpFlowTokenFactory.MemeToken[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
}

function setupContract() {
  const provider = new ethers.providers.StaticJsonRpcProvider(
    {
      url: "https://testnet.evm.nodes.onflow.org",
    },
    545,
  )
  const wallet = new ethers.Wallet(NETWORK_CONFIG.privateKey, provider)
  return new ethers.Contract(
    CONTRACT_CONFIG.address,
    CONTRACT_CONFIG.abi,
    wallet,
  )
}

async function getWalletInfo() {
  try {
    const provider = new ethers.providers.JsonRpcProvider(NETWORK_CONFIG.rpcUrl)
    const wallet = new ethers.Wallet(NETWORK_CONFIG.privateKey, provider)

    console.log("\nWallet Details:")
    console.log("================")
    console.log("Address:", wallet.address)

    const balance = await provider.getBalance(wallet.address)
    console.log("Balance:", ethers.utils.formatEther(balance), "FLOW")
  } catch (error: any) {
    console.error("Error fetching wallet info:", error.message)
  }
}

async function launchToken(name: string, symbol: string, supply: string) {
  try {
    const contract = setupContract()
    const provider = contract.provider

    console.log("\nLaunching token...")
    console.log("Name:", name)
    console.log("Symbol:", symbol)
    console.log("Supply:", supply)

    // Get gas price and calculate slightly higher value
    const gasPrice = await provider.getGasPrice()
    const adjustedGasPrice = gasPrice.mul(120).div(100) // 20% higher

    const tx = await contract.launchToken(
      name,
      symbol,
      ethers.utils.parseUnits(supply, 18),
      {
        gasLimit: 5000000,
        gasPrice: adjustedGasPrice,
      },
    )

    console.log("Transaction sent:", tx.hash)
    console.log("Waiting for confirmation...")

    const receipt = await tx.wait()
    console.log("\nTransaction confirmed in block:", receipt.blockNumber)
    console.log("Gas used:", receipt.gasUsed.toString())

    if (receipt.status === 1) {
      console.log("Token launched successfully!")
      // Wait a few seconds and then list tokens
      await new Promise((resolve) => setTimeout(resolve, 5000))
      await listTokens()
    } else {
      console.log("Transaction failed. Check details on block explorer.")
    }

    return receipt
  } catch (error: any) {
    console.error("\nLaunch failed:")
    console.error("Error message:", error.message)
    if (error.transaction) {
      console.error("Transaction hash:", error.transaction.hash)
    }
  }
}

async function buyTokens(tokenAddress: string, amount: string) {
  try {
    const contract = setupContract()
    const provider = contract.provider

    console.log("\nBuying tokens...")
    console.log("Token address:", tokenAddress)
    console.log("Amount:", amount, "FLOW")

    const gasPrice = await provider.getGasPrice()
    const adjustedGasPrice = gasPrice.mul(120).div(100)

    const tx = await contract.buyTokens(
      tokenAddress,
      ethers.utils.parseEther(amount),
      {
        value: ethers.utils.parseEther(amount),
        gasLimit: 500000,
        gasPrice: adjustedGasPrice,
      },
    )

    console.log("Transaction sent:", tx.hash)
    const receipt = await tx.wait()
    console.log("Purchase confirmed in block:", receipt.blockNumber)
    return receipt
  } catch (error: any) {
    console.error("Purchase failed:", error.message)
  }
}

async function sellTokens(tokenAddress: string, amount: string) {
  try {
    const contract = setupContract()
    const provider = contract.provider

    console.log("\nSelling tokens...")
    console.log("Token address:", tokenAddress)
    console.log("Amount:", amount, "tokens")

    const gasPrice = await provider.getGasPrice()
    const adjustedGasPrice = gasPrice.mul(120).div(100)

    const tx = await contract.sellTokens(
      tokenAddress,
      ethers.utils.parseEther(amount),
      {
        gasLimit: 500000,
        gasPrice: adjustedGasPrice,
      },
    )

    console.log("Transaction sent:", tx.hash)
    const receipt = await tx.wait()
    console.log("Sale confirmed in block:", receipt.blockNumber)
    return receipt
  } catch (error: any) {
    console.error("Sale failed:", error.message)
  }
}
interface MemeToken {
  name: string
  tokenAddress: string
  supply: ethers.BigNumber
}

export async function listTokens() {
  try {
    const contract = setupContract()
    console.log("\nFetching token list...")
    console.log("Contract address:", CONTRACT_CONFIG.address)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const provider = contract.provider
    const network = await provider.getNetwork()
    console.log("Connected to network:", network.chainId)

    try {
      const tokens = await contract.getAllMemeTokens()

      if (!tokens || tokens.length === 0) {
        console.log("No tokens found")
        return []
      }

      console.log("\nAvailable Tokens:")
      console.log("================")

      tokens.forEach((token: MemeToken, index: number) => {
        console.log(`\n${index + 1}. Name: ${token.name}`)
        console.log(`   Address: ${token.tokenAddress}`)
        console.log(
          `   Supply: ${ethers.utils.formatEther(token.supply)} tokens`,
        )
      })

      return tokens
    } catch (contractError: any) {
      console.error("Contract call failed:", {
        message: contractError.message,
        code: contractError.code,
        reason: contractError.reason,
        method: "getAllMemeTokens",
      })

      const code = await provider.getCode(CONTRACT_CONFIG.address)
      if (code === "0x") {
        console.error("Contract not found at specified address")
      }
      throw contractError
    }
  } catch (error: any) {
    console.error("Error fetching tokens:", error.message)
    return []
  }
}
