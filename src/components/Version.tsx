export function Version() {
  return (
    <div className="fixed top-3 right-4 text-sm text-gray-400 dark:text-gray-500">
      alleycat-{process.env.ACAT_PLATFORM} v{process.env.ACAT_VERSION}
    </div>
  )
}
