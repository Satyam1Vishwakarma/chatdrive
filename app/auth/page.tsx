"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCookie, setCookie } from "cookies-next";

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_URL || "http://localhost:3001";

const BACK_ML = process.env.NEXT_PUBLIC_URL_ML || "http://localhost:8000";

export default function ProfileForm() {
  const [get, set] = useState<String>("signin");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connect, setConnect] = useState(false);
  const router = useRouter();

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

  const connectSocket = useCallback(() => {
    const newSocket = io(SOCKET_SERVER_URL + "/auth");

    interface Message {
      event: number;
      id: number;
      username: String;
    }

    newSocket.on("connect", () => {
      setConnect(true);
    });

    newSocket.on("signin response", (message: Message) => {
      if (message["event"] == 1) {
        toast("Record Found", {
          description: "Logging In",
          action: {
            label: "Undo",
            onClick: () => null,
          },
        });
        setCookie("id", message["id"]);
        setCookie("username", message["username"]);
        router.push("/");
      } else if (message["event"] == 2) {
        toast("No Record Found", {
          description: "Please SignUp",
          action: {
            label: "Undo",
            onClick: () => null,
          },
        });
      }
    });

    newSocket.on("signup response", (message: Message) => {
      if (message["event"] == 1) {
        toast("Record Added", {
          description: "Logging In",
          action: {
            label: "Undo",
            onClick: () => null,
          },
        });
        setCookie("id", message["id"]);
        setCookie("username", message["username"]);
        router.push("/");
      } else if (message["event"] == 2) {
        toast("Username Taken", {
          description: "Choose New Username",
          action: {
            label: "Undo",
            onClick: () => null,
          },
        });
      }
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

  const formSchema = z.object({
    username: z
      .string()
      .min(3, {
        message: "Username must be at least 3 characters.",
      })
      .max(12, { message: "Username must be at most 12 characters." }),
    password: z.string().min(4, {
      message: "Password must be at least 4 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    //toast("Event", {
    //  description: "Logging In",
    //  action: {
    //    label: "Undo",
    //    onClick: () => null,
    //  },
    //});
    //toast(JSON.stringify(values));
    //socket.emit("signinup", values);

    if (get == "signin") {
      socket?.emit("signin", values);
    } else if (get == "signup") {
      socket?.emit("signup", values);
    }
  }

  function FormUI() {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="123" {...field} />
                </FormControl>
                <FormDescription>Choose wisely.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  }

  if (connect == true) {
    return (
      <Tabs
        defaultValue="signin"
        className="flex flex-col items-center h-full justify-center px-5 bg-gradient-to-br from-indigo-100 to-pink-100"
        onValueChange={set}
      >
        <TabsList className="flex justify-center w-fit">
          <TabsTrigger
            onClick={() => {
              set("signin");
            }}
            value="signin"
          >
            SignIn
          </TabsTrigger>
          <TabsTrigger
            onClick={() => {
              set("signup");
            }}
            value="signup"
          >
            SignUp
          </TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <Card className="px-12">
            <CardHeader>
              <CardTitle>SignIn</CardTitle>
              <CardDescription>Signin to access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">{FormUI()}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card className="px-12">
            <CardHeader>
              <CardTitle>SignUp</CardTitle>
              <CardDescription>Signup to access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">{FormUI()}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  } else {
    return (
      <div className="h-full w-full flex justify-center items-center text-9xl max-sm:text-6xl">
        Connecting...
      </div>
    );
  }
}
