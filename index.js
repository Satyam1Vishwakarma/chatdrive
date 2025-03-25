import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import cors from "cors";
//import * as edgedb from "edgedb";
import * as gel from "gel";
import { object } from "zod";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const client = gel.createClient();
gel.SHOULD_RECONNECT;
gel.SHOULD_RETRY;

const event = {
  "signin response": {
    example: { event: 1, id: 1 },
    record_found: 1,
    no_record_found: 2,
  },
  "signup response": {
    example: { event: 1, id: 1 },
    record_found: 1,
    user_name_taken: 2,
  },
  "getgroups response": {
    example: { event: 1, object: object },
    ok: 1,
    object: null,
  },
  "getonlineusers response": {
    example: { event: 1, object: { id: "1", username: "1", avatar: "a" } },
    ok: 1,
  },
  "getmessages response": { object: object },
  signin: {
    example: { username: "qqqqqqq", password: "1234" },
  },

  signup: {
    example: { username: "qqqqqqq", password: "1234" },
  },
  getgroups: {
    example: { id: "myid" },
  },
  addgroup: {
    example: { id: "myid", name: "new group name" },
  },
  deletegroup: {
    example: { id: "currentgroup" },
  },
  getusers: {
    example: { id: "currentgroup" },
  },
  getonlineusers: {
    example: { id: "currentgroup" },
  },
  getmessages: {
    example: { id: "currentgroup" },
  },
  messages: {
    example: { id: "myid", groupid: "currentgroup", data: "message" },
  },
  leavegroup: {
    example: { id: "myid", groupid: "currentgroupid" },
  },
};

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index2.html"));
});

const auth = io.of("/auth").on("connection", (socket) => {
  console.log("connected /auth");
  socket.on("signin", async (message) => {
    const result = await client.query(`
      select Account{
      id,
      name,
      password,
    }filter Account.name="${message["username"]}" and Account.password="${message["password"]}"
    `);

    if (result.length != 0) {
      socket.emit("signin response", {
        event: 1,
        id: result[0]["id"],
        username: message["username"],
      }); //ok
    } else {
      socket.emit("signin response", { event: 2, id: null }); //not found
    }
  });

  socket.on("signup", async (message) => {
    const result = await client.query(`
      select Account{
      id,
      name,
      password,
    }filter Account.name="${message["username"]}" and Account.password="${message["password"]}"
    `);

    if (result.length != 0) {
      socket.emit("signup response", { event: 2, id: null }); //username taken
    } else {
      await client.execute(`insert Account{
        name:="${message["username"]}",
        password:="${message["password"]}"
      }`);
      const result = await client.query(`
        select Account{
        id,
        name,
        password,
      }filter Account.name="${message["username"]}" and Account.password="${message["password"]}"
      `);
      socket.emit("signup response", {
        event: 1,
        id: result[0]["id"],
        username: message["username"],
      }); //ok
    }
  });

  /*
  update Account
  filter Account.name="ben"
  set{
    joined 
    += (insert GroupServer{
        name:="1"
      })
  }   

  delete GroupServer filter .id = <uuid> "0124e79e-9118-11ef-b2a6-7b3d418c0a2a";
      
update GroupServer
filter .name = "1"
set{
  messages += (insert Messages{
    data := "3"
  })
}

  select Account{
  joined := (select GroupServer{
                 messages}
                 filter GroupServer.name = "1")}
  filter Account.name="ben"
  
  select GroupServer{
                 messages:=Messages{
                   
                   data
                 }
}
filter GroupServer.name = "1"

select Account{
  joined
}
filter .name="ben"
  
  */

  socket.conn.on("close", (reason) => {
    console.log("end /auth", reason);
  });
});

