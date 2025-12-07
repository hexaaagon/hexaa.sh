"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

export function AgeCalc() {
  const [age, _setAge] = useState(ageCalc());

  return (
    <Tooltip>
      <TooltipTrigger className="underline decoration-dashed">
        {Math.floor(age)}-year-old
      </TooltipTrigger>
      <TooltipContent>
        <p>{age.toFixed(9)}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function ageCalc() {
  const birthDate = new Date("2010-08-02T00:00:00+07:00");
  const now = new Date();

  const ageInMilliseconds = now.getTime() - birthDate.getTime();
  const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

  return ageInYears;
}
