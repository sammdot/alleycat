import {
  Content,
  Portal,
  Root as DropdownMenu,
  Trigger,
} from "@radix-ui/react-dropdown-menu"

import { SettingsIcon } from "src/components/Icon"
import {
  Group,
  Item,
  Separator,
  Setting,
  SettingsGroup,
  SettingsPanel,
  Slider,
} from "src/components/Settings"
import { SettingsHooks } from "src/models/settings"

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
          <SettingsPanel>
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
          </SettingsPanel>
        </Content>
      </Portal>
    </DropdownMenu>
  )
}
