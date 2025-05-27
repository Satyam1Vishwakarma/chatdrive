import { AvatarImage } from "@radix-ui/react-avatar";
import { ScrollArea } from "../ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ExternalLink, MessageSquareDiff } from "lucide-react";
import { getCookie } from "cookies-next";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
const Motionavatar = motion.create(Avatar);

export default function ListOfGroups({
  grouplist,
  setSelectedGroup,
  setServerOwner,
  socket,
  setOpenSheet,
  getSelectedGroup,
  getNewGroupDialog,
  setNewGroupDialog,
  getJoinGroupDialog,
  setJoinGroupDialog,
  setgotserverlist,
}: {
  grouplist: any;
  setSelectedGroup: any;
  setServerOwner: any;
  socket: any;
  setOpenSheet: any;
  getSelectedGroup: any;
  getNewGroupDialog: any;
  setNewGroupDialog: any;
  getJoinGroupDialog: any;
  setJoinGroupDialog: any;
  setgotserverlist: any;
}) {
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

  return (
    <ScrollArea className="h-full w-full">
      {grouplist.map((value: any, index: any) => (
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
