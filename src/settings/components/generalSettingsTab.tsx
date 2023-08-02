import { Window } from "@gluon-framework/gluon";
import TextArea from "../../components/textArea.tsx";
import Button from "../../components/button.tsx";
import { SETTINGS_STORAGE } from "../storage.ts";

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
            cols={115}
            value={currentValue.join("\n")}
          />
        </div>

        <br />

        <Button>
          Update Theme
        </Button>
      </form>

      <br />
      <br />
      <br />

      {Object.entries(loadResult).map(([url, value]) => {
        return (
          <div
            className="cardPrimary-pAe8Ed card-2guEcY eyebrow-2wJAoF h5-2feg8J defaultMarginh5-3THN2O"
            style={{
              padding: "0.5em",
              marginBottom: "0.5em",
              marginTop: "0.5em",
            }}
          >
            <h1 style={{ overflowWrap: "break-word", width: "65%" }}>
              <span style={{ color: value === "true" ? "green" : "red" }}>
                {value === "true" ? "✅" : "❌"}
              </span>{" "}
              <strong>{url}</strong>
            </h1>
            {!value && (
              <div
                className="colorStandard-1Xxp1s size14-k_3Hy4 default-h5DUM7 formText-2UzJT0 modeDefault-3Warim"
                style={{ color: "var(--text-positive)" }}
              >
                {loadResult[url]}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
