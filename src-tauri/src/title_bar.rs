// https://github.com/tauri-apps/tauri/discussions/4088

pub mod title_bar {
  use tauri::{Runtime, Window};

  pub trait WindowExt {
    #[cfg(target_os = "macos")]
    fn set_transparent_titlebar(&self, transparent: bool);
  }

  impl<R: Runtime> WindowExt for Window<R> {
    #[cfg(target_os = "macos")]
    fn set_transparent_titlebar(&self, transparent: bool) {
      use cocoa::appkit::{NSWindow, NSWindowStyleMask, NSWindowTitleVisibility};

      unsafe {
        let id = self.ns_window().unwrap() as cocoa::base::id;

        let mut style_mask = id.styleMask();
        style_mask.set(
          NSWindowStyleMask::NSFullSizeContentViewWindowMask,
          transparent,
        );
        id.setStyleMask_(style_mask);

        id.setTitleVisibility_(if transparent {
          NSWindowTitleVisibility::NSWindowTitleHidden
        } else {
          NSWindowTitleVisibility::NSWindowTitleVisible
        });
        id.setTitlebarAppearsTransparent_(if transparent {
          cocoa::base::YES
        } else {
          cocoa::base::NO
        });
      }
    }
  }
}
