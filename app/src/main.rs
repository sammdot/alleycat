#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod title_bar;

use tauri::{LogicalSize, Manager, Size};
use uuid::Uuid;

#[tauri::command]
fn new_window(handle: tauri::AppHandle, path: String) {
  let label = Uuid::new_v4().to_string();
  let win = tauri::WindowBuilder::new(&handle, label.clone(), tauri::WindowUrl::App(path.into()))
    .build()
    .unwrap();
  win
    .set_size(Size::Logical(LogicalSize {
      width: 1280.0,
      height: 800.0,
    }))
    .unwrap();

  #[cfg(target_os = "macos")]
  {
    use crate::title_bar::title_bar::WindowExt;
    win.set_transparent_titlebar(true);
  }
}

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let win = app.get_window("main").unwrap();

      #[cfg(target_os = "macos")]
      {
        use crate::title_bar::title_bar::WindowExt;
        win.set_transparent_titlebar(true);
      }

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![new_window])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
