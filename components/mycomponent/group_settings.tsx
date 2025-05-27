import { Settings, Share2, SquareMinus, Trash2 } from "lucide-react";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import ClickToCopy from "./click to copy";
import { getCookie } from "cookies-next";

export default function GroupSetting({isServerOwner,socket,getSelectedGroup,setgotserverlist,setSelectedGroup}:{isServerOwner:any,socket:any,getSelectedGroup:any,setgotserverlist:any,setSelectedGroup:any}) {
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