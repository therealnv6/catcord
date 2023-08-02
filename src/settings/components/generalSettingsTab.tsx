import { Window } from "@gluon-framework/gluon";
import TextArea from "../../components/textArea.tsx";
import Button from "../../components/button.tsx";
import { settings } from "../shared.ts";

export function GlobalSettingsTab(window: Window) {
  const config = window.ipc.store.config;

  const currentValue = settings.themes;
  const loaded = config["themes-loaded"];

  console.log(loaded);

  return (
    <form id="setThemeContents">
      <div>
        <TextArea
          name="themes"
          rows={5}
          cols={45}
          value={currentValue}
        />
      </div>

      <br />

      <Button>
        Update Theme
      </Button>

      <br />

      {loaded
        ? (
          <p style={{ color: "green" }}>
            Successfully applied theme!
          </p>
        )
        : (
          <p style={{ color: "red" }}>
            Could not apply theme.
          </p>
        )}
    </form>
  );
}
