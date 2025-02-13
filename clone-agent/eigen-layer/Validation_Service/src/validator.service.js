require('dotenv').config();
const dalService = require("./dal.service");
const aiService = require("./ai.service");

async function validate(proofOfTask) {
  console.log('Proof of task: ', proofOfTask);
  try {
    const taskResult = await dalService.getEigenDATask(proofOfTask);
    if (taskResult === null) {
      throw new Error(`ProofOfTask not found on EigenDA: ${proofOfTask}`);
    }
    var data = await aiService.subscribeToChat();
    var threadId = data.threadId
    let isApproved = true;
    if (taskResult.threadId !== threadId) {
      isApproved = false;
    }
    return isApproved;
  } catch (err) {
    console.error(err?.message);
    return false;
  }
}

module.exports = {
  validate,
}