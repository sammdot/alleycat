import logo from "src/logo.svg"

export function TitleBar() {
  return (
    <div className="w-full p-4 pb-2 flex flex-row content-center">
      <img src={logo} alt="AlleyCAT" className="h-8 mr-4 select-none" />
    </div>
  )
}
