import { getCookie } from "cookies-next";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardDescription, CardHeader } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

export default function Messages({
  messages,
  messagesEndRef,
}: {
  messages: any;
  messagesEndRef: any;
}) {
  return (
    <ScrollArea className="h-full w-full">
      {messages.map((value: any, index: any) => (
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
          <Card
            className={
              "w-min pt-4 px-4 pb-2 " +
              `${value.bad == 1 ? "border border-red-800" : "border-none"}`
            }
          >
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
