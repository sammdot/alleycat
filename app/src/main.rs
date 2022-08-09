#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod events;
mod link;
mod title_bar;

use tauri::{LogicalSize, Manager, Size, Window};
use uuid::Uuid;

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
async fn start_link(app: Window) -> Result<(), ()> {
  let link = app.state::<Link>();
  link.start(&app).await;
  Ok(())
}

#[tauri::command]
async fn close_link(app: Window) -> Result<(), ()> {
  let link = app.state::<Link>();
  link.close().await;
  Ok(())
}

#[tokio::main]
async fn main() -> Result<(), ()> {
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
    .manage(Link::new())
    .invoke_handler(tauri::generate_handler![new_window, start_link, close_link])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
  Ok(())
}
