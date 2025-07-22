import OscdMenuOpen from "@omicronenergy/oscd-menu-open";
import OscdMenuSave from "@omicronenergy/oscd-menu-save";
import OscdBackgroundEditV1 from "@omicronenergy/oscd-background-editv1";

customElements.define("oscd-menu-open", OscdMenuOpen);
customElements.define("oscd-menu-save", OscdMenuSave);
customElements.define("oscd-background-editv1", OscdBackgroundEditV1);

export const plugins = {
  menu: [
    {
      name: "Open File",
      translations: { de: "Datei öffnen" },
      icon: "folder_open",
      requireDoc: false,
      tagName: "oscd-menu-open",
    },
    {
      name: "Save File",
      translations: { de: "Datei speichern" },
      icon: "save",
      requireDoc: true,
      tagName: "oscd-menu-save",
    },
  ],
  editor: [
    {
      name: "Start",
      translations: {
        de: "Start",
      },
      icon: "start",
      src: "https://openenergytools.github.io/scl-editor-landing/scl-editor-landing.js",
    },
    {
      name: "Design SLD",
      translations: {
        de: "Designer",
      },
      icon: "add_box",
      requireDoc: true,
      src: "https://openenergytools.github.io/oscd-designer/oscd-designer.js",
    },
  ],
  background: [
    {
      name: "EditV1 Events Listener",
      icon: "none",
      requireDoc: true,
      tagName: "oscd-background-editv1",
    },
  ],
};
