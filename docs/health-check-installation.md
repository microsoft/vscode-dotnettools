<a id="install-and-manage-net-for-c-health-check"></a>

# Install and manage .NET with C# Doctor

C# Doctor checks the .NET SDK used by C# Dev Kit and the runtimes needed by your projects. Choose your operating system for the shortest recovery steps:

<a id="recommended-installation-by-operating-system"></a>

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

<a id="install-a-missing-tooling-sdk"></a>
<a id="resolve-a-globaljson-sdk-conflict"></a>
<a id="install-project-runtime-requirements"></a>

## Know what C# Doctor requires

- **Tooling SDK and runtimes:** C# Dev Kit needs a supported SDK generation plus its .NET and ASP.NET Core runtimes to restore, evaluate, and build the workspace.
- **Project runtimes:** Projects also need the .NET and ASP.NET Core runtime bands identified from their evaluated target frameworks to run, debug, or test. These can differ from the tooling SDK generation.
- **SDK policy:** The nearest `global.json` that governs the first workspace folder must allow the tooling SDK to be selected. Its `version`, `rollForward`, `allowPrerelease`, and `paths` settings all affect selection.

For manual recovery, use [Download .NET](https://dotnet.microsoft.com/download), review [.NET SDK selection with global.json](https://learn.microsoft.com/dotnet/core/tools/global-json), or consult the [`dotnetup` documentation](https://github.com/dotnet/sdk/tree/release/dnup/documentation/general/dotnetup) when that tool owns your installation.

<a id="use-the-net-11-sdk-generation"></a>
<a id="how-the-default-sdk-generation-advances"></a>
<a id="switch-between-the-default-and-net-11-sdk-generations"></a>

C# Dev Kit uses the SDK selected by the .NET CLI for the workspace when it meets the workspace and tooling requirements. If the selected SDK is incompatible or unavailable, C# Doctor offers a relevant repair. Do not downgrade the SDK to work around a project or `global.json` requirement that the older SDK cannot satisfy.

<a id="resolve-an-explicit-sdk-path"></a>

If `dotnet.projectSdkPath` or another explicit .NET path override selects an invalid installation, review the scopes listed by C# Doctor before selecting **Clear .NET path overrides**. This removes the selected overrides, not the referenced .NET installation. Reload the window when requested so C# Dev Kit can evaluate the workspace again using normal .NET CLI selection.

When C# Doctor proposes a `global.json` repair, review the preview and apply it only when it matches the repository's intended SDK policy. Recheck afterward to confirm that the workspace selects a compatible SDK.

## After any installation or SDK change

1. Select **Recheck** in C# Doctor.
2. If C# Doctor asks you to reload, use **Reload Window**.
3. If the result is still blocked, follow the verification steps in the [Windows](health-check-installation-windows.md) or [macOS and Linux](health-check-installation-macos-linux.md) guide.

To open C# Doctor, run **C#: Check health with C# Doctor** from the Command Palette in Visual Studio Code.
