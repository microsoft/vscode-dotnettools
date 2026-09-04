# Troubleshoot C# Dev Kit Workspace Requirements stages

Use this guide when a stage in the Workspace Requirements view reports **Failed** or **Needs attention**.

- [Workspace Requirements overview](workspace-requirements.md)
- [Install and manage SDKs and runtimes](workspace-requirements-installation.md)
- [Prepare for offline use](workspace-requirements-offline.md)

To open the view manually, run **C#: Check Workspace Requirements** from the Command Palette in Visual Studio Code.

## Install Tooling Requirements

For a missing SDK, incompatible `global.json`, SDK-generation selection, explicit SDK override, or missing tooling runtime, see [Install and manage .NET for C# Dev Kit Workspace Requirements](workspace-requirements-installation.md).

## Restore NuGet Packages

Select the stage to see the reported restore problem. Use its direct recovery action when available; otherwise select **Open output** and inspect the C# Dev Kit and NuGet output.

Typical causes include:

- An unavailable or unauthenticated package source.
- A package version that cannot be resolved.
- Network, proxy, or certificate configuration.
- A `global.json` or SDK problem that prevented MSBuild from running correctly.

After resolving the cause, select **Recheck workspace**.

## Verify the workspace outside C# Dev Kit

From a terminal opened at the same workspace folder, run:

```console
dotnet --info
dotnet restore
dotnet build --no-restore
```

`dotnet --info` shows the SDK selected from that directory, including the effect of `global.json`. A successful restore followed by a successful build proves that the selected SDK can evaluate the projects, resolve NuGet packages, and complete the normal build.

With the same SDK selection and environment, a workspace that restores and builds successfully should normally pass both **Restore NuGet Packages** and **Detect Project Runtime Configuration** in Workspace Requirements. During project detection, C# Dev Kit reads the evaluated target framework for every project configuration. Those target frameworks—not the build result itself—determine which project runtime versions appear in **Install Project Runtime Requirements**.

A successful build does not prove that every runtime needed to run, debug, or test the projects is installed. The SDK can compile a project using its targeting packs even when the corresponding shared runtime is missing. If restore or project detection still fails despite a successful terminal build, reload the VS Code window and recheck once. If the disagreement remains, collect logs and report it as a C# Dev Kit issue; include the successful terminal commands, the SDK reported by `dotnet --info`, and the projects' target frameworks.

## Detect Project Runtime Configuration

This stage runs project evaluation after restore. If detection fails:

1. Resolve any earlier tooling or restore failure first.
2. Select **Retry project detection** when available.
3. Select **Open output** for the complete project-system diagnostic.
4. Recheck the workspace after correcting the project or imported build files.

Project evaluation can fail because of invalid MSBuild configuration, unavailable SDK workloads, failing imported targets, or restore errors that prevent design-time build.

## Install Project Runtime Requirements

Workspace Requirements derives runtime requirements from the evaluated target frameworks. See [Install project runtime requirements](workspace-requirements-installation.md#install-project-runtime-requirements) for automatic and manual installation options.

## If the view appears stuck or stale

1. Wait for the active restore, project detection, or installation step to finish.
2. Select **Open output** and check whether the underlying command is still running or waiting for input.
3. Select **Recheck workspace** once.
4. If an SDK or runtime was installed successfully but is still not detected, reload the VS Code window.
5. If the same state remains, collect logs and report an issue.

Avoid repeatedly selecting an installation action while an installation is already running.

## Collect logs and report an issue

Run **.NET: Collect C# Dev Kit Logs** from the Command Palette and save the generated ZIP file. Do not post secrets, credentials, or private source code.

Before filing, search [existing C# Dev Kit issues](https://github.com/microsoft/vscode-dotnettools/issues). If the problem is new, [open a C# Dev Kit bug](https://github.com/microsoft/vscode-dotnettools/issues/new?template=bug.yml) and include:

- The stage and exact status shown in Workspace Requirements.
- The recovery action you selected and what happened.
- Your operating system, VS Code version, and C# Dev Kit version.
- Relevant `global.json` SDK settings, with private paths removed if necessary.
- Whether `dotnet.projectSdkPath` is configured.
- The collected C# Dev Kit logs ZIP.
