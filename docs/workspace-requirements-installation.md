# Install and manage .NET for C# Dev Kit Workspace Requirements

This guide explains how C# Dev Kit selects and installs the tooling SDK and the project runtimes shown in Workspace Requirements.

- [Workspace Requirements overview](workspace-requirements.md)
- [Prepare for offline use](workspace-requirements-offline.md)
- [Troubleshoot failed stages](workspace-requirements-troubleshooting.md)

## Installation requires your consent

Opening, refreshing, restoring, or rechecking the Workspace Requirements view does not install software. Installation starts only after you select an explicit action such as **Install .NET SDK** or **Install missing .NET runtimes**.

**Recheck workspace** refreshes the diagnosis after you change an SDK, runtime, setting, or `global.json`. It does not install anything.

## Recommended installation by operating system

Installation ownership depends on the operating system:

- **Windows:** C# Dev Kit uses the .NET Install Tool to request a standard, system-wide .NET installation. This is the installation model supported by Visual Studio and is eligible for normal .NET servicing through Microsoft Update when that servicing is enabled. It may request elevation. Normal SDK and Visual Studio version-compatibility rules still apply. If automatic project-runtime installation is unavailable, Workspace Requirements provides the official download page for each missing runtime version.
- **macOS and Linux:** C# Dev Kit uses `dotnetup` to manage .NET in a per-user location shared by your workspaces. This avoids requiring administrator access and gives C# Dev Kit a consistent SDK and runtime location on platforms without the Windows/Visual Studio system-install servicing model.
- **User-controlled .NET installations:** C# Dev Kit does not modify an installation selected through an explicit SDK path or another user-controlled location.

This split is intentional. The recommended Windows path remains compatible with standard Windows and Visual Studio installation and update mechanisms. On macOS and Linux, `dotnetup` provides the user-local acquisition and update path. In both cases, Workspace Requirements verifies the selected SDK and runtimes after installation.

## Use `dotnetup` as a user-managed Windows alternative

C# Dev Kit can also use a compatible SDK installed and managed with [`dotnetup`](https://github.com/dotnet/sdk/tree/release/dnup/documentation/general/dotnetup) on Windows. This is an alternative to the recommended system-wide Windows installation and can be useful when you want a user-local installation, SDK updates without an administrator, or one SDK selection shared by command-line tools and agents.

Adopting `dotnetup` for your general environment has broader effects than changing the C# Dev Kit SDK-generation setting:

- `dotnetup` installs into a user-managed hive. On Windows, those SDKs and runtimes are **not serviced by Microsoft Update**; use `dotnetup` to check for and apply their updates.
- Environment modes that put the `dotnetup` host on `PATH` can change which .NET installation is selected by terminals, scripts, build tools, agents, VS Code, and other applications launched as that user.
- Visual Studio acquires and services .NET through the Visual Studio Installer and remains more tightly coupled to particular SDKs. A `dotnetup` installation does not replace Visual Studio servicing, and not every Visual Studio operation is guaranteed to select the same user-local SDK. Verify important build, test, and publish workflows in both Visual Studio and VS Code.
- User-local SDK management does not install or service machine components such as Visual Studio workloads, the ASP.NET Core Hosting Bundle, or other globally installed runtime components.

After configuring `dotnetup`, open a new terminal and run `dotnet --info` to confirm which host and SDK are selected. Then run `dotnet restore` and `dotnet build` for the workspace before rechecking Workspace Requirements.

If you only want to switch C# Dev Kit between its default and .NET 11 SDK generations, use the C# commands described below instead. That changes C# Dev Kit's selection without adopting a user-managed .NET installation as the default for other tools.

## Install a missing tooling SDK

