"use client";

import { useQueryState } from "nuqs";
import { InfoIcon, SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "./ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const SearchBox = () => {
  const [query, setQuery] = useQueryState("query", {
    defaultValue: "",
    history: "replace",
  });

  return (
    <section className="flex items-center justify-center">
      <InputGroup className="max-w-xl">
        <InputGroupInput
          placeholder="Search..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>

        <InputGroupAddon align="inline-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <InputGroupButton className="rounded-full" size="icon-xs">
                <InfoIcon />
              </InputGroupButton>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-1">
                <p className="font-semibold">Search Tips</p>
                <ul className="list-inside space-y-1 text-xs">
                  <li>• Type a book title or author name</li>
                  <li>• Add books to your wishlist</li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </InputGroupAddon>
      </InputGroup>
    </section>
  );
};
