import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { deleteCookie, getCookie } from "cookies-next";

export default function SendMessageCard({setcookie,setInputValue,inputValue,socket,getSelectedGroup}:{setcookie: any,setInputValue:any,inputValue:any,socket:any,getSelectedGroup:any}) {
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
