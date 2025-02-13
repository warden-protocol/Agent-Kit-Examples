# 🍀 Othentic AVS Sample & EigenDA
![EigenDA abstra2ct](https://github.com/user-attachments/assets/bce91d7a-2d41-4bc2-a044-77af232f1dab)


# ⚙️ Set Up

To set up the environment, create a `.env` file with the default Othentic
configurations (see the `.env.example`).


# ⬇️ Install the Othentic CLI 
Install Othentic CLI with `npm`:

```console
npm i -g @othentic/othentic-cli
```

Verify installation by the command:

```console
othentic-cli -h
```
# Prerequisites
You need to register 3 self-deploy Operators with a minimum of 0.01 stETH.

* Deployer account:
   * A minimum of 1.5 holETH (Faucet)
   * A minimum of 5 Amoy MATIC (Faucet)
* Operator account x 3 (Script):
   * A minimum of 0.02 holETH on Holesky
* ERC-20 token address

# 📑 Contracts Deployment
To deploy the AVS’s on-chain components, run the following command:

``` console
othentic-cli network deploy \
    --erc20 0x73967c6a0904aA032C103b4104747E88c566B1A2 \
    --l1-initial-deposit 1000000000000000000 \
    --l2-initial-deposit 2000000000000000000 \
    --name test-avs-name
```

# 🛠️ Operators Setup
Register as an operator for both EigenLayer and the AVS
``` console
othentic-cli operator register
```

# 🔁 Convert ETH into stETH [Optional]
This command converts 0.012 ETH into stETH before depositing it into EigenLayer pool:

``` console
othentic-cli operator deposit --strategy stETH --shares 0.01 --convert 0.012 
```

Activate your Operator by depositing into EigenLayer 
Deposit 0.01 stETH into EigenLayer pool.

``` console 
othentic-cli operator deposit --strategy stETH --shares 0.01
```
✅  Your internal Operators are now ready to opt-in to your AVS.

## ▶️ Run the demo
We provide a sample docker-compose configuration which sets up the following
services:

- Aggregator node
- 3 Attester nodes
- Validation Service endpoint
- Execution Service endpoint
- Sync Shares of operators across layers


run:
```console
docker-compose up --build
```

> [!NOTE]
> This might take a few minutes when building the images


# ⚡️ Execute a task 
To execute a task we send a 
POST request to the Execution Service:


``` console 
curl -X POST <http://localhost:4003/task/execute>
```
✅  Your demo AVS is functional!


### Updating the Othentic node version
To update the `othentic-cli` inside the docker images to the latest version, you
need to rebuild the images using the following command:
```console
docker-compose build --no-cache
```

## 🏗️ Architecture
The attester nodes communicate with a Validation Service endpoint that
validates tasks on behalf of the nodes. The attesters then sign the tasks based
on the Validation Service's response.

Attester nodes can either all communicate with a sole endpoint or
implement their own validation logic.

### EigenDA
EigenDA serves as the data availability layer for the AVS. The performer uploads the price data as a blob to EigenDA and shares the `blobId` with the rest of the AVS.

### Execution Service
The execution service is run by the performer node and is used to perform new tasks and share their results with the rest of the network.  

### Validation Service
The validation service can be a sole service or a distributed one and is used by attesters in order to validate the correctness of an execution of a task.
```
POST task/validate returns (bool) {"proofOfTask": "{proofOfTask}"};
```

### Shares Syncer
Syncs the shares of operators between L1 and L2 at a fixed interval. The default interval is 12h and can be modified in the docker-compose file.

## Interactive EigenDA CLI Application
In order to understand better how to use and interface EigenDA, we've composed a simple CLI application that allows using EigenDA interactively:
```console
ts-node Execution_Service/interactiveEigenDA.ts
```
