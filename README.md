<p align="center"><img alt="AlleyCAT" src="/images/logo.svg"></p>

<p align="center">
<a href="https://alleycat.sammdot.ca"><img src="https://img.shields.io/website?url=https%3A%2F%2Falleycat.sammdot.ca" alt="Website"></a>
<img src="https://img.shields.io/github/v/release/sammdot/alleycat" alt="GitHub release">
<img src="https://img.shields.io/pypi/v/alleycat-link" alt="Python package">
<img src="https://img.shields.io/github/workflow/status/sammdot/alleycat/build" alt="Build status">
<img src="https://img.shields.io/github/license/sammdot/alleycat" alt="License">
</p>

**AlleyCAT** is a free, open-source computer-aided transcription (CAT) system for stenographers. It lets you write and edit documents such as court transcripts and translation dictionaries on both web and desktop. AlleyCAT originated as a free alternative to professional CAT software, which is proprietary and very expensive.

![Screenshot of AlleyCAT running on macOS](/images/screenshot.png)

It is not intended to replace or compete with [Plover](https://github.com/openstenoproject/plover), the open-source stenography engine; instead, it connects to Plover to leverage its existing ecosystem, such as the ability to use several brands of hobbyist, student, and professional steno writers, and plugins contributed by the community.

## Installation

Pre-built binaries for the latest stable version are available on the [releases page](https://github.com/sammdot/alleycat/releases/latest). Download the corresponding package for your platform: `.msi` for Windows, `.dmg` for macOS, and `.AppImage` for Linux.

You can also build a bleeding-edge version of AlleyCAT from the source code. See the [Development](#development) section below for more information.

If you just want to try AlleyCAT without installing, a web version is also available at [alleycat.sammdot.ca](https://alleycat.sammdot.ca). There are couple of caveats to this:

- Files can only be saved into your web browser's downloads folder
- AlleyCAT will not be able to connect to the Plover instance running on your computer, for security reasons

## Development

AlleyCAT is a hybrid web-desktop application built with [Tauri](https://tauri.app), [React](https://reactjs.org), [TipTap](https://tiptap.dev), and [TypeScript](https://www.typescriptlang.org). Building the desktop app from source requires Node v16+ and Rust v1.64+; the web version requires only Node. Ensure `yarn` and `cargo` are installed before proceeding.

In order to connect AlleyCAT with Plover, you will also need a full Plover
4.0.0-dev10+ installation with the `alleycat_link` plugin, included in this
repository.

### Project Structure

The repository has four main parts:

```
alleycat (this repository)
 ├─ alleycat_link
 ├─ app
 │   └─ src
 ├─ public
 └─ src
```

- `/alleycat_link`: Plover plugin
- `/app/src`: Tauri application (desktop only)
- `/public`: Static assets
- `/src`: React application (web and desktop)

### Building from Source

Clone the repository:

```bash
$ git clone https://github.com/sammdot/alleycat.git
$ cd alleycat
```

Install all the dependencies, including TypeScript, React, and the Tauri CLI:

```bash
$ yarn install
```

and for the Plover plugin:

```bash
$ plover -s plover_plugins install -r requirements.txt
```

where `plover` is the path to the main Plover binary (or `plover_console.exe`
on Windows).

#### Development

To start a development server for just the web version:

```bash
$ yarn start
```

To start the desktop version for development:

```bash
$ yarn startapp
```

Both of these start a web server on [localhost:3000](http://localhost:3000). You should be able to access the web version from a browser even when running the desktop version.

To install the Plover plugin locally:

```bash
$ plover -s plover_plugins install -e .
```

then make sure to enable the `alleycat_link` extension in Plover, and allow network connections if needed.

#### Production

To build the web version for production:

```bash
$ yarn build
```

The generated files for the web version will be in the `/build` directory. These files can be served statically, and should also work offline.

To build the desktop version on your machine's platform:

```bash
$ yarn buildapp
```

The generated files for the desktop version will be in the `/app/target/release` directory. This may include a standalone application binary, an application bundle, and/or an installer package, depending on the platform. These files can be installed on your system or distributed.
