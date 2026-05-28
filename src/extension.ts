import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';

const skillName = 'vue-js-lowcode-conversion';
const installStateKey = 'vue-js-lowcode-conversion.installedVersion';
const commandPrefix = 'vue-js-lowcode-conversion';

function getBundledSkillPath(context: vscode.ExtensionContext): string {
  return path.join(context.extensionPath, 'SKILL.md');
}

function getInstalledSkillDir(): string {
  return path.join(os.homedir(), '.copilot', 'skills', skillName);
}

function getInstalledSkillPath(): string {
  return path.join(getInstalledSkillDir(), 'SKILL.md');
}

async function ensureSkillInstalled(context: vscode.ExtensionContext): Promise<string> {
  const sourcePath = getBundledSkillPath(context);
  const targetDir = getInstalledSkillDir();
  const targetPath = getInstalledSkillPath();

  await fs.mkdir(targetDir, { recursive: true });
  await fs.copyFile(sourcePath, targetPath);

  return targetPath;
}

async function revealInOs(targetPath: string): Promise<void> {
  await vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(targetPath));
}

async function installSkillWithFeedback(
  context: vscode.ExtensionContext,
  options?: { silent?: boolean }
): Promise<string> {
  const installedPath = await ensureSkillInstalled(context);

  if (!options?.silent) {
    void vscode.window.showInformationMessage(
      `Installed ${skillName} to ${installedPath}`,
      'Open Folder'
    ).then(async selection => {
      if (selection === 'Open Folder') {
        await revealInOs(path.dirname(installedPath));
      }
    });
  }

  return installedPath;
}

async function autoInstallOnVersionChange(context: vscode.ExtensionContext): Promise<void> {
  const currentVersion = context.extension.packageJSON.version as string;
  const installedVersion = context.globalState.get<string>(installStateKey);

  if (installedVersion === currentVersion) {
    return;
  }

  await installSkillWithFeedback(context, { silent: true });
  await context.globalState.update(installStateKey, currentVersion);
}

export function activate(context: vscode.ExtensionContext): void {
  void autoInstallOnVersionChange(context).catch(error => {
    const message = error instanceof Error ? error.message : String(error);
    void vscode.window.showErrorMessage(`Failed to auto-install ${skillName}: ${message}`);
  });

  context.subscriptions.push(
    vscode.commands.registerCommand(`${commandPrefix}.installSkill`, async () => {
      try {
        await installSkillWithFeedback(context);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        void vscode.window.showErrorMessage(`Failed to install ${skillName}: ${message}`);
      }
    }),
    vscode.commands.registerCommand(`${commandPrefix}.openInstalledSkill`, async () => {
      const targetDir = getInstalledSkillDir();
      try {
        await fs.access(targetDir);
        await revealInOs(targetDir);
      } catch {
        const choice = await vscode.window.showWarningMessage(
          'Skill is not installed yet.',
          'Install Now'
        );
        if (choice === 'Install Now') {
          await vscode.commands.executeCommand(`${commandPrefix}.installSkill`);
        }
      }
    }),
    vscode.commands.registerCommand(`${commandPrefix}.openBundledSkill`, async () => {
      const document = await vscode.workspace.openTextDocument(getBundledSkillPath(context));
      await vscode.window.showTextDocument(document, { preview: false });
    })
  );
}

export function deactivate(): void {
  // No-op.
}
