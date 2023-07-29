import { wrapToSettingNode } from "./shared.ts";

function GlobalSettingsTab() {
  return (
    <div>
      <p>test</p>
    </div>
  );
}

export default wrapToSettingNode(
  GlobalSettingsTab,
  "cat-settings",
  "Catcord Settings",
);
