"use client";
import { Card } from "@/components/ui/card";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { CircleChevronLeft, CircleChevronRight } from "lucide-react";

import { getCookie, hasCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import SendMessageCard from "@/components/mycomponent/send_message_card";
import ListOfUsers from "@/components/mycomponent/list_of_users";
import ListOfGroups from "@/components/mycomponent/list_of_groups";
import GroupSetting from "@/components/mycomponent/group_settings";
import Messages from "@/components/mycomponent/messages";

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_URL || "http://localhost:3001";

const BACK_ML = process.env.NEXT_PUBLIC_URL_ML || "http://localhost:8000";

export default function Chat() {
  const [getSelectedGroup, setSelectedGroup] = useState<string>("");

  const [isLoading, setLoading] = useState(true);

  const [openSheet, setOpenSheet] = useState(false);

  const [inputValue, setInputValue] = useState("");

  const [getcookie, setcookie] = useState(true);

  const [getNewGroupDialog, setNewGroupDialog] = useState(false);
  const [getJoinGroupDialog, setJoinGroupDialog] = useState(false);

  const [socket, setSocket] = useState<Socket | null>(null);

  const [gotserverlist, setgotserverlist] = useState(false);
  const router = useRouter();

  const [grouplist, setgrouplist] = useState<Array<GroupResponseObject>>([]);
  const [userlist, setuserlist] = useState<Array<UserResponseObject>>([]);
  const [onlineuserlist, setonlineuserlist] = useState<
    Array<UserResponseObject>
  >([]);
  const [messages, setmessages] = useState<Array<MessagesResponseObject>>([]);

  const [isServerOwner, setServerOwner] = useState(false);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  interface GroupResponseObject {
    id: string;
    owner: String;
    name: string;
    image: string | null;
  }

  interface UserResponseObject {
    id: string;
    name: string;
    avatar: string | null;
  }

  interface MessagesResponseObject {
    m_id: string;
    data: string;
    postedby: {
      id: string;
      name: string;
      avatar: string | null;
    };
  }

  useEffect(() => {
    if (hasCookie("id")) {
      setcookie(true);
    } else {
      router.push("/auth");
    }
  }, [getcookie]);

  useEffect(() => {
    const fetchPrediction = async () => {
      const result = await fetch(BACK_ML, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: "http://example.com" }),
      });
    };

    fetchPrediction();
  }, []);

  interface GroupResponse {
    event: String;
    object: Array<GroupResponseObject>;
  }
  interface UserResponse {
    event: String;
    object: Array<UserResponseObject>;
  }
  interface MessageResponse {
    event: String;
    object: Array<MessagesResponseObject>;
  }

  const connectSocket = useCallback(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      query: {
        id: getCookie("id"),
        username: getCookie("username"),
      },
    });

    newSocket.on("connect_error", (err) => {
      console.log(">>", err.message);
    });

    newSocket.on("getusers response", (message: UserResponse) => {
      if (message["event"] == "1") {
        setuserlist(message.object);
      }
    });

    newSocket.on("getonlineusers response", (message: UserResponse) => {
      console.log(message);
      var mess = new Array(message.object);
      setonlineuserlist(mess[0]);
      socket?.emit("getusers", { id: getSelectedGroup });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [SOCKET_SERVER_URL]);

  useEffect(() => {
    const cleanup = connectSocket();
    return () => {
      cleanup();
      setSocket(null);
    };
  }, [connectSocket]);

  useEffect(() => {
    if (!gotserverlist) {
      socket?.emit("getgroups", { id: getCookie("id") });
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket?.on("messages response", (message) => {
      if (message["id"] == getSelectedGroup) {
        //socket?.emit("getmessages", { id: getSelectedGroup });
        //console.log(message)
        setmessages((prevMessages) => [...prevMessages, message]);
      }
    });
  }, [getSelectedGroup]);

  useEffect(() => {
    socket?.on("getmessages response", (message: MessageResponse) => {
      //console.log(message);
      //console.log("lol");
      // var t = 0;
      //var prev = messages.length;
      var mess = new Array(message.object);
      setmessages(mess[0]);
      //var curr = message.object.length;
      //console.log("---", prev, "===", curr);
      //if (prev == curr && t < 2) {
      //  console.log("looping");
      //socket?.emit("getmessages", { id: getSelectedGroup });
      //  t = t + 1;
      //}
    });
  }, [getSelectedGroup, messages]);

  useEffect(() => {
    socket?.on("discontinued", () => {
      if (getSelectedGroup != "") {
        socket?.emit("getonlineusers", {
          id: getSelectedGroup,
        });
      }

      console.log("disconnected");
    });
  }, [getSelectedGroup]);

  useEffect(() => {
    socket?.on("connect", () => {
      if (getSelectedGroup != "") {
        socket?.emit("getonlineusers", {
          id: getSelectedGroup,
        });
        socket?.emit("getusers", { id: getSelectedGroup });
        socket?.emit("getmessages", { id: getSelectedGroup });
      }
    });
  }, [getSelectedGroup]);

  useEffect(() => {
    socket?.on("getgroups response", async (message: GroupResponse) => {
      if (message["event"] == "1") {
        setgotserverlist(true);
        var mess = new Array(message.object);
        setgrouplist(mess[0]);
        setLoading(false);
      }
    });
  });

  useEffect(() => {
    socket?.on("newonlineuser", (message) => {
      if (message["id"] == getSelectedGroup) {
        socket?.emit("getonlineusers", {
          id: getSelectedGroup,
        });
        console.log("new joined");
      }
    });

    socket?.on("getonlineusers response", (message: UserResponse) => {
      console.log(message);
      var mess = new Array(message.object);
      setonlineuserlist(mess[0]);
      socket?.emit("getusers", { id: getSelectedGroup });
    });
  }, [getSelectedGroup]);

  function left_sheet() {
    return (
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger asChild>
          <Button className="invisible max-sm:visible rounded-full">
            <CircleChevronLeft />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="flex justify-center w-min">
          <ListOfGroups
            grouplist={grouplist}
            setSelectedGroup={setSelectedGroup}
            setServerOwner={setServerOwner}
            socket={socket}
            setOpenSheet={setOpenSheet}
            getSelectedGroup={getSelectedGroup}
            getNewGroupDialog={getNewGroupDialog}
            setNewGroupDialog={setNewGroupDialog}
            getJoinGroupDialog={getJoinGroupDialog}
            setJoinGroupDialog={setJoinGroupDialog}
            setgotserverlist={setgotserverlist}
          />
        </SheetContent>
      </Sheet>
    );
  }

  function right_sheet() {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button className="invisible max-lg:visible rounded-full">
            <CircleChevronRight />
          </Button>
        </SheetTrigger>
        <SheetContent side={"right"} className="flex justify-center w-min">
          <ListOfUsers onlineuserlist={onlineuserlist} userlist={userlist} />
        </SheetContent>
      </Sheet>
    );
  }

  if (getcookie) {
    if (isLoading) {
      return (
        <div className="h-full w-full flex justify-center items-center text-9xl max-sm:text-6xl">
          Loading.......
        </div>
      );
    } else {
      if (getSelectedGroup == "") {
        return (
          <div className="flex flex-row h-full w-full">
            <div className="w-min h-full max-sm:hidden">
              <Card className="h-full">
                <ListOfGroups
                  grouplist={grouplist}
                  setSelectedGroup={setSelectedGroup}
                  setServerOwner={setServerOwner}
                  socket={socket}
                  setOpenSheet={setOpenSheet}
                  getSelectedGroup={getSelectedGroup}
                  getNewGroupDialog={getNewGroupDialog}
                  setNewGroupDialog={setNewGroupDialog}
                  getJoinGroupDialog={getJoinGroupDialog}
                  setJoinGroupDialog={setJoinGroupDialog}
                  setgotserverlist={setgotserverlist}
                />
              </Card>
            </div>
            <div className="w-full h-full">
              <div className="h-full w-full">
                <div className="flex h-full w-full flex-col justify-between">
                  <div className="p-3 flex justify-between">
                    {left_sheet()}
                    <div>{}</div>
                    {}
                  </div>
                  <div className="h-[75.7%] w-full flex justify-center items-center text-4xl">
                    Select A Group...
                  </div>
                  <div className="mb-4 px-5 p-3 flex justify-center">{}</div>
                </div>
              </div>
            </div>
            <div className="max-lg:hidden">
              <Card className="p-7 h-full py-4">{}</Card>
            </div>
          </div>
        );
      } else {
        return (
          <div className="flex flex-row h-full w-full">
            <div className="w-min h-full max-sm:hidden">
              <Card className="h-full">
                <ListOfGroups
                  grouplist={grouplist}
                  setSelectedGroup={setSelectedGroup}
                  setServerOwner={setServerOwner}
                  socket={socket}
                  setOpenSheet={setOpenSheet}
                  getSelectedGroup={getSelectedGroup}
                  getNewGroupDialog={getNewGroupDialog}
                  setNewGroupDialog={setNewGroupDialog}
                  getJoinGroupDialog={getJoinGroupDialog}
                  setJoinGroupDialog={setJoinGroupDialog}
                  setgotserverlist={setgotserverlist}
                />
              </Card>
            </div>
            <div className="w-full h-full">
              <div className="h-full w-full">
                <div className="flex h-full w-full flex-col justify-between">
                  <div className="p-3 flex justify-between">
                    {left_sheet()}
                    <Card className="p-3 gap-3 rounded-2xl">
                      <GroupSetting
                        isServerOwner={isServerOwner}
                        socket={socket}
                        getSelectedGroup={getSelectedGroup}
                        setgotserverlist={setgotserverlist}
                        setSelectedGroup={setSelectedGroup}
                      />
                    </Card>
                    {right_sheet()}
                  </div>
                  <div className="h-[75.4%] w-full">
                    <Messages
                      messages={messages}
                      messagesEndRef={messagesEndRef}
                    />
                  </div>
                  <div className="mb-4 px-5 p-3 flex justify-center">
                    <SendMessageCard
                      setcookie={setcookie}
                      setInputValue={setInputValue}
                      inputValue={inputValue}
                      socket={socket}
                      getSelectedGroup={getSelectedGroup}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="max-lg:hidden">
              <Card className="p-7 h-full py-4">
                <ListOfUsers
                  onlineuserlist={onlineuserlist}
                  userlist={userlist}
                />
              </Card>
            </div>
          </div>
        );
      }
    }
  }
}
