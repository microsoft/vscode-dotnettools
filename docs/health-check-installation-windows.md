# Install .NET with C# Doctor on Windows

C# Doctor checks the SDK and runtimes that C# Dev Kit needs, then offers a recovery action when they are missing or incompatible.

## Do this

1. Run **C#: Check health with C# Doctor**.
2. Select **Install** when the Windows system .NET installation is missing a required SDK or runtime.
3. Approve elevation if Windows requests it.
4. Select **Recheck**. Use **Reload Window** only if C# Doctor requests it. Exit all Visual Studio Code windows only if C# Doctor still requests a full restart after reload.

[Review the shared SDK, runtime, and consent rules](health-check-installation.md).

## Know which installation C# Doctor can update

C# Doctor uses the Windows system .NET installation for ambient SDK discovery and repair. An explicit VS Code SDK path override remains a use-only selection and is never modified automatically.

| What C# Doctor finds | What happens |
|---|---|
| The Windows system installation is missing a required SDK or runtime | C# Doctor offers **Install** for the system location. The operation can require elevation and the installation is eligible for .NET servicing through Microsoft Update when that servicing is enabled. |
| `dotnet.projectSdkPath` selects a complete compatible SDK | C# Doctor uses that explicit installation without changing it. |
| An explicit VS Code SDK or runtime path is unavailable, incompatible, or incomplete | C# Doctor offers **Clear .NET path overrides** after previewing the configured values. It does not repair or mutate the explicit installation. |
| `PATH`, `DOTNET_HOST_PATH`, `DOTNET_ROOT`, a package manager, a version manager, or a user dotnetup root contains another SDK | C# Doctor does not recognize that ambient SDK as the Windows workspace SDK or repair owner. It evaluates the system installation instead. |

Visual Studio acquires and services .NET through the Visual Studio Installer. Repairing .NET for C# Dev Kit does not replace Visual Studio servicing.

## Repair a missing tooling SDK or runtime

**We require:** Unless an explicit `dotnet.projectSdkPath` selects a complete compatible SDK, the Windows system .NET installation must contain an SDK that satisfies the workspace and tooling requirements, plus the runtime needed to execute it.

**Fix it:** Select the installation action shown in C# Doctor and approve elevation if Windows requests it. C# Doctor installs into the system .NET location rather than asking you to repair a custom ambient root.

**Verify:** Select **Recheck**. If C# Doctor requests **Reload Window**, reload once so a fresh extension host can activate the verified system SDK.

**Still blocked?** See [Tooling Requirements troubleshooting](health-check-troubleshooting.md#tooling-requirements).

## Understand `global.json` on Windows

**We require:** `sdk.version`, `rollForward`, and `allowPrerelease` must permit a supported SDK in the Windows system installation.

C# Doctor ignores `global.json` `sdk.paths` on Windows for SDK discovery, installation authorization, and acquisition identity. A custom `sdk.paths` entry does not redirect C# Doctor to a repository-local or user-controlled SDK root.

**Fix it:** Use a proposed C# Doctor repair only when the version, roll-forward, or prerelease policy is incompatible and the change matches the repository's SDK policy.

**Verify:** Select **Recheck** and confirm that C# Doctor reports the expected system SDK or explicit VS Code SDK override.

**Still blocked?** See [Tooling Requirements troubleshooting](health-check-troubleshooting.md#tooling-requirements).

## Install missing project runtimes

**We require:** Every .NET and ASP.NET Core runtime band reported from the projects' evaluated target frameworks must be installed.

**Fix it:** Select **Install missing .NET runtimes** when offered; otherwise install each reported runtime from [Download .NET](https://aka.ms/dotnet-download).

**Verify:** Run `dotnet --list-runtimes`, then select **Recheck**.

**Still blocked?** See [Project Runtime Requirements troubleshooting](health-check-troubleshooting.md#project-runtime-requirements).

## Apply a newly installed system SDK

C# Doctor verifies the installed system SDK and retries activation before requesting a reload. If the running extension host cannot adopt it, select **Reload Window**.

After reload, C# Doctor verifies the fixed system host directly rather than relying on the inherited `PATH`. Exit all Visual Studio Code windows and relaunch only if C# Doctor reports that the verified system SDK is still unavailable. Do not restart merely to activate a custom or user dotnetup root.
