# Install .NET with C# Doctor on Windows

C# Doctor checks the SDK and runtimes that C# Dev Kit needs, then offers a recovery action when they are missing or incompatible.

## Do this

1. Run **C#: Check health with C# Doctor**.
2. Select the installation or repair action shown for the blocked requirement.
3. Approve elevation if Windows requests it.
4. Select **Recheck**. Use **Reload Window** if C# Doctor requests it.

[Review the shared SDK, runtime, and consent rules](health-check-installation.md).

## Know which installation C# Doctor will update

The system-wide installation is the default. Only an existing valid `dotnetup` installation that meets the condition below changes where C# Doctor repairs .NET.

| What C# Doctor finds | What happens |
|---|---|
| No usable user-managed installation | The .NET Install Tool requests the default system-wide installation. It can require elevation and is eligible for .NET servicing through Microsoft Update when that servicing is enabled. |
| A valid, current-architecture `dotnetup` `everywhere` hive that wins `PATH` | C# Doctor reuses that installation for repairs. You keep it updated with `dotnetup`; C# Dev Kit does not install or configure `dotnetup` for you. |
| An explicit user-controlled SDK path | C# Doctor reports the problem but does not modify that installation. |

Visual Studio acquires and services .NET through the Visual Studio Installer. Repairing .NET for C# Dev Kit does not replace Visual Studio servicing.

## Repair a missing tooling SDK or runtime

**We require:** A supported tooling SDK and its .NET and ASP.NET Core runtimes must be available through the installation selected above.

**Fix it:** Select the SDK installation action shown in C# Doctor and approve elevation if Windows requests it.

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
