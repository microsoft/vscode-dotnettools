# Install .NET with C# Doctor on macOS and Linux

C# Doctor checks the SDK and runtimes that C# Dev Kit needs. It can install required components into a managed per-user installation without elevation, or guide you when the workspace uses an installation managed by another tool.

## Do this

1. Run **C#: Check health with C# Doctor**.
2. Review the proposed repair, then select **Install for C# Dev Kit** to consent.
3. Let C# Doctor complete the managed installation, or follow the manual recovery guidance for your selected .NET host.
4. Select **Recheck**. Use **Reload Window** if C# Doctor requests it.

[Review the shared SDK, runtime, and consent rules](health-check-installation.md).

C# Doctor uses a compatible .NET host selected by the CLI for the workspace. It modifies an installation only after you consent and only when dotnetup is authorized to manage it. If a package manager, version manager, explicit path, or other user-controlled installation selects `dotnet`, repair it with its owning tool, select a compatible installation, or clear an invalid explicit path override. C# Doctor leaves external package managers, version managers, and their installation roots untouched.

## Understand dotnetup-managed repair

For a new installation or a provider-default installation on macOS or Linux, **Install for C# Dev Kit** installs or migrates the matching SDK and runtime channels into dotnetup's canonical per-user root. Dotnetup owns its marked supported-shell profile block, the managed `dotnet` and `DOTNET_ROOT` values in that block, and its own `PATH` entry.

C# Dev Kit uses the verified host immediately after repair. Existing terminals and other running applications keep their previous environment until you restart them. Fresh supported shells use the canonical dotnetup installation.

An existing qualifying installation in a noncanonical persisted root remains available only to C# Dev Kit. C# Doctor does not implicitly migrate it or modify your shell profile. Explicit Visual Studio Code .NET path overrides and `global.json` remain authoritative in either case.

To reverse dotnetup's shell integration, run `dotnetup env clear`. This is the official reversal operation: it removes dotnetup's managed environment configuration but does not uninstall SDKs or runtimes.

## Repair a missing tooling SDK or runtime

**We require:** The SDK selected by the .NET CLI for the workspace must satisfy the workspace and tooling requirements, and its required .NET and ASP.NET Core runtimes must be available.

**Fix it:** Select **Install for C# Dev Kit** when C# Doctor offers a dotnetup-managed repair; no administrator access is required for its per-user installation. Otherwise repair the user-controlled installation with its owning tool or correct the workspace's .NET selection.

**Verify:** Select **Recheck**, then run `dotnet --info` in a new terminal and confirm your shell selects the expected installation.

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

**We require:** A new shell must be able to find the intended `dotnet` host and select a compatible SDK from the workspace.

**Fix it:** After a dotnetup-managed repair, restart existing terminals and applications. In a fresh supported shell, inspect `which dotnet` and `dotnet --info`; the shell should select the canonical dotnetup installation. If a user-controlled installation should win `PATH`, manage it with its owning tool instead of editing dotnetup's marked profile block.

**Verify:** Restart VS Code from the corrected shell environment, select **Recheck**, and reload if requested.

**Still blocked?** See [stale-result troubleshooting](health-check-troubleshooting.md#if-the-view-appears-stuck-or-stale).

> [!NOTE]
> Use these Linux checks only when C# Dev Kit is running in a Linux environment. Launching Windows VS Code from a WSL shell does not by itself validate the Linux installation.
