<a id="install-and-manage-net-for-c-health-check"></a>

# Install and manage .NET with C# Doctor

C# Doctor checks the .NET SDK used by C# Dev Kit and the runtimes needed by your projects. Choose your operating system for the shortest recovery steps:

| Operating system | Installation guide |
|---|---|
| Windows | [Install .NET on Windows](health-check-installation-windows.md) |
| macOS or Linux | [Install .NET on macOS and Linux](health-check-installation-macos-linux.md) |

- [C# Doctor overview](health-check.md)
- [Prepare for offline use](health-check-offline.md)
- [Troubleshoot failed stages](health-check-troubleshooting.md)

## Installation requires your consent

Opening C# Doctor, refreshing results, restoring the workspace, and selecting **Recheck** do not install software. Installation begins only after you select an explicit installation action. Windows system installation might also require elevation.

C# Dev Kit does not modify an installation selected through `dotnet.projectSdkPath` or another explicit user-controlled location.

## Know what C# Doctor requires

- **Tooling SDK and runtimes:** C# Dev Kit needs a supported SDK generation plus its .NET and ASP.NET Core runtimes to restore, evaluate, and build the workspace.
- **Project runtimes:** Projects also need the .NET and ASP.NET Core runtime bands identified from their evaluated target frameworks to run, debug, or test. These can differ from the tooling SDK generation.
- **SDK policy:** The nearest `global.json` that governs the first workspace folder must allow the tooling SDK to be selected. Its `version`, `rollForward`, `allowPrerelease`, and `paths` settings all affect selection.

C# Dev Kit uses one configured tooling SDK generation across the workspace. **C#: Use .NET 11 SDK** selects the supported .NET 11 generation, and **C#: Use Default .NET SDK** returns to the default stable generation. These commands update the user, workspace, or workspace-folder setting that already controls the selection; they do not retarget projects or uninstall another SDK.

## After any installation or SDK change

1. Select **Recheck** in C# Doctor.
2. If C# Doctor asks you to reload, use **Reload Window**.
3. If the result is still blocked, follow the verification steps in the [Windows](health-check-installation-windows.md) or [macOS and Linux](health-check-installation-macos-linux.md) guide.

To open C# Doctor, run **C#: Check health with C# Doctor** from the Command Palette in Visual Studio Code.
