import { ReactNode } from "react"
import { Separator as BaseSeparator } from "@radix-ui/react-dropdown-menu"
import {
  Item as RadioItem,
  Root as RadioGroup,
} from "@radix-ui/react-radio-group"
import { Range, Root as BaseSlider, Thumb, Track } from "@radix-ui/react-slider"

export function Separator() {
  return (
    <BaseSeparator className="border-b border-gray-200 dark:border-gray-400 mt-3 mb-1" />
  )
}

type SettingsGroupProps = { children: ReactNode }

export function SettingsGroup({ children }: SettingsGroupProps) {
  return <div className="px-4 pt-2 pb-3 last:pb-2.5 space-y-2">{children}</div>
}

type SettingProps = {
  name: string
  children?: ReactNode
}

export function Setting({ name, children }: SettingProps) {
  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">
        {name}
      </div>
      {children}
    </div>
  )
}

type RadioGroupProps = {
  value: string
  onValueChange: (val: string) => void
  children: ReactNode
}

export function Group({ value, onValueChange, children }: RadioGroupProps) {
  return (
    <RadioGroup
      className="flex flex-row divide-x border rounded"
      value={value}
      onValueChange={onValueChange}
    >
      {children}
    </RadioGroup>
  )
}

type ItemProps = {
  text: string
  label?: string
  value: string
  className?: string
}

export function Item({ text, label, value, className }: ItemProps) {
  return (
    <RadioItem
      value={value}
      title={label || text}
      aria-label={label || text}
      className={
        "grow checked-:bg-brand-400 dark:checked-:bg-brand-500 hover:bg-gray-100 dark:hover:bg-gray-500 dark:text-gray-100 checked-:text-white checked-:dark:text-white checked-:font-semibold px-2 py-1 first:rounded-l last:rounded-r " +
        className
      }
    >
      {text}
    </RadioItem>
  )
}

type SliderProps = {
  label: string
  value: number
  range: [number, number]
  step?: number
  onChange: (val: number) => void
}

export function Slider({
  label,
  value,
  range: [from, to],
  step,
  onChange,
}: SliderProps) {
  return (
    <BaseSlider
      aria-label="Font size"
      value={[value]}
      min={from}
      max={to}
      step={step || 1}
      onValueChange={(val) => onChange(val[0])}
      className="relative grow flex items-center select-none pointer-events-none h-5"
    >
      <Track className="relative grow rounded h-1 bg-gray-300 dark:bg-gray-500">
        <Range className="absolute bg-brand-400 dark:bg-brand-500 rounded h-full" />
      </Track>
      <Thumb className="block cursor-pointer w-5 h-5 bg-brand-400 dark:bg-brand-500 hover:bg-brand-300 dark:hover:bg-brand-400 shadow-lg rounded-3xl focus:shadow-xl pointer-events-auto" />
    </BaseSlider>
  )
}

export function SettingsPanel({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-700 pt-1 pb-2 m-4 mt-1 w-80 space-y-2.5 rounded-xl shadow-lg border dark:border-gray-400 select-none">
      {children}
    </div>
  )
}
