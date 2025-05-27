import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardDescription } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

export default function ListOfUsers({
  onlineuserlist,
  userlist,
}: {
  onlineuserlist: any;
  userlist: any;
}) {
  return (
    <ScrollArea className="flex justify-center h-full">
      <CardDescription>Online</CardDescription>
      {onlineuserlist.map((value: any, index: any) => (
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
      {userlist.map((value: any, index: any) => (
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
