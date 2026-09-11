# Install .NET with C# Doctor on Windows

C# Doctor checks the SDK and runtimes that C# Dev Kit needs, then offers a recovery action when they are missing or incompatible.

## Do this

1. Run **C#: Check health with C# Doctor**.
2. Select the installation or repair action shown for the blocked requirement.
3. Approve elevation if Windows requests it.
4. Select **Recheck**. Use **Reload Window** if C# Doctor requests it.

[Review the shared SDK, runtime, and consent rules](health-check-installation.md).

## Know which installation C# Doctor can update

C# Doctor uses a compatible .NET host selected by the CLI for the workspace. It modifies an installation only when it is authorized to manage that installation.

| What C# Doctor finds | What happens |
|---|---|
| C# Doctor can manage the selected installation | The offered repair installs the required components. A system-wide installation can require elevation and is eligible for .NET servicing through Microsoft Update when that servicing is enabled. |
| A package manager, version manager, explicit path, or other user-controlled installation selects `dotnet` | C# Doctor reports the requirement without silently changing or bypassing that installation. Repair it with its owning tool, select a compatible installation, or clear an invalid explicit path override. |

Visual Studio acquires and services .NET through the Visual Studio Installer. Repairing .NET for C# Dev Kit does not replace Visual Studio servicing.

## Repair a missing tooling SDK or runtime

**We require:** The SDK selected by the .NET CLI for the workspace must satisfy the workspace and tooling requirements, and its required .NET and ASP.NET Core runtimes must be available.

**Fix it:** Select the installation action shown in C# Doctor when it can manage the selected installation, and approve elevation if Windows requests it. Otherwise repair the user-controlled installation with its owning tool or correct the workspace's .NET selection.

**Verify:** Select **Recheck**, then run `dotnet --info` in a new terminal if the result remains blocked.

**Still blocked?** See [Tooling Requirements troubleshooting](health-check-troubleshooting.md#tooling-requirements).

## Repair an incompatible `global.json`

**We require:** The `global.json` that governs the first workspace folder must allow the supported tooling SDK.

**Fix it:** Use the proposed C# Doctor repair only if it matches the repository's SDK policy, or ask the repository owner to update `version`, `rollForward`, `allowPrerelease`, or `paths`.

**Verify:** Select **Recheck** and confirm the expected SDK under `dotnet --info` from the workspace folder.

**Still blocked?** See [Tooling Requirements troubleshooting](health-check-troubleshooting.md#tooling-requirements).

## Install missing project runtimes

**We require:** Every .NET and ASP.NET Core runtime band reported from the projects' evaluated target frameworks must be installed.

**Fix it:** Select **Install missing .NET runtimes** when offered; otherwise install each reported runtime from [Download .NET](https://aka.ms/dotnet-download).

**Verify:** Run `dotnet --list-runtimes`, then select **Recheck**.

**Still blocked?** See [Project Runtime Requirements troubleshooting](health-check-troubleshooting.md#project-runtime-requirements).

## Refresh a stale inherited `PATH`

**We require:** VS Code must inherit the `PATH` that selects the intended .NET host.

**Fix it:** **Exit Visual Studio Code**, close every VS Code window, and relaunch VS Code from Start or File Explorer. **Reload Window** and opening a new terminal are not enough to replace the environment inherited by the existing VS Code process.

**Verify:** Run `dotnet --info` in a new VS Code terminal, then select **Recheck**.

**Still blocked?** See [stale-result troubleshooting](health-check-troubleshooting.md#if-the-view-appears-stuck-or-stale).
