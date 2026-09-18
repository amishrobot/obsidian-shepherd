import { App, PluginSettingTab, Setting } from 'obsidian';
import type ShepherdPlugin from './main';

export class ShepherdSettingTab extends PluginSettingTab {
  constructor(app: App, private plugin: ShepherdPlugin) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName('Member folder')
      .setDesc('Vault-relative folder holding member files. Files outside it get the empty panel.')
      .addText((text) =>
        text
          .setPlaceholder('Church/Members')
          .setValue(this.plugin.settings.memberDir)
          .onChange(async (value) => {
            this.plugin.settings.memberDir = value.replace(/\/+$/, '').trim();
            await this.plugin.saveSettings();
            this.plugin.refreshView();
          })
      );

    new Setting(containerEl)
      .setName('Dashboard path')
      .setDesc('Note opened by the "Open Dashboard" link in the empty state.')
      .addText((text) =>
        text
          .setPlaceholder('Church/_system/views/_dashboard.md')
          .setValue(this.plugin.settings.dashboardPath)
          .onChange(async (value) => {
            this.plugin.settings.dashboardPath = value.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Overdue threshold (days)')
      .setDesc('Days without contact before a top-10 or high-priority member is flagged overdue.')
      .addText((text) =>
        text
          .setPlaceholder('14')
          .setValue(String(this.plugin.settings.overdueThreshold))
          .onChange(async (value) => {
            const n = Number(value);
            if (!Number.isFinite(n) || n <= 0) return;
            this.plugin.settings.overdueThreshold = Math.floor(n);
            await this.plugin.saveSettings();
            this.plugin.refreshView();
          })
      );

    new Setting(containerEl)
      .setName('Show contact bar')
      .setDesc('Display call / text / email chips on the member panel.')
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.showContactBar).onChange(async (value) => {
          this.plugin.settings.showContactBar = value;
          await this.plugin.saveSettings();
          this.plugin.refreshView();
        })
      );
  }
}
