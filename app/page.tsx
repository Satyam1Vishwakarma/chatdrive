"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

import {
  CircleChevronLeft,
  CircleChevronRight,
  ExternalLink,
  List,
  MessageSquareDiff,
  Settings,
  Share2,
  SquareMinus,
  Trash2,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { deleteCookie, getCookie, hasCookie } from "cookies-next";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";
import ClickToCopy from "@/components/mycomponent/click to copy";

//aaaaaaaaaaaaaaaaaaaaaaaaaaa

const Motionavatar = motion.create(Avatar);

const tagss = Array.from({ length: 10 }).map(
  (_, _i, _a) => "https://github.com/shadcn.png"
);

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_URL || "http://localhost:3001";

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
        socket?.emit("getmessages", { id: getSelectedGroup });
      }
    });
  }, [getSelectedGroup]);

  useEffect(() => {
    socket?.on("getmessages response", (message: MessageResponse) => {
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
    socket?.on("getgroups response", (message: GroupResponse) => {
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }
    if (inputValue.trim()) {
      //setSubmittedValue(inputValue);
      socket?.emit("messages", {
        id: getCookie("id"),
        username: getCookie("username"),
        groupid: getSelectedGroup,
        data: inputValue,
      });
      setInputValue("");
      socket?.emit("getmessages", { id: getSelectedGroup });
      //socket?.emit("getmessages", { id: getSelectedGroup });
      //console.log("send --- got");
    }
  };

  //@typescript-eslint/no-explicit-any
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const formSchemaNewGroup = z.object({
    groupname: z
      .string()
      .min(3, {
        message: "Group name must be at least 3 characters.",
      })
      .max(10, { message: "Group name must be at most 10 characters." }),
  });

  const formNewGroup = useForm<z.infer<typeof formSchemaNewGroup>>({
    resolver: zodResolver(formSchemaNewGroup),
    defaultValues: {
      groupname: "",
    },
  });

  function onSubmitNewGroup(values: z.infer<typeof formSchemaNewGroup>) {
    setNewGroupDialog(false);
    socket?.emit("addgroup", {
      id: getCookie("id"),
      username: getCookie("username"),
      name: values.groupname,
    });
    setgotserverlist(false);
  }

  const formSchemaJoinGroup = z.object({
    groupid: z
      .string()
      .min(1, {
        message: "Check Group ID",
      })
      .max(100, {
        message: "Error",
      }),
  });

  const formJoinGroup = useForm<z.infer<typeof formSchemaJoinGroup>>({
    resolver: zodResolver(formSchemaJoinGroup),
    defaultValues: {
      groupid: "",
    },
  });

  function onSubmitJoinGroup(values: z.infer<typeof formSchemaJoinGroup>) {
    setJoinGroupDialog(false);
    socket?.emit("joingroup", {
      id: getCookie("id"),
      username: getCookie("username"),
      groupid: values.groupid,
    });
    setgotserverlist(false);
    setgotserverlist(false);
  }

  function listofusers_right() {
    return (
      <ScrollArea className="flex justify-center h-full">
        <CardDescription>Online</CardDescription>
        {onlineuserlist.map((value, index, array) => (
          <div key={index} className="py-3 pr-4">
            <Card className="flex justify-start gap-4 p-2 px-4">
              <div className="relative">
                <Avatar className="size-12">
                  <AvatarImage
                    src={
                      value.avatar === null
                        ? "https://github.com/shadcn.png"
                        : value.avatar
                    }
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 left-0">
                  <span
                    className="top-0 right-0 block h-3 w-3 rounded-full bg-green-700 ring-2 ring-white"
                    aria-label="Status indicator"
                  />
                </div>
              </div>
              <label className="flex items-center">{value.name}</label>
            </Card>
          </div>
        ))}
        <CardDescription>Members</CardDescription>
        {userlist.map((value, index, array) => (
          <div key={index} className="py-3 pr-4">
            <Card className="flex justify-start gap-4 p-2 px-5">
              <div className="">
                <Avatar className="size-12">
                  <AvatarImage
                    src={
                      value.avatar === null
                        ? "https://github.com/shadcn.png"
                        : value.avatar
                    }
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <label className="flex items-center justify-start">
                {value.name}
              </label>
            </Card>
          </div>
        ))}
      </ScrollArea>
    );
  }

  function list0fgroup_left() {
    return (
      <ScrollArea className="h-full w-full">
        {grouplist.map((value, index, array) => (
          <div key={index} className="px-5 py-5 flex justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Motionavatar
                    onClick={(_e) => {
                      setSelectedGroup(value.id);
                      if (value.owner == getCookie("id")) {
                        setServerOwner(true);
                      } else {
                        setServerOwner(false);
                      }
                      socket?.emit("getusers", { id: value.id });
                      socket?.emit("getonlineusers", {
                        id: value.id,
                      });
                      socket?.emit("getmessages", { id: value.id });
                      setOpenSheet(false);
                    }}
                    whileHover={{ scale: 1.06 }}
                    transition={{ type: "spring" }}
                    animate={{
                      scale: getSelectedGroup == value.id ? 1.04 : 1.0,
                      x: getSelectedGroup == value.id ? 5 : 0,
                    }}
                    className={`${
                      getSelectedGroup == value.id
                        ? "ring-4 shadow-lg shadow-black size-14 rounded-md"
                        : "ring-4 size-12"
                    }`}
                  >
                    <AvatarImage
                      src={
                        value.image == null
                          ? "https://avatars.githubusercontent.com/u/48099587"
                          : value.image
                      }
                    />
                    <AvatarFallback>Group</AvatarFallback>
                  </Motionavatar>
                </TooltipTrigger>
                <TooltipContent className="bg-yellow-400">
                  <p>{value.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}

        <div className="px-5 py-5 flex justify-center">
          <Dialog open={getNewGroupDialog} onOpenChange={setNewGroupDialog}>
            <DialogTrigger asChild>
              <MessageSquareDiff
                onClick={() => setNewGroupDialog(true)}
                className="size-11 rounded-full bg-gray-400 p-2 ring-4  hover:size-12"
              />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
                <DialogDescription>
                  <Form {...formNewGroup}>
                    <form
                      onSubmit={formNewGroup.handleSubmit(onSubmitNewGroup)}
                      className="space-y-8"
                    >
                      <FormField
                        control={formNewGroup.control}
                        name="groupname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Group Name</FormLabel>
                            <FormControl>
                              <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormDescription>
                              This is your public display name.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Create</Button>
                    </form>
                  </Form>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        <div className="px-5 py-5 pb-12 flex justify-center">
          <Dialog open={getJoinGroupDialog} onOpenChange={setJoinGroupDialog}>
            <DialogTrigger asChild>
              <ExternalLink
                onClick={() => setJoinGroupDialog(true)}
                className="size-11 rounded-full bg-gray-400 p-2 ring-4  hover:size-12"
              />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join A Group</DialogTitle>
                <DialogDescription>
                  <Form {...formJoinGroup}>
                    <form
                      onSubmit={formJoinGroup.handleSubmit(onSubmitJoinGroup)}
                      className="space-y-8"
                    >
                      <FormField
                        control={formJoinGroup.control}
                        name="groupid"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID</FormLabel>
                            <FormControl>
                              <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormDescription>ID of Group</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Join</Button>
                    </form>
                  </Form>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </ScrollArea>
    );
  }

  function listof_message() {
    return (
      <ScrollArea className="h-full w-full">
        {messages.map((value, index, array) => (
          <div
            key={index}
            className={
              "py-2 sm:px-20 max-sm:px-3 flex " +
              `${
                value.postedby.id == getCookie("id")
                  ? "justify-end"
                  : "justify-start"
              }`
            }
          >
            <Card className="w-min pt-4 px-4 pb-2">
              <div className="flex">
                <Avatar>
                  <AvatarImage
                    src={
                      value.postedby.avatar == null
                        ? "https://github.com/shadcn.png"
                        : value.postedby.avatar
                    }
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <CardDescription className="px-3">
                  {value.postedby.name}
                </CardDescription>
              </div>

              <CardHeader className="py-3">{value.data}</CardHeader>
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>
    );
  }

  function group_setting() {
    return (
      <div className="gap-5 flex justify-center items-center">
        <div>
          <Drawer>
            <DrawerTrigger className={`${isServerOwner ? "hidden" : null}`}>
              <SquareMinus />
            </DrawerTrigger>
            <DrawerContent>
              <center className="px-20">
                <DrawerHeader>
                  <DrawerTitle>Leave Group</DrawerTitle>
                  <DrawerDescription>Click Leave</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      socket?.emit("removegroup", {
                        id: getCookie("id"),
                        groupid: getSelectedGroup,
                      });
                      setgotserverlist(false);
                      setSelectedGroup("");
                    }}
                  >
                    Leave
                  </Button>
                  <DrawerClose>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </center>
            </DrawerContent>
          </Drawer>
        </div>

        <div>
          <Drawer>
            <DrawerTrigger>
              <Settings />
            </DrawerTrigger>
            <DrawerContent>
              <center className="px-20">
                <DrawerHeader>
                  <DrawerTitle>Group Settings</DrawerTitle>
                  <DrawerDescription>Change Settings Here</DrawerDescription>
                  <Label className="pt-7">Goup Name</Label>
                  <Input placeholder="name"></Input>
                </DrawerHeader>
                <DrawerFooter>
                  <Button>Submit</Button>
                  <DrawerClose>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </center>
            </DrawerContent>
          </Drawer>
        </div>

        <div>
          <Drawer>
            <DrawerTrigger className={`${isServerOwner ? null : "hidden"}`}>
              <Trash2 />
            </DrawerTrigger>
            <DrawerContent>
              <center className="px-20">
                <DrawerHeader>
                  <DrawerTitle>Delete Group</DrawerTitle>
                  <DrawerDescription>Confirm</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <DrawerClose>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        socket?.emit("deletegroup", { id: getSelectedGroup });
                        setgotserverlist(false);
                        socket?.emit("deletegroup", { id: getSelectedGroup });
                        setgotserverlist(false);
                        setSelectedGroup("");
                      }}
                    >
                      Delete Group
                    </Button>
                    <div className="px-2 py-2"></div>
                    <Button>Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </center>
            </DrawerContent>
          </Drawer>
        </div>

        <div>
          <Drawer>
            <DrawerTrigger>
              <Share2 />
            </DrawerTrigger>
            <DrawerContent>
              <center className="px-20">
                <DrawerHeader>
                  <DrawerTitle>Share Group</DrawerTitle>
                  <DrawerDescription>Copy Here</DrawerDescription>
                  <Label className="pt-7">
                    <ClickToCopy text={getSelectedGroup}></ClickToCopy>
                  </Label>
                </DrawerHeader>
                <DrawerFooter>
                  <DrawerClose>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </center>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    );
  }

  function left_sheet() {
    return (
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger asChild>
          <Button className="invisible max-sm:visible rounded-full">
            <CircleChevronLeft />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="flex justify-center w-min">
          {list0fgroup_left()}
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
          {listofusers_right()}
        </SheetContent>
      </Sheet>
    );
  }

  function send_message_card() {
    return (
      <Card className="rounded-3xl shadow-xl shadow-black flex">
        <form className="flex gap-4 p-5 items-center" onSubmit={handleSubmit}>
          <Button
            type="button"
            className="flex"
            onClick={() => {
              //socket?.emit("getmessages", { id: getSelectedGroup });
              deleteCookie("id");
              deleteCookie("username");
              setcookie(false);
            }}
          >
            Logout
          </Button>
          <Input
            className="rounded-2xl"
            id="userInput"
            type="text"
            placeholder="Type here..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />

          <Button className="rounded-2xl" type="submit">
            Send
          </Button>
        </form>
      </Card>
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
              {<Card className="h-full">{list0fgroup_left()}</Card>}
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
              {<Card className="h-full">{list0fgroup_left()}</Card>}
            </div>
            <div className="w-full h-full">
              <div className="h-full w-full">
                <div className="flex h-full w-full flex-col justify-between">
                  <div className="p-3 flex justify-between">
                    {left_sheet()}
                    <Card className="p-3 gap-3 rounded-2xl">
                      {group_setting()}
                    </Card>
                    {right_sheet()}
                  </div>
                  <div className="h-[75.4%] w-full">{listof_message()}</div>
                  <div className="mb-4 px-5 p-3 flex justify-center">
                    {send_message_card()}
                  </div>
                </div>
              </div>
            </div>
            <div className="max-lg:hidden">
              <Card className="p-7 h-full py-4">{listofusers_right()}</Card>
            </div>
          </div>
        );
      }
    }
  }
}
