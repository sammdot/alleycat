import * as Toolbar from "@radix-ui/react-toolbar"
import { ReactNode } from "react"

type ToggleGroupProps = {
  label?: string
  value: { [key: string]: boolean }
  onToggle: { [key: string]: () => void }
  className?: string
  children?: ReactNode
}

type RadioToggleGroupProps = {
  label?: string
  value: string
  onToggle: (value: string) => void
  className?: string
  children?: ReactNode
}

type ToggleItemProps = {
  name: string
  label?: string
  className?: string
  children?: ReactNode
}

function setDiff<T>(oldSet: T[], newSet: T[]) {
  let lst = oldSet
    .filter((v) => !newSet.includes(v))
    .concat(newSet.filter((v) => !oldSet.includes(v)))
  return lst[0]
}

export function ToggleGroup({
  label,
  value,
  onToggle,
  className,
  children,
}: ToggleGroupProps) {
  const groupState = Object.keys(value).filter((k) => value[k])
  return (
    <Toolbar.ToggleGroup
      type="multiple"
      aria-label={label}
      value={groupState}
      onValueChange={(newValue) => {
        const diff = setDiff(groupState, newValue)
        const toggle = onToggle[diff]
        toggle()
      }}
      className={`space-x-1 text-sm ${className}`}
    >
      {children}
    </Toolbar.ToggleGroup>
  )
}

export function RadioToggleGroup({
  label,
  value,
  onToggle,
  className,
  children,
}: RadioToggleGroupProps) {
  return (
    <Toolbar.ToggleGroup
      type="single"
      aria-label={label}
      value={value}
      onValueChange={(newValue: string) => onToggle(newValue)}
      className={`space-x-1 text-sm ${className}`}
    >
      {children}
    </Toolbar.ToggleGroup>
  )
}

export function ToggleItem({
  name,
  label,
  className,
  children,
}: ToggleItemProps) {
  return (
    <Toolbar.ToggleItem
      value={name}
      aria-label={label}
      className={`grow-0 shrink-0 h-6 w-6 rounded hover:bg-brand-100 active:bg-brand-400 active:text-white ${className}`}
    >
      {children}
    </Toolbar.ToggleItem>
  )
}
