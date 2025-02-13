"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RiCheckLine, RiFileCopyLine } from "@remixicon/react";

interface ActionExample {
  title: string;
  description: string;
  examples: string[];
}

const actions: ActionExample[] = [
  {
    title: "Thirdweb Operations",
    description: "Perform actions using ThirdWeb Nebula API",
    examples: ["Deploy an ERC20 Token", "USDC Contract Address on Ethereum"],
  },
];

export default function About() {
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [text]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [text]: false }));
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="space-y-6 bg-white">
      <div className="space-y-4">
        {actions.map((action, index) => (
          <Card key={index} className="p-4 space-y-3">
            <div className="space-y-1">
              <h3 className="font-medium">{action.title}</h3>
              <p className="text-sm text-muted-foreground">
                {action.description}
              </p>
            </div>

            <div className="space-y-2">
              {action.examples.map((example, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-muted p-2 rounded-md">
                    {example}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(example)}
                    className="h-8 w-8"
                  >
                    {copiedStates[example] ? (
                      <RiCheckLine className="h-4 w-4" />
                    ) : (
                      <RiFileCopyLine className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="text-xs text-muted-foreground">
        <p>All operations are executed automatically once confirmed.</p>
        <p>Supported networks: Sepolia, Base</p>
      </div>
    </div>
  );
}
