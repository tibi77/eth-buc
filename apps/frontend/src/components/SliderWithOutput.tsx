import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface SliderWithOutputProps {
  readonly value: number[];
  readonly onValueChange: (value: number[]) => void;
  readonly onValueCommit?: (value: number[]) => void;
  readonly title: string;
  readonly min: number;
  readonly max: number;
  readonly step: number;
}

function SliderWithOutput({
  value,
  onValueChange,
  onValueCommit,
  title,
  min,
  max,
  step,
  ...props
}: SliderWithOutputProps) {

  return (
    <div className="space-y-4 mx-10">
      <div className="flex items-center justify-between gap-2">
        <Label className="leading-6">{title}</Label>
        <output className="text-sm font-medium tabular-nums">{value}</output>
      </div>
      <Slider
        value={value}
        onValueChange={onValueChange}
        onValueCommit={onValueCommit}
        aria-label="{title}"
        min={min}
        max={max}
        step={step}
        {...props}

      />
    </div>
  );
}

export { SliderWithOutput };
