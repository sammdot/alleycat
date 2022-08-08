import { ReactNode } from "react"
import {
  Content,
  Portal,
  Root as DropdownMenu,
  Separator as BaseSeparator,
  Trigger,
} from "@radix-ui/react-dropdown-menu"
import {
  Item as RadioItem,
  Root as RadioGroup,
} from "@radix-ui/react-radio-group"
import { Range, Root as BaseSlider, Thumb, Track } from "@radix-ui/react-slider"

import { SettingsIcon } from "src/components/Icon"
import { SettingsHooks } from "src/models/settings"

type SettingsMenuProps = {
  settings: SettingsHooks
}

function Separator() {
  return (
    <BaseSeparator className="border-b border-gray-200 dark:border-gray-400 mt-3 mb-1" />
  )
}

type SettingsGroupProps = { children: ReactNode }

function SettingsGroup({ children }: SettingsGroupProps) {
  return <div className="px-4 py-1 pt-3 last:pb-2.5 space-y-2">{children}</div>
}

type SettingProps = {
  name: string
  children?: ReactNode
}

function Setting({ name, children }: SettingProps) {
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

function Group({ value, onValueChange, children }: RadioGroupProps) {
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
  label: string
  value: string
}

function Item({ label, value }: ItemProps) {
  return (
    <RadioItem
      value={value}
      className="grow hover:bg-brand-200 dark:hover:bg-brand-700 checked-:bg-brand-500 dark:text-gray-100 checked-:text-white checked-:dark:text-white checked-:font-semibold px-2 py-1 first:rounded-l last:rounded-r"
    >
      {label}
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

function Slider({
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
      <Track className="relative grow rounded h-1 bg-black dark:bg-gray-500">
        <Range className="absolute bg-brand-500 rounded h-full" />
      </Track>
      <Thumb className="block cursor-pointer w-5 h-5 bg-brand-500 shadow-lg rounded-3xl hover:bg-brand-300 focus:shadow-xl pointer-events-auto" />
    </BaseSlider>
  )
}

export function SettingsMenu({ settings }: SettingsMenuProps) {
  const {
    fontSize: [fontSize, setFontSize],
    theme: [theme, setTheme],
  } = settings
  return (
    <DropdownMenu>
      <Trigger
        aria-label="Settings"
        title="Settings"
        className="text-sm dark:text-gray-50 disabled:text-slate-400 dark:disabled:text-slate-500 hover:bg-brand-100 dark:hover:bg-brand-700 disabled-hover:bg-transparent open:text-white open:bg-brand-400 dark:open:bg-brand-500 px-1 py-0.5 rounded grow-0 shrink-0 h-6 w-6"
      >
        <SettingsIcon />
      </Trigger>
      <Portal>
        <Content>
          <div className="bg-white dark:bg-gray-700 py-2 pt-0 m-4 mt-1 w-96 rounded-xl shadow-lg border dark:border-gray-400">
            <SettingsGroup>
              <Setting name="Font Size">
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-200 mr-4">
                    {fontSize}
                  </span>
                  <Slider
                    label="Font size"
                    value={fontSize}
                    range={[12, 24]}
                    onChange={setFontSize}
                  />
                </div>
              </Setting>
              <Setting name="Theme">
                <Group
                  value={theme || "system"}
                  onValueChange={(val) => {
                    if (val === "light") {
                      setTheme("light")
                    } else if (val === "dark") {
                      setTheme("dark")
                    } else if (val === "system") {
                      setTheme(null)
                    }
                  }}
                >
                  <Item label="Light" value="light" />
                  <Item label="Dark" value="dark" />
                  <Item label="System" value="system" />
                </Group>
              </Setting>
            </SettingsGroup>
          </div>
        </Content>
      </Portal>
    </DropdownMenu>
  )
}
