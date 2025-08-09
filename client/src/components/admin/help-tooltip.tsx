import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HelpTooltipProps {
  children: ReactNode;
  content: string;
  icon?: boolean;
}

export default function HelpTooltip({ children, content, icon = false }: HelpTooltipProps) {
  if (icon) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" className="text-gray-400 hover:text-gray-300 ml-1">
              <i className="fas fa-question-circle text-sm"></i>
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 border-gray-600 text-gray-100 max-w-xs">
            <p className="text-sm">{content}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className="bg-gray-800 border-gray-600 text-gray-100 max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}