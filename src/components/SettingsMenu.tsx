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
  text: string
  label?: string
  value: string
  className?: string
}

function Item({ text, label, value, className }: ItemProps) {
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
      <Track className="relative grow rounded h-1 bg-gray-300 dark:bg-gray-500">
        <Range className="absolute bg-brand-400 dark:bg-brand-500 rounded h-full" />
      </Track>
      <Thumb className="block cursor-pointer w-5 h-5 bg-brand-400 dark:bg-brand-500 hover:bg-brand-300 dark:hover:bg-brand-400 shadow-lg rounded-3xl focus:shadow-xl pointer-events-auto" />
    </BaseSlider>
  )
}

type SettingsMenuProps = {
  onMainScreen: boolean
  settings: SettingsHooks
}

export function SettingsMenu({ onMainScreen, settings }: SettingsMenuProps) {
  const {
    fontSize: [fontSize, setFontSize],
    theme: [theme, setTheme],
    stenoNotesNumbers: [stenoNotesNumbers, setStenoNotesNumbers],
    stenoNotesInline: [stenoNotesInline, setStenoNotesInline],
  } = settings
  return (
    <DropdownMenu>
      <Trigger
        aria-label="Settings"
        title="Settings"
        className={
          onMainScreen
            ? "fixed right-6 bottom-6 text-xl w-12 h-12 rounded-3xl dark:text-gray-50 hover:bg-brand-100 dark:hover:bg-brand-700 open:text-white open:bg-brand-400 open:shadow-lg dark:open:bg-brand-500"
            : "text-sm dark:text-gray-50 hover:bg-brand-100 dark:hover:bg-brand-700 open:text-white open:bg-brand-400 dark:open:bg-brand-500 px-1 py-0.5 rounded grow-0 shrink-0 h-6 w-6"
        }
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
                  <Item text="Light" value="light" />
                  <Item text="Dark" value="dark" />
                  <Item text="System" value="system" />
                </Group>
              </Setting>
            </SettingsGroup>
            {!onMainScreen && (
              <>
                <Separator />
                <SettingsGroup>
                  <Setting name="Steno Notes Display">
                    <Group
                      value={JSON.stringify(stenoNotesInline)}
                      onValueChange={(val) => {
                        setStenoNotesInline(JSON.parse(val))
                      }}
                    >
                      <Item
                        text="Vertical only"
                        aria-label="Vertical notes only"
                        value="false"
                      />
                      <Item
                        text="Show inline"
                        aria-label="Show steno notes inline"
                        value="true"
                      />
                    </Group>
                  </Setting>
                  <Setting name="Number Key Display">
                    <Group
                      value={JSON.stringify(stenoNotesNumbers)}
                      onValueChange={(val) => {
                        setStenoNotesNumbers(JSON.parse(val))
                      }}
                    >
                      <Item
                        text="#STPH-RBGS"
                        aria-label="No digits shown"
                        value="false"
                        className="font-mono"
                      />
                      <Item
                        text="1234-RBGS"
                        aria-label="Digits shown"
                        value="true"
                        className="font-mono"
                      />
                    </Group>
                  </Setting>
                </SettingsGroup>
              </>
            )}
          </div>
        </Content>
      </Portal>
    </DropdownMenu>
  )
}
