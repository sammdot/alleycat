use tokio::io::{AsyncBufReadExt, BufReader};
#[cfg(target_os = "windows")]
use tokio::net::{TcpSocket, TcpStream};
#[cfg(not(target_os = "windows"))]
use tokio::net::UnixStream;
use tokio::sync::Notify;

use crate::events::LinkEvents;

// Until both Python and Tokio support Unix domain sockets on Windows,
// Windows connectivity will have to be over TCP.
#[cfg(target_os = "windows")]
const ADDRESS: &str = "127.0.0.1:2228";
#[cfg(not(target_os = "windows"))]
const PATH: &str = "/tmp/alleycat-link.sock";

#[derive(Debug)]
pub struct Link {
  notify: Notify
}

impl Link {
  pub fn new() -> Link {
    Link { notify: Notify::new() }
  }

  pub async fn start(&self, app: &dyn LinkEvents) {
    app.did_start_connecting();

    #[cfg(target_os = "windows")]
    let strm = TcpSocket::new_v4().connect(ADDRESS.parse().unwrap()).await;
    #[cfg(not(target_os = "windows"))]
    let strm = UnixStream::connect(PATH).await;

    if let Err(_) = strm {
      app.did_disconnect();
      return;
    }
    app.did_connect();

    let stream = strm.unwrap();
    let mut reader = BufReader::new(stream);

    loop {
      let mut line = String::new();
      tokio::select! {
        l = reader.read_line(&mut line) => {
          match l {
            Ok(0) => { break; },
            Ok(_) => {
              app.did_stroke(line);
            },
            Err(_) => { break; },
          }
        },
        _ = self.notify.notified() => {
          break;
        }
      }
    }

    app.did_disconnect();
  }

  pub async fn close(&self) {
    self.notify.notify_waiters();
  }
}
