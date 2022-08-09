use std::str::from_utf8;
use tokio::net::{TcpSocket, TcpStream};

use crate::events::LinkEvents;

const ADDRESS: &str = "127.0.0.1:2228";

pub struct Link {
  socket: TcpStream
}

impl Link {
  pub async fn new() -> std::io::Result<Link> {
    let sock = TcpSocket::new_v4()?;
    let stream = sock.connect(ADDRESS.parse().unwrap()).await?;
    Ok(Link{socket: stream})
  }

  pub async fn start(&mut self, app: &dyn LinkEvents) {
    app.did_connect();
    loop {
      let stream = &self.socket;
      if let Ok(_) = stream.readable().await {
        let mut buf = [0; 4096];

        match stream.try_read(&mut buf) {
          Ok(0) => break,
          Ok(n) => {
            if let Ok(payload) = from_utf8(&buf[..n]) {
              app.did_stroke(payload.to_string());
            }
          },
          Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock => {
              continue;
          },
          Err(_) => {
              break;
          },
        }
      }
    }
    app.did_fail_to_connect();
  }
}
