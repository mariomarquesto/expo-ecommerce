import express from 'express';

const app = express();

app.get("/api/health", (req, res) => {
    res.status(200).send({message:"Success "});
});


app.listen(300, () => console.log('Server se up and ronning') );