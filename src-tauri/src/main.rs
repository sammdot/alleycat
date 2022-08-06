#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod title_bar;

use crate::title_bar::title_bar::WindowExt;
use tauri::Manager;

fn main() {
  tauri::Builder::default()
    .setup(|app| {
       let win = app.get_window("main").unwrap();
       win.set_transparent_titlebar(true);

       Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
