# Install .NET with C# Doctor on Linux

C# Doctor checks the SDK and runtimes that C# Dev Kit needs and manages them in a shared per-user `dotnetup` installation without elevation.

## Do this

1. Run **C#: Check health with C# Doctor**.
2. Select the installation or repair action shown for the blocked requirement.
3. Let C# Doctor refresh the official `dotnetup` installer and complete the required acquisition.
4. Select **Recheck**. Use **Reload Window** if C# Doctor requests it.

[Review the shared SDK, runtime, and consent rules](health-check-installation.md).

C# Doctor uses the exact shared per-user .NET location resolved by its provider rather than guessing a location from `PATH`. That installation is shared by your C# Dev Kit workspaces and is updated through `dotnetup`. An explicit user-controlled SDK path is reported but not modified.

## Repair a missing tooling SDK or runtime

**We require:** A supported tooling SDK and its .NET and ASP.NET Core runtimes must be available in the shared per-user installation.

**Fix it:** Select the SDK installation action shown in C# Doctor; no administrator access is required.

**Verify:** Select **Recheck**, then run `dotnet --info` in a new shell and confirm it selects the expected installation.

**Still blocked?** See [Tooling Requirements troubleshooting](health-check-troubleshooting.md#tooling-requirements).

## Repair an incompatible `global.json`

**We require:** The `global.json` that governs the first workspace folder must allow the supported tooling SDK.

**Fix it:** Use the proposed C# Doctor repair only if it matches the repository's SDK policy, or ask the repository owner to update `version`, `rollForward`, `allowPrerelease`, or `paths`.

**Verify:** Run `dotnet --info` from the workspace folder, then select **Recheck**.

**Still blocked?** See [Tooling Requirements troubleshooting](health-check-troubleshooting.md#tooling-requirements).

## Install missing project runtimes

**We require:** Every .NET and ASP.NET Core runtime band reported from the projects' evaluated target frameworks must be installed.

**Fix it:** Select **Install missing .NET runtimes** when offered; otherwise install each reported runtime from [Download .NET](https://aka.ms/dotnet-download).

**Verify:** Run `dotnet --list-runtimes`, then select **Recheck**.

**Still blocked?** See [Project Runtime Requirements troubleshooting](health-check-troubleshooting.md#project-runtime-requirements).

## Fix shell and `PATH` selection

**We require:** A new shell must be able to find the intended `dotnet` host and the same SDK generation.

**Fix it:** Open a new shell, inspect `command -v dotnet` and `dotnet --info`, and correct your shell startup files if another installation wins `PATH`.

**Verify:** Restart VS Code from the corrected environment, select **Recheck**, and reload if requested.

**Still blocked?** See [stale-result troubleshooting](health-check-troubleshooting.md#if-the-view-appears-stuck-or-stale).

> [!NOTE]
> Use these Linux checks only when C# Dev Kit is running in a Linux environment. Launching Windows VS Code from a WSL shell does not by itself validate the Linux installation.
