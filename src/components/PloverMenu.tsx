import {
  Content,
  Portal,
  Root as DropdownMenu,
  Trigger,
} from "@radix-ui/react-dropdown-menu"

import { PloverIcon } from "src/components/Icon"
import { ConnectionState, PloverLink } from "src/platform/types"

type Props = {
  plover: PloverLink
}

export function PloverMenu({ plover }: Props) {
  const { canConnect, connectionState, connect, disconnect } = plover

  const buttonText =
    connectionState === ConnectionState.disconnected
      ? "Connect"
      : connectionState === ConnectionState.connecting
      ? "Connecting..."
      : "Disconnect"

  const dotClassName =
    connectionState === ConnectionState.disconnected
      ? "bg-red-500 dark:bg-red-400"
      : connectionState === ConnectionState.connecting
      ? "bg-amber-500 dark:bg-amber-300 animate-blink"
      : "bg-green-500 dark:bg-green-300"

  const buttonClassName =
    connectionState === ConnectionState.disconnected
      ? "bg-brand-400 dark:bg-brand-500 text-white dark:text-gray-100 hover:bg-brand-600 dark:hover:bg-brand-400 hover:shadow-md"
      : connectionState === ConnectionState.connecting
      ? "bg-gray-200 text-gray-400 dark:bg-gray-600 dark:text-gray-400"
      : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-500 dark:text-white dark:hover:bg-gray-400 hover:shadow-md"

  return canConnect ? (
    <DropdownMenu>
      <Trigger
        aria-label="Plover Link"
        title="Plover Link"
        className="flex items-center justify-center group text-sm dark:text-gray-50 hover:bg-brand-100 dark:hover:bg-brand-700 open:text-white open:bg-brand-400 dark:open:bg-brand-500 px-1 py-0.5 rounded grow-0 shrink-0 h-6 w-12"
      >
        <div
          className={`mr-2 h-2 w-2 rounded ${dotClassName} ring-2 ring-white`}
        />
        <PloverIcon />
      </Trigger>
      <Portal>
        <Content>
          <div className="bg-white dark:bg-gray-700 p-6 pt-4 m-4 mt-1 w-72 space-y-2.5 rounded-xl shadow-lg border dark:border-gray-400">
            <div className="flex items-center font-semibold uppercase text-gray-600 dark:text-gray-300">
              <span className="grow">Plover: {connectionState}</span>
              <span className={`ml-4 h-3 w-3 rounded-xl ${dotClassName}`} />
            </div>
            <button
              disabled={connectionState === ConnectionState.connecting}
              className={
                "w-full rounded-md px-2 py-1 " +
                (connectionState === ConnectionState.connecting
                  ? "cursor-wait "
                  : "font-medium ") +
                buttonClassName
              }
              onClick={() => {
                if (connectionState === ConnectionState.disconnected) {
                  connect()
                } else if (connectionState === ConnectionState.connected) {
                  disconnect()
                }
              }}
            >
              {buttonText}
            </button>
          </div>
        </Content>
      </Portal>
    </DropdownMenu>
  ) : (
    <></>
  )
}
