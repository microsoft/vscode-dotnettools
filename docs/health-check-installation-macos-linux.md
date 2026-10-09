# Install .NET with C# Doctor on macOS and Linux

C# Doctor checks the SDK and runtimes that C# Dev Kit needs. It can install required components into a managed per-user installation without elevation. On eligible Linux systems, it can instead install an explicitly requested stable SDK into the selected package-owned system host. Otherwise, it guides you when the workspace uses an installation managed by another tool.

## Do this

1. Run **C#: Check health with C# Doctor**.
2. Select the installation or repair action shown for the blocked requirement.
3. Let C# Doctor complete the managed installation, authorize an eligible Linux system SDK installation when prompted, or follow the manual recovery guidance for your selected .NET host.
4. Select **Recheck**. A Linux system SDK installation rechecks without reloading by default; use **Reload Window** only if C# Doctor requests it.

[Review the shared SDK, runtime, and consent rules](health-check-installation.md).

C# Doctor uses a compatible .NET host selected by the CLI for the workspace. It modifies an installation only when it is authorized to manage that installation. If a package manager, version manager, explicit path, or other user-controlled installation selects `dotnet`, repair it with its owning tool, select a compatible installation, or clear an invalid explicit path override. The eligible Linux system SDK installation below is the only package-manager exception.

<a id="install-an-sdk-into-an-eligible-linux-system-host"></a>

## Install an SDK into an eligible Linux system host

C# Doctor can offer an explicit system SDK installation only when all of these conditions are met:

- The selected `dotnet` is a package-owned system host on a supported Ubuntu or Debian, Fedora, RHEL, or CentOS Stream, or SLES or openSUSE installation.
- C# Doctor verifies one already configured, unambiguous, trusted .NET package feed for the distribution's `apt`, `dnf`, or `zypper` package manager.
- The session can show a local graphical polkit authorization prompt.

C# Doctor invokes the package manager through `pkexec` after you select the system installation action. It never adds, removes, enables, disables, or changes a package repository; changes `PATH`; runs or asks you to run `sudo`; or drives a terminal. The installation must produce a package receipt and the requested SDK must then resolve from the exact `dotnet` host that C# Doctor inspected. If either verification fails, C# Doctor reports the failure instead of treating the installation as successful.

This system action installs stable SDKs only. It does not install preview SDKs or .NET or ASP.NET Core runtimes. Use the per-user installation or the host's owning tool for those components.

C# Doctor does not offer automatic system SDK repair in WSL, Remote - SSH sessions, headless or container environments, or immutable or read-only systems. It also falls back to manual guidance when the feed, package ownership, host identity, authorization, or distribution cannot be verified unambiguously. Configure or repair the system with its owning package-management workflow, then select **Recheck**.

## Repair a missing tooling SDK or runtime

**We require:** The SDK selected by the .NET CLI for the workspace must satisfy the workspace and tooling requirements, and its required .NET and ASP.NET Core runtimes must be available.

**Fix it:** Select the installation action shown in C# Doctor when it can manage the selected installation; no administrator access is required for its per-user installation. On eligible Linux systems, you can instead select the system SDK installation and authorize `pkexec` through the graphical polkit prompt. Otherwise repair the user-controlled installation with its owning tool or correct the workspace's .NET selection.

**Verify:** Select **Recheck**, then run `dotnet --info` in a new terminal and confirm your shell selects the expected installation. C# Doctor rechecks a completed Linux system SDK installation without requesting a reload by default.

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

**Fix it:** Open a new shell, inspect `which dotnet` and `dotnet --info`, and correct your shell startup files if another installation wins `PATH`.

**Verify:** Restart VS Code from the corrected shell environment, select **Recheck**, and reload if requested.

**Still blocked?** See [stale-result troubleshooting](health-check-troubleshooting.md#if-the-view-appears-stuck-or-stale).

> [!NOTE]
> Use these Linux checks only when C# Dev Kit is running in a Linux environment. Launching Windows VS Code from a WSL shell does not by itself validate the Linux installation.
