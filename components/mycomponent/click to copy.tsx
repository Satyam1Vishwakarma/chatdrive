"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";

interface ClickToCopyProps {
  text: string;
}

export default function ClickToCopy(
  { text }: ClickToCopyProps = { text: "Hello, world!" }
) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast("Copied!", {
        description: "copied to clipboard.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast("Error", { description: "Failed to copy text to clipboard." });
    }
  };

  return (
    <div className="flex items-center space-x-2 max-w-md">
      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold flex-grow">
        {text}
      </code>
      <Button
        variant="outline"
        size="icon"
        onClick={copyToClipboard}
        className="h-8 w-8"
      >
        {isCopied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        <span className="sr-only">Copy to clipboard</span>
      </Button>
    </div>
  );
}
