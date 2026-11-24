import { useEffect, useRef, useState } from "react";
import { Clock3 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

const hours = Array.from({ length: 24 }, (_, index) => index);
const minutes = Array.from({ length: 60 }, (_, index) => index);

function formatTimePart(value: number) {
  return value.toString().padStart(2, "0");
}

export function TimePicker({ id, value, onChange }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [hourValue, minuteValue] = value.split(":").map(Number);
  const selectedHour = value ? hourValue : null;
  const selectedMinute = value ? minuteValue : null;
  const hourRef = useRef<HTMLButtonElement>(null);
  const minuteRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      hourRef.current?.scrollIntoView({ block: "center" });
      minuteRef.current?.scrollIntoView({ block: "center" });
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const updateTime = (hour: number, minute: number) => {
    onChange(`${formatTimePart(hour)}:${formatTimePart(minute)}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          className="flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span>{value || "--:--"}</span>
          <Clock3 className="size-4 text-muted-foreground" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-44 rounded-lg border-border bg-popover p-2"
        aria-label="Opções de horário"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          requestAnimationFrame(() => {
            (hourRef.current ?? minuteRef.current)?.focus();
          });
        }}
      >
        <div className="mb-2 grid grid-cols-2 gap-2 text-center text-xs font-medium text-muted-foreground">
          <span>Hora</span>
          <span>Minuto</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ScrollArea className="h-44 rounded-md border border-border">
            <div className="space-y-1 p-1">
              {hours.map((hour) => (
                <button
                  key={hour}
                  ref={
                    selectedHour === hour || (selectedHour === null && hour === 0) ? hourRef : null
                  }
                  type="button"
                  aria-label={`Hora ${formatTimePart(hour)}`}
                  aria-pressed={selectedHour === hour}
                  onClick={() => updateTime(hour, selectedMinute ?? 0)}
                  className={cn(
                    "w-full rounded-md py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selectedHour === hour &&
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                  )}
                >
                  {formatTimePart(hour)}
                </button>
              ))}
            </div>
          </ScrollArea>
          <ScrollArea className="h-44 rounded-md border border-border">
            <div className="space-y-1 p-1">
              {minutes.map((minute) => (
                <button
                  key={minute}
                  ref={
                    selectedMinute === minute || (selectedMinute === null && minute === 0)
                      ? minuteRef
                      : null
                  }
                  type="button"
                  aria-label={`Minuto ${formatTimePart(minute)}`}
                  aria-pressed={selectedMinute === minute}
                  onClick={() => updateTime(selectedHour ?? 0, minute)}
                  className={cn(
                    "w-full rounded-md py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selectedMinute === minute &&
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                  )}
                >
                  {formatTimePart(minute)}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
