<p align="center"><img alt="AlleyCAT" src="/src/logo.svg"></p>

![Website](https://img.shields.io/website?url=https%3A%2F%2Falleycat.sammdot.ca)
![GitHub release](https://img.shields.io/github/v/release/sammdot/alleycat)
![Build status](https://img.shields.io/github/workflow/status/sammdot/alleycat/build)
![GitHub license](https://img.shields.io/github/license/sammdot/alleycat)

**AlleyCAT** is a free, open-source computer-aided transcription (CAT) system for stenographers. It lets you write and edit documents such as court transcripts and translation dictionaries on both web and desktop. AlleyCAT originated as a free alternative to professional CAT software, which is proprietary and very expensive.

![Screenshot of AlleyCAT running on macOS](/images/screenshot.png)

It is not intended to replace or compete with [Plover](https://github.com/openstenoproject/plover), the open-source stenography engine; instead, it connects to Plover to leverage its existing ecosystem, such as the ability to use several brands of hobbyist, student, and professional steno writers, and plugins contributed by the community.

## Installation

<!-- TODO: Add release downloads here -->

Once a release has been published, you will see links to download pre-built binaries and installers here, but for now, the only way to build it is from source. See the [Development](#development) section below for more information.

If you just want to try AlleyCAT without installing, a web version is also available at [alleycat.sammdot.ca](https://alleycat.sammdot.ca). There are couple of caveats to this:

- Files can only be saved into your web browser's downloads folder
- AlleyCAT will not be able to connect to Plover, for security reasons

## Development

AlleyCAT is a hybrid web-desktop application built with [Tauri](https://tauri.app), [React](https://reactjs.org), [TipTap](https://tiptap.dev), and [TypeScript](https://www.typescriptlang.org). Building the desktop app from source requires Node v16+ and Rust v1.64+; the web version requires only Node. Ensure `yarn` and `cargo` are installed before proceeding.

### Project Structure

The repository has three main parts:

```
alleycat (this repository)
 ├─ public
 ├─ src
 └─ src-tauri
     └─ src
```

- `/public`: Static assets
- `/src`: React application (web and desktop)
- `/src-tauri/src`: Tauri application (desktop only)

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

#### Development

To start a development server for just the web version:

```bash
$ yarn start
```

To start the desktop version for development:

```bash
$ yarn tauri dev
```

Both of these start a web server on [localhost:3000](http://localhost:3000). You should be able to access the web version from a browser even when running the desktop version.

#### Production

To build the web version for production:

```bash
$ yarn build
```

The generated files for the web version will be in the `/build` directory. These files can be served statically.

To build the desktop version on your machine's platform:

```bash
$ yarn tauri build
```

The generated files for the desktop version will be in the `/src-tauri/target/release` directory. This may include a standalone application binary, an application bundle, and/or an installer package, depending on the platform. These files can be installed on your system or distributed.
