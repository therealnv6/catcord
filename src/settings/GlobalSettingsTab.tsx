import { Window } from "@gluon-framework/gluon";
import TextArea from "../components/textArea.tsx";
import Button from "../components/button.tsx";

export function GlobalSettingsTab(window: Window) {
  return (
    <form id="setThemeContents">
      <div>
        <TextArea
          name="themes"
          rows={5}
          cols={45}
          value={window.ipc.store.config.settings.themes}
        />
      </div>

      <Button>
        Update Theme
      </Button>
    </form>
  );
}
