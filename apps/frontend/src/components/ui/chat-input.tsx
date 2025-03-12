import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import * as React from "react";

interface ChatInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    form: any;
    className?: string;
    handleSubmit: (payload: { prompt: string; }) => Promise<void>;
}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
    ({ className, form, handleSubmit, ...props }, ref) => (
        <Textarea
            autoComplete="off"
            ref={ref}
            name="message"
            className={cn(
                "max-h-12 px-4 py-3 bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md flex items-center h-16 resize-none",
                className,
            )}
            {...props}
            {...form.register('prompt')}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    form.handleSubmit((data: { prompt: string; }) => handleSubmit(data))();
                    form.reset();
                }
            }}
        />
    ),
);
ChatInput.displayName = "ChatInput";

export { ChatInput };