io.on("connection", (socket) => {
  console.log("connected /");

  socket.data.id = socket.handshake.query["id"];
  socket.data.username = socket.handshake.query["username"];

  socket.on("getgroups", async (message) => {
    const result = await client.query(`
      select Account{
      joined: {
        id,
        name,
        owner,
        image,
      }
    }
    filter .id= <uuid> "${message["id"]}"
    `);

    if (result[0]["joined"].length > 0) {
      for (const group of result[0]["joined"]) {
        socket.join(group["id"]);
        io.to(group["id"]).emit("newonlineuser", { id: group["id"] });
      }
    }
    if (result[0]["joined"].length > 0) {
      socket.emit("getgroups response", {
        event: 1,
        object: result[0]["joined"],
      });
    } else {
      socket.emit("getgroups response", {
        event: 1,
        object: [],
      });
    }
  });

  socket.on("addgroup", async (message) => {
    await client.execute(`
      with account := (select Account{id,name,avatar,} filter Account.id = <uuid> "${message["id"]}")
      update Account
      filter Account.id= <uuid> "${message["id"]}"
      set{
        joined += (
        insert GroupServer{
        name := "${message["name"]}", owner := "${message["id"]}",
        users := account
        }
        )
      }
      `);

    // set{users+=(insert Users{userid:="${message["id"]}",username:="${message["username"]}",canread:="true"})}
    console.log("added");
  });

  socket.on("joingroup", async (message) => {
    const result = await client.query(`
      select Account{joined} filter Account.id = <uuid> "${message["id"]}"
      `);

    var flag_found = false;
    try {
      for (const i of result[0]["joined"]) {
        console.log(i["id"], message["groupid"]);
        if (i["id"] == message["groupid"]) {
          flag_found = true;
        }
      }
    } catch {
      flag_found = false;
    }
    if (flag_found != true) {
      await client.execute(`
          with groups:= (select GroupServer filter GroupServer.id = <uuid> "${message["groupid"]}")
          update Account
          filter Account.id = <uuid> "${message["id"]}"
          set{
            joined += groups,
          }
          `);
      await client.execute(`
            with account:= (select Account filter Account.id = <uuid> "${message["id"]}")
            update GroupServer
            filter GroupServer.id = <uuid> "${message["groupid"]}"
            set{
              users += account,
            }
            `);
    }

    console.log(flag_found);
    /*await client.execute(`
        with account := (select Account{id,name,avatar,} filter Account.id = <uuid> "${message["id"]}")
        update GroupServer
        filter GroupServer.id = <uuid> "${message["groupid"]}"
        set {
          users += (insert account)
        }
      `);*/
    //console.log("added");
  });

  socket.on("deletegroup", async (message) => {
    await client.execute(`
      delete GroupServer filter .id = <uuid> "${message["id"]}"
      `);
    io.socketsLeave(message["id"]);
    console.log("deleted");
  });

  socket.on("removegroup", async (message) => {
    await client.execute(`
      with groups:= (select GroupServer filter GroupServer.id = <uuid> "${message["groupid"]}")
      update Account
      filter Account.id = <uuid> "${message["id"]}"
      set{
        joined -= groups,
      }
      `);
    await client.execute(`
        with account:= (select Account filter Account.id = <uuid> "${message["id"]}")
        update GroupServer
        filter GroupServer.id = <uuid> "${message["groupid"]}"
        set{
          users -= account,
        }
        `);
    //socket.leave(message["groupid"]);
    console.log("deleted");
  });

  socket.on("getusers", async (message) => {
    const result = await client.query(`
      select GroupServer{
        users : {
          id,
          name,
          avatar,
        }
      }
      filter GroupServer.id = <uuid> "${message["id"]}"
      `);

    socket.emit("getusers response", { event: 1, object: result[0]["users"] });
  });

  socket.on("getonlineusers", async (message) => {
    const OnlineUsers = [];
    try {
      const sockets = io.sockets.adapter.rooms.get(message["id"]);
      for (const i of sockets) {
        const id = io.sockets.sockets.get(i).handshake.query["id"];
        const name = io.sockets.sockets.get(i).handshake.query["username"];
        const result = await client.query(`
          select Account{
          avatar,
        }filter Account.id = <uuid> "${id}"
        `);
        const avatar = result[0]["avatar"];
        OnlineUsers.push({ id, name, avatar });
      }

      socket.emit("getonlineusers response", { object: OnlineUsers });
    } catch {}
  });

  socket.on("getmessages", async (message) => {
    const result = await client.query(`
      select GroupServer{
        messages : {
          id,
          data,
          postedby : {id,name,avatar},
        }
      }
      filter GroupServer.id = <uuid> "${message["id"]}"
      `);
    if (result[0]["messages"].length > 0) {
      socket.emit("getmessages response", {
        object: result[0]["messages"],
      });
    } else {
      socket.emit("getmessages response", {
        object: [],
      });
    }
  });

  socket.on("messages", async (message) => {
    const result = await client.query(`
      with account:= (select Account filter Account.id = <uuid> "${message["id"]}")
      update GroupServer
      filter GroupServer.id = <uuid> "${message["groupid"]}"
      set{messages += (insert Messages{
        data := "${message["data"]}",
        postedby := account
    })}
      `);
    console.log(result);
    io.to(message["groupid"]).emit("messages response", {
      id: message["groupid"],
    });
    /*
    io.to(message["groupid"]).emit("messages response", {
      id: message["groupid"],
      data: message["data"],
      postedby: {
        id: message["id"],
        name: message["username"],
        avatar: string | null,
      },
    });
    */
    console.log("mess added");
  });

  socket.on("test", (room) => {
    io.sockets.emit("feedback", `hello`);
    console.log(`backed feed`);
  });

  socket.conn.on("close", (reason) => {
    console.log("end /", reason);
    io.sockets.emit("discontinued");
  });
});

io.engine.on("connection_error", (err) => {
  console.log(">>", err.code); // the error code, for example 1
  console.log(">>", err.message); // the error message, for example "Session ID unknown"
  console.log(">>", err.context); // some additional error context
});

var port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log("server running at http://localhost:" + port);
});
