const express = require("express");
const router = express.Router();

// Simulated ingestion processes store
let ingestionProcesses = [];

// Ingestion Trigger API
router.post("/trigger", (req, res) => {
    const processId = Date.now();
    ingestionProcesses.push({ id: processId, status: "In Progress" });
    
    setTimeout(() => {
        const process = ingestionProcesses.find(p => p.id === processId);
        if (process) process.status = "Completed";
    }, 5000);
    
    res.status(200).json({ message: "Ingestion triggered", processId });
});

// Ingestion Management API
router.get("/status", (req, res) => {
    res.status(200).json({ processes: ingestionProcesses });
});

module.exports = router;
