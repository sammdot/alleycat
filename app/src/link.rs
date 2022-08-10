use std::io::{ErrorKind, Result};
use std::mem::{drop, replace};
use std::str::from_utf8;
use tauri::async_runtime::RwLock;
#[cfg(target_os = "windows")]
use tokio::net::{TcpSocket, TcpStream};
#[cfg(not(target_os = "windows"))]
use tokio::net::UnixStream;

use crate::events::LinkEvents;

// Until both asyncio and Tokio support Unix domain sockets on Windows,
// Windows connectivity will have to be over TCP.
#[cfg(target_os = "windows")]
const ADDRESS: &str = "127.0.0.1:2228";
#[cfg(not(target_os = "windows"))]
const PATH: &str = "/tmp/alleycat-link.sock";

#[derive(Debug)]
pub struct Link {
  #[cfg(target_os = "windows")]
  socket: RwLock<Option<TcpStream>>,
  #[cfg(not(target_os = "windows"))]
  socket: RwLock<Option<UnixStream>>,
  running: RwLock<bool>,
}

impl Link {
  pub fn new() -> Link {
    Link { socket: RwLock::new(None), running: RwLock::new(false) }
  }

  pub async fn start(&self, app: &dyn LinkEvents) {
    {
      let rg = self.socket.read().await;
      if let Some(_) = *rg {
        return;
      }
    }

    app.did_start_connecting();

    #[cfg(target_os = "windows")]
    {
      if let Ok(sock) = TcpSocket::new_v4() {
        if let Ok(stream) = sock.connect(ADDRESS.parse().unwrap()).await {
          *(self.socket.write().await) = Some(stream);
        }
      }
    }

    #[cfg(not(target_os = "windows"))]
    {
      if let Ok(stream) = UnixStream::connect(PATH).await {
        *(self.socket.write().await) = Some(stream);
      }
    }

    {
      let rg = self.socket.read().await;
      if let None = *rg {
        app.did_disconnect();
        return;
      } else {
        app.did_connect();
      }
    }

    {
      let mut wg = self.running.write().await;
      *wg = true;
    }

    loop {
      let mut buf = [0; 4096];
      let mut val: Result<usize> = Ok(0);

      {
        let rg = self.running.read().await;
        if !*rg {
          break;
        }
      }

      {
        let rg = self.socket.read().await;
        if let None = rg.as_ref() {
          break;
        }
        let stream = rg.as_ref().unwrap();
        val = stream.try_read(&mut buf);
      }

      match val {
        Ok(0) => break,
        Ok(n) => {
          if let Ok(payload) = from_utf8(&buf[..n]) {
            app.did_stroke(payload.to_string());
          }
        },
        Err(ref e) if e.kind() == ErrorKind::WouldBlock => {
          continue;
        },
        Err(_) => {
          break;
        }
      }
    }

    app.did_disconnect();

    {
      let mut wg = self.running.write().await;
      *wg = false;
    }

    {
      let mut wg = self.socket.write().await;
      if let None = wg.as_ref() {
        return
      }

      let stream = replace(&mut *wg, None);
      drop(stream);
    }
  }

  pub async fn close(&self) {
    {
      let rg = self.socket.read().await;
      if let None = *rg {
        return;
      }
    }

    {
      let mut wg = self.running.write().await;
      *wg = false;
    }

  }
}
