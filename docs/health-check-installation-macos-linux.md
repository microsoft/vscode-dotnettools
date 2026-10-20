# Install .NET with C# Doctor on macOS and Linux

C# Doctor checks the SDK and runtimes that C# Dev Kit needs. It can install required components into a managed per-user installation without elevation, or guide you when the workspace uses an installation managed by another tool.

## Do this

1. Run **C#: Check health with C# Doctor**.
2. Select the installation or repair action shown for the blocked requirement.
3. Let C# Doctor complete the managed installation, or follow the manual recovery guidance for your selected .NET host.
4. Select **Recheck**. Use **Reload Window** if C# Doctor requests it.

Before the first SDK or runtime installation needed in an extension session, C# Dev Kit updates its selected `dotnetup` CLI with `dotnetup self update --no-progress`. This updates the CLI itself, not the SDK or runtimes, and keeps the executable at its current location. C# Dev Kit checks `dotnetup self update --help` for the supported command before running it, so it does not confuse CLI self-update with `dotnetup update` for SDKs or runtimes. If the selected CLI is too old, C# Dev Kit refreshes it in the same directory using the official bootstrap and retries; if no CLI is present, it bootstraps one at the normal acquisition location and then self-updates. If refresh fails, C# Dev Kit reports diagnostics and uses only the available CLI; cancellation or an updater that does not finish aborts the installation.

[Review the shared SDK, runtime, and consent rules](health-check-installation.md).

C# Doctor uses a compatible .NET host selected by the CLI for the workspace. It modifies an installation only when it is authorized to manage that installation. If a package manager, version manager, explicit path, or other user-controlled installation selects `dotnet`, repair it with its owning tool, select a compatible installation, or clear an invalid explicit path override.

## Repair a missing tooling SDK or runtime

**We require:** The SDK selected by the .NET CLI for the workspace must satisfy the workspace and tooling requirements, and its required .NET and ASP.NET Core runtimes must be available.

**Fix it:** Select the installation action shown in C# Doctor when it can manage the selected installation; no administrator access is required for its per-user installation. Otherwise repair the user-controlled installation with its owning tool or correct the workspace's .NET selection.

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

After C# Doctor successfully installs and verifies a tooling SDK, it can configure your login shell when the newly installed SDK's canonical root matches the default root reported by `dotnetup`. C# Dev Kit asks the selected `dotnetup` CLI to run `env set shell --shell <shell>` for the detected login shell (`bash`, `zsh`, `fish`, or `pwsh`). This preserves your existing `dotnetup`-on-`PATH` preference. The SDK installation remains available if shell configuration is not supported or fails.

Shell configuration is not attempted for Windows, runtime-only installs, SDKs already present in the inventory, or discovery and recheck. If the login shell is unknown or unavailable, or the SDK uses a custom non-default root, C# Doctor keeps the verified SDK and provides manual shell configuration guidance instead. A configuration failure is reported as an operation failure; selecting **Retry** in the same extension session resumes configuration without reinstalling the SDK. After restarting the extension, follow the manual instructions rather than expecting the SDK to be installed again.

For a manual Bash or Zsh setup, run the command for your login shell with the currently available `dotnetup` executable (use its full path if it is not on `PATH`):

```sh
dotnetup env set shell --shell bash
```

For Zsh, use `--shell zsh` instead. To inspect the current configuration, run `dotnetup env show`.

The managed shell profile references the exact `dotnetup` executable used to configure it. If that executable is moved or removed—for example, after an extension update—rerun `env set shell` with the currently available `dotnetup` executable to update the profile.

> [!NOTE]
> `dotnetup sdk install --set-default-install` currently does not configure your shell environment. Use `dotnetup env set shell` for shell setup; C# Dev Kit does not execute generated shell code or change its process environment.

Profile changes do not refresh an already-running terminal or GUI-launched VS Code. Open a new shell and verify `command -v dotnet`, `dotnet --info`, and `DOTNET_ROOT`; if VS Code still uses the old environment, relaunch it from the corrected environment.

**Verify:** Select **Recheck** and reload if requested. If needed, restart VS Code from the corrected shell environment.

**Still blocked?** See [stale-result troubleshooting](health-check-troubleshooting.md#if-the-view-appears-stuck-or-stale).

> [!NOTE]
> Use these Linux checks only when C# Dev Kit is running in a Linux environment. Launching Windows VS Code from a WSL shell does not by itself validate the Linux installation.
