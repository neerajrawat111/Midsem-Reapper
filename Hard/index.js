const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/', async (req, res) => {
    res.send("Express server running with Prisma!");
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});
