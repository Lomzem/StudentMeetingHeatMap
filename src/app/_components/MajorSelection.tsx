"use client";

import { getMajors } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Major } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import GenerateHeatmapButton from "./GenerateHeatmapButton";

export default function MajorSelection({
  selected,
  setSelected,
  onGenerateClick,
  isGenerating,
}: {
  selected: Major[];
  setSelected: (majors: Major[]) => void;
  onGenerateClick: () => void;
  isGenerating: boolean;
}) {
  const { data: majors = [] } = useQuery({
    queryKey: ["majors"],
    queryFn: () => getMajors(),
  });

  const [openPopover, setOpenPopover] = useState(false);
  const [removingMajors, setRemovingMajors] = useState<Major[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const CommandInputRef = useRef<HTMLInputElement>(null);
  const CommandListRef = useRef<HTMLDivElement>(null);

  const removeSelection = useCallback(
    (major: Major) => {
      setRemovingMajors([...removingMajors, major]);

      setTimeout(() => {
        setSelected(selected.filter((s) => s.id !== major.id));
        setRemovingMajors(removingMajors.filter((m) => m.id !== major.id));
      }, 100);
    },
    [selected, removingMajors, setSelected],
  );

  const updateSelection = useCallback(
    (major: Major) => {
      if (selected.includes(major)) {
        removeSelection(major);
      } else {
        setSelected([...selected, major]);
      }

      setTimeout(() => {
        CommandInputRef.current?.focus();
      }, 0);
    },
    [selected, removeSelection, setSelected],
  );

  useEffect(() => {
    if (CommandListRef.current) {
      CommandListRef.current.scrollTop = 0;
    }
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-2 items-center">
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            aria-expanded={openPopover}
            variant="outline"
            className="min-w-max hover:cursor-pointer w-xs"
          >
            {selected.length === 0 && "Click here to select!"}
            {selected.length === 1 && `Selected ${selected.length} major`}
            {selected.length > 1 && `Selected ${selected.length} majors`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-xs">
          <Command>
            <CommandInput
              ref={CommandInputRef}
              placeholder="Search majors..."
              onValueChange={setSearchQuery}
            />
            <CommandList ref={CommandListRef}>
              <CommandEmpty>No majors found.</CommandEmpty>
              {majors.map((major) => (
                <CommandItem
                  key={major.id}
                  value={`${major.abbr}${major.name}`}
                  onSelect={() => updateSelection(major)}
                  className="cursor-pointer"
                >
                  {selected.includes(major) ? (
                    <Check className="text-muted-foreground" />
                  ) : (
                    <Check className="opacity-0" />
                  )}
                  {`${major.name} (${major.abbr})`}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex gap-4">
        <GenerateHeatmapButton
          onClick={onGenerateClick}
          isLoading={isGenerating}
        />
        <Button
          variant="destructive"
          className={cn(
            "duration-100",
            selected.length > 0
              ? "opacity-100 hover:bg-destructive/80"
              : "opacity-25 hover:bg-destructive",
          )}
          onMouseDown={() => {
            setRemovingMajors([...selected]);
            setTimeout(() => {
              setSelected([]);
              setRemovingMajors([]);
            }, 200);
          }}
        >
          Clear Majors
        </Button>
      </div>

      {selected.length === 0 && <Badge className="opacity-0">Spacer</Badge>}

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center max-w-[72rem]">
          {selected.map((major) => (
            <Badge
              key={major.id}
              variant="secondary"
              className={cn(
                "cursor-pointer transition-all duration-200",
                removingMajors.includes(major)
                  ? "opacity-0 scale-95"
                  : "opacity-100 hover:opacity-75 hover:line-through",
              )}
              title={`Remove ${major.name}`}
              onMouseDown={() => removeSelection(major)}
            >
              {major.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
