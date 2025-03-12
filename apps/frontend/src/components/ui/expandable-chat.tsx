"use client";

import { cn } from "@/lib/utils";
import React, { useRef } from "react";


interface ExpandableChatProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ExpandableChat: React.FC<ExpandableChatProps> = ({
  children,
  ...props
}) => {
  const chatRef = useRef<HTMLDivElement>(null);

  return (
    <div
      {...props}
    >
      <div
        ref={chatRef}
        className={cn(
          "flex flex-col bg-background border sm:rounded-lg shadow-md overflow-hidden transition-all duration-250 ease-out inset-0 h-full sm:inset-auto",
        )}
      >
        {children}
      </div>
    </div>
  );
};

ExpandableChat.displayName = "ExpandableChat";

const ExpandableChatHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex items-center justify-between p-4 border-b", className)}
    {...props}
  />
);

ExpandableChatHeader.displayName = "ExpandableChatHeader";

const ExpandableChatBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = React.forwardRef(({
  className,
  ...props
}, ref: React.ForwardedRef<HTMLDivElement>) => <div className={cn("flex-grow overflow-y-auto", className)} ref={ref} {...props} />);

ExpandableChatBody.displayName = "ExpandableChatBody";

const ExpandableChatFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn("p-4", className)} {...props} />;

ExpandableChatFooter.displayName = "ExpandableChatFooter";


export {
  ExpandableChat, ExpandableChatBody,
  ExpandableChatFooter, ExpandableChatHeader
};

