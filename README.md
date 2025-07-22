# SCL Editor - OpenSCD Demo Distribution

The SCL editor is a light weight editor for substation configuration language as defined in the IEC 61850-6.
This editor is been created with a focus on a general user that does want to be close to the process described in the standard and an easy to maintain distribution (for long term stability).

Give it a try on https://OMICRONEnergyOSS.github.io/oscd-ce/demo/

# IMPORTANT - NOT FOR PRODUCTION

This project serves as a "Starting Point" for anybody wanting to build an OpenSCD Distrobution. This Project itself is not intended to be used by Engineers in the field. It is incomplete, untested and subject to significant change in the near future.

# Security

We do NOT upload any information of any sort.
You browser is only downloading never uploading anything.
So when you connect to the [Open SCD Demo App](https://OMICRONEnergyOSS.github.io/oscd-ce/demo) you download/update all the JavaScript files to run the editor in your browser.
That is why you can work offline one you have connected to the page once!

# Adding a plugin

Add the plugin as a runtime dependency:

```bash
  npm install -S @omicronenergy/oscd-menu-open
```

In the `plugins.js` file:

- Import the new plugin
- Define it as a custom element (with a unique name)
- add it to the exported plugins object using the tagName defined in the previous step

```javascript
import OscdMenuOpen from "@omicronenergy/oscd-menu-open";

customElements.define("oscd-menu-open", OscdMenuOpen);

export const plugins = {
  menu: [
    {
      name: "Open File",
      translations: { de: "Datei öffnen" },
      icon: "folder_open",
      requireDoc: false,
      tagName: "oscd-menu-open",
    },
  ],
  editor: [],
  background: [],
};
```

## _Alternatively..._

If you'd prefer to take the pre-built version of a plugin, you can still use the src field to point to a prebuilt bundle which will get dynamically loaded at runtime.

1. Download published bundle and unpack it:

```bash
  mkdir -p plugins/oscd-menu-open
  curl -L -o oscd-menu-open.zip https://github.com/OMICRONEnergyOSS/oscd-menu-open/archive/refs/tags/oscd-menu-open-v0.0.6.zip
  unzip oscd-menu-open.zip -d plugins/oscd-menu-open
  rm oscd-menu-open.zip
```

2. Add to the `plugins.json`:

```json
{
  "name": "Open File",
  "icon": "folder_open",
  "requireDoc": false,
  "src": "./plugins/oscd-menu-open/oscd-menu-open.js"
}
```

**TIP**: Ensure there are commas between plugins but no trailing commas.

# Releasing a new version

This project uses the "release-me" github action, simplifying the release process considerably.

Any commits prefixed with feat: or fix: (see [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)) trigger the creation of a Release Pull Request, which is continuously updated with each subsequent feat and/or fix until such a time as the PR is Approved.
When the Release-Please PR is approved and merged into main, the application version is incremented and a new release is published to github page and the electron based installers are built and uploaded to the release page for users to download and install locally.

The following artifacts are built (and published):

- For Linux users, AppImage (requires Fuse), RPM and Deb installers are available (e.g. sudo apt install -f oscd-ce_linux_amd64_0.0.0_latest.deb)
- an msi file for Windows users (install with e.g. `msiexec /i oscd-ce_win_x64_0.0.0_latest.msi`)
- an NSIS installer (run the installer e.g. `oscd-ce_win_x64_0.0.0_latest_nsis.exe`)
- a stand-alone executable (run the executable on x64 machines, e.g. `oscd-ce_win_x64_0.0.0_latest.exe`)

_Code signing is not provided._
