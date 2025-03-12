import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';


export const CoolSelector = ({
    data,
    placeholder,
    value,
    searchText,
    onChange,
    disabled
}: {
    data: string[];
    placeholder: string;
    value: string,
    searchText?: string,
    onChange: (value: string) => void;
    disabled: boolean;
}) => {
    const [open, setOpen] = useState(false);

    return <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                disabled={disabled}
                className="w-[100%] justify-between"
            >
                {
                    value || placeholder
                }
            </Button>

        </PopoverTrigger>
        <PopoverContent className="w-[100%] p-0">
            <Command>
                <CommandInput placeholder={searchText ? `${searchText}` : 'Search...'} className='h-9' />
                <CommandList>
                    <CommandEmpty>Not found.</CommandEmpty>
                    <CommandGroup>
                        {data.map((item) => (
                            <CommandItem
                                key={item}
                                value={item}
                                onSelect={(currentValue) => {
                                    onChange(currentValue === value ? "" : currentValue);
                                    setOpen(false);
                                }}
                            >
                                {item}
                                <Check
                                    className={cn(
                                        "ml-auto",
                                        value === item ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>;
};