Use the action in Workspace Requirements to install the supported SDK, or install it manually from [Download .NET](https://dotnet.microsoft.com/download).

After installation, select **Recheck workspace**. If the view asks you to reload, use **Reload Window** so all extension processes use the same SDK selection.

## Resolve a `global.json` SDK conflict

The nearest `global.json` governing the first workspace folder controls .NET SDK selection. Its `sdk.version`, `rollForward`, `allowPrerelease`, and `paths` settings can prevent an installed SDK from being selected.

Use the proposed Workspace Requirements action when it matches your repository's SDK policy. C# Dev Kit creates a backup before applying a proposed edit. For manual changes, see [.NET SDK selection with global.json](https://learn.microsoft.com/dotnet/core/tools/global-json).

Common causes include:

- The pinned SDK version is older than the version supported by the installed C# Dev Kit.
- `rollForward` is too restrictive for the installed SDK feature band.
- A prerelease SDK is pinned without `allowPrerelease: true`.
- `sdk.paths` limits selection to a directory that does not contain the required SDK.

Repository owners should generally check in `global.json` changes so every contributor and build agent uses the intended policy.

## Use the .NET 11 SDK generation

If the workspace targets .NET 11, use **Use .NET 11 SDK** when offered. This changes C# Dev Kit's generation-specific setting; it does not create a general preference for every future preview SDK generation.

## How the default SDK generation advances

Workspace Requirements follows the supported stable .NET generation while keeping the next preview generation behind an explicit, generation-specific opt-in:

- While .NET 11 is in preview, C# Dev Kit uses the supported .NET 10 SDK by default and offers an explicit .NET 11 opt-in.
- When .NET 11 releases, Workspace Requirements will require the supported .NET 11 SDK as the default tooling generation.
- .NET 12 Preview will have a new .NET 12-specific opt-in flag and command. The .NET 11 preference will not silently opt a user into .NET 12 Preview.

This changes the SDK used to run C# Dev Kit tooling; it does not require projects to retarget. Projects can continue targeting older supported TFMs, with their corresponding runtime bands installed for Run, Debug, and Test.

## Switch between the default and .NET 11 SDK generations

You can change the C# Dev Kit tooling SDK generation at any time from the Command Palette:

- Run **C#: Use .NET 11 SDK** to select the supported .NET 11 SDK generation.
- Run **C#: Use Default .NET SDK** to return to the default stable SDK generation.

The equivalent setting is `dotnet.useDotnet11Sdk`. Set it to `true` for .NET 11 or `false` for the default SDK generation. The command updates the user, workspace, or workspace-folder scope that currently controls the setting.

Reload the VS Code window after switching so C# Dev Kit, MSBuild, restore, and other SDK-dependent features all start with the same selection. Then run **C#: Check Workspace Requirements** to verify it.

Switching back to the default SDK does not require uninstalling .NET 11. .NET SDK generations can be installed side by side, and C# Dev Kit selects the configured generation. Uninstall an SDK only if you also need to reclaim disk space or remove it from the machine; switching the C# Dev Kit setting is the safer way to change which generation the tooling uses.

If the workspace itself targets .NET 11 or its `global.json` requires a .NET 11 SDK, returning to the default generation will leave that workspace blocked. Change the project or repository SDK policy only if the repository is intended to build with the default generation.

## Resolve an explicit SDK path

The `dotnet.projectSdkPath` setting overrides default SDK discovery for C# Dev Kit. Verify that it points to a working `dotnet` host with the required SDK and runtimes.

If the override is no longer needed, use **Use default .NET SDK** when offered. This clears the C# Dev Kit override and returns selection to .NET's default SDK rules. It does not delete or modify the referenced installation.

## Install project runtime requirements

The SDK builds projects, while project runtimes are needed to run, debug, or test them. Workspace Requirements derives the required runtime bands from each project's evaluated target framework. It uses evaluated project data so imported, computed, conditional, and multi-targeted frameworks are represented correctly rather than installing from unevaluated project-file text.

When a runtime is missing:

- Use **Install missing .NET runtimes** when automatic installation is available.
- Otherwise follow the version-specific .NET download links shown in the view. Install both the **.NET Runtime** and **ASP.NET Core Runtime** when requested.
- Select **Recheck workspace** after manual installation.

A missing project runtime normally appears as **Needs attention** because editing and building may still work. An attempted installation that fails appears as **Failed** with an installation-output action.
