"use strict";
const { Router } = require("express")
const CustomError = require("./utils/validateError");
const CustomResponse = require("./utils/validateResponse");
const dalService = require("./dal.service");

const router = Router()

router.post("/execute", async (req, res) => {
    console.log("Executing task");

    var taskDefinitionId = Number(req.body.taskDefinitionId) || 0;
    console.log(`taskDefinitionId: ${taskDefinitionId}`);
    var threadId = req.body.threadId || 0;
    console.log(`threadId: ${threadId}`);
    var assistantId = req.body.assistantId || 0;
    console.log(`assistantId: ${assistantId}`);

    try {
        let data = {
            threadId: threadId,
            assistantId: assistantId
        }
        const [cid, poll] = await dalService.publishToEigenDA(data);
        res.status(200).send(new CustomResponse(
            {
                proofOfTask: cid,
                data: data,
                taskDefinitionId: taskDefinitionId
            },
            "Blob dispersion started. Task will be submitted after blob is dispersed."
        ));

        const blob = await poll;
        console.log(`blob data: ${blob}`);
        data = JSON.stringify(data);
        await dalService.sendTask(cid, data, taskDefinitionId);
    } catch (error) {
        console.log(error);
        if (!res.headersSent) {
            return res.status(500).send(new CustomError("Something went wrong", {}));
        }
    }
})


module.exports = router
