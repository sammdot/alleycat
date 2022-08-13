export function Version() {
  return (
    <div className="select-none pointer-events-none align-right fixed top-3 right-4 text-sm text-gray-400">
      alleycat-{process.env.ACAT_PLATFORM} v{process.env.ACAT_VERSION}
      {process.env.ACAT_DEBUG && (
        <span className="uppercase bg-red-400 dark:bg-red-500 px-1 ml-2 text-white rounded font-semibold">
          debug
        </span>
      )}
    </div>
  )
}
