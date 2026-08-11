import express from "express";
const app = express();

app.get("/", (_req, res) => {
    res.json({ message: "minimal works" });
});

app.listen(5000, () => console.log("minimal server running on 5000"));