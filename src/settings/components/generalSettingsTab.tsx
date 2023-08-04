import { Window } from "@gluon-framework/gluon";
import TextArea from "../../components/textArea.tsx";
import { SETTINGS_STORAGE } from "../storage.ts";
import { Button, ButtonContainer } from "../../components/button.tsx";
import { CardComponent } from "../../components/card.tsx";

// Heavily inspired by Vencord
export function GlobalSettingsTab(window: Window) {
  const config = window.ipc.store.config;

  const currentValue: string[] = SETTINGS_STORAGE.themes;
  const loadResult: string[] = config.themesLoaded;

  return (
    <>
      <form id="setThemeContents">
        <div>
          <TextArea
            name="themes"
            rows={5}
            cols={150}
            value={currentValue.length > 0 ? currentValue.join("\n") : ""}
          />
        </div>

        <br />

        <ButtonContainer>
          <Button style={{ marginRight: "5px" }}>
            Update Theme
          </Button>

          <Button id="unloadTheme">
            Reset Theme
          </Button>
        </ButtonContainer>
      </form>

      <br />
      <br />
      <br />

      {Object.entries(loadResult).map(([url, value]) => (
        <CardComponent
          key={url}
          display={url.split("/").pop()!}
          value={value}
        />
      ))}
    </>
  );
}
