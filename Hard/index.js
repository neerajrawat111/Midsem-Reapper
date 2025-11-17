const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Express server running with Prisma!");
});

app.post("/users", async (req, res) => {
  try {
    const { name, email, connections = [] } = req.body;
    const user = await prisma.user.create({
      data: { name, email, connections },
    });
    return res.status(200).json({ data: user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "Internal Server Error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const data = await prisma.user.findMany();
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "Internal Server Error" });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await prisma.user.findUnique({ where: { id: Number(id) } });
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "Internal Server Error" });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await prisma.user.delete({ where: { id: Number(id) } });
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "Internal Server Error" });
  }
});

app.post("/connect", async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;
    const user1 = await prisma.user.findUnique({ where: { id: userId1 } });
    const updatedUser1 = await prisma.user.update({
      where: { id: userId1 },
      data: { connections: [...user1.connections, userId2] },
    });

    const user2 = await prisma.user.findUnique({ where: { id: userId2 } });
    const updatedUser2 = await prisma.user.update({
      where: { id: userId2 },
      data: { connections: [...user2.connections, userId1] },
    });
    return res
      .status(200)
      .json({ data: { user1: updatedUser1, user2: updatedUser2 } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "Internal Server Error" });
  }
});

app.post("/disconnect", async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;
    const user1 = await prisma.user.findUnique({ where: { id: userId1 } });
    const updatedUser1 = await prisma.user.update({
      where: { id: userId1 },
      data: { connections: user1.connections.filter((id) => id !== userId2) },
    });

    const user2 = await prisma.user.findUnique({ where: { id: userId2 } });
    const updatedUser2 = await prisma.user.update({
      where: { id: userId2 },
      data: { connections: user2.connections.filter((id) => id !== userId1) },
    });
    return res
      .status(200)
      .json({ data: { user1: updatedUser1, user2: updatedUser2 } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "Internal Server Error" });
  }
});

app.get("/users/:id/connections/:level", async (req, res) => {
  try {
    const { id, level } = req.params;
    const connections = await get_n_connections(Number(id), Number(level));
    console.log(connections);
    const result = await Promise.all(
      connections.map((id) =>
        prisma.user.findUnique({ where: { id: Number(id) } })
      )
    );
    return res.status(200).json({ data: result });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "Internal Server Error" });
  }
});

async function get_n_connections(id, level) {
  const vis = [];
  let que = [];
  que.push(id);
  vis.push(id);

  while (que.length > 0 && level > 0) {
    level--;
    const temp = [];
    while (que.length > 0) {
      const userId = que.shift();
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const connections = user.connections;
      for (let connection of connections) {
        if (!vis.includes(Number(connection))) {
          vis.push(Number(connection));
          temp.push(Number(connection));
        }
      }
    }
    que = temp;
  }
  return vis;
}

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
