'use client';

import { Check, ChevronsUpDown } from "lucide-react";
import { cx } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import useChatStore from "@/lib/hooks/use-chat-store";
import { models } from "@/lib/hooks/use-chat-store";

export function ModelSelector() {
    const [open, setOpen] = useState(false);
    const selectedModel = useChatStore((state) => state.selectedModel);
    const setSelectedModel = useChatStore((state) => state.setSelectedModel);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-colors"
                >
                    {selectedModel.label}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-white">
                <Command>
                    <CommandInput placeholder="Select Model" />
                    <CommandEmpty>No model found.</CommandEmpty>
                    <CommandGroup>
                        {models.map((model) => (
                            <CommandItem
                                key={model.value}
                                value={model.value}
                                onSelect={() => {
                                    setSelectedModel(model);
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cx(
                                        "mr-2 h-4 w-4",
                                        selectedModel.value === model.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {model.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}