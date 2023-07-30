import { Window } from "@gluon-framework/gluon";

export function GlobalSettingsTab(window: Window) {
  return (
    <div>
      <form id="setThemeContents">
        <input
          type="text"
          name="themes"
          value={window.ipc.store.config.settings.themes}
        />
        <button>
          Update Theme
        </button>
      </form>
      <p>test</p>
    </div>
  );
}
