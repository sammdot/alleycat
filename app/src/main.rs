#![feature(async_closure)]
#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod events;
mod link;
mod title_bar;

use tauri::{LogicalSize, Manager, Size, Window};
use uuid::Uuid;

use crate::events::LinkEvents;
use crate::link::Link;

#[tauri::command]
fn new_window(handle: tauri::AppHandle, path: String) {
  let label = Uuid::new_v4().to_string();
  let win = tauri::WindowBuilder::new(
    &handle,
    label.clone(),
    tauri::WindowUrl::App(path.into()),
  )
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

#[tauri::command]
async fn start_link(window: Window) {
  window.did_start_connecting();
  if let Ok(mut link) = Link::new().await {
    link.start(&window).await;
  } else {
    window.did_fail_to_connect();
  }
}

fn main() {
  env_logger::Builder::new().filter(None, log::LevelFilter::Info).init();
  tauri::Builder::default()
    .setup(move |app| {
      #[cfg(target_os = "macos")]
      {
        use crate::title_bar::title_bar::WindowExt;
        app.get_window("main").unwrap().set_transparent_titlebar(true);
      }

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![new_window, start_link])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
