use serde::ser::Serialize;
use tauri::Window;

trait _LinkEvents {
  fn _emit<S: Serialize + Clone>(&self, event: &str, payload: S);
}

impl _LinkEvents for Window {
  fn _emit<S: Serialize + Clone>(&self, event: &str, payload: S) {
    match self.emit(format!("acat://{}", event.to_string()).as_str(), payload) {
      _ => {}
    };
  }
}

pub trait LinkEvents: Sync + Send {
  fn did_start_connecting(&self);
  fn did_connect(&self);
  fn did_disconnect(&self);
  fn did_stroke(&self, payload: String);
}

impl LinkEvents for Window {
  fn did_start_connecting(&self) {
    self._emit("connecting", ());
  }

  fn did_connect(&self) {
    self._emit("connected", ());
  }

  fn did_disconnect(&self) {
    self._emit("disconnected", ());
  }

  fn did_stroke(&self, payload: String) {
    self._emit("stroked", payload);
  }
}
