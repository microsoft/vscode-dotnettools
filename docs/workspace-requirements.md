# C# Dev Kit Workspace Requirements

C# Dev Kit checks that the .NET tooling and project runtimes required by your workspace are available. If something needs attention, the **Workspace Requirements** view identifies the affected stage and offers a recovery action.

## The happy path

C# Dev Kit needs two different parts of .NET to be current and complete:

1. **The latest SDK generation supported by C# Dev Kit** runs the tooling, restore, project evaluation, and builds. This gives the entire toolchain the performance, reliability, coordination, and caching improvements delivered in the current SDK and MSBuild.
2. **The runtime bands required by your projects' evaluated target frameworks (TFMs)** run, debug, and test the applications. Install the .NET and ASP.NET Core runtime bands identified by Workspace Requirements.

The tooling SDK and project target frameworks do not have to be the same generation. For example, a project targeting `net8.0` can be built with a newer supported tooling SDK while still requiring the .NET 8 runtime to run, debug, or test. A multi-targeted workspace may need several runtime bands installed side by side.

The supported tooling generation advances with .NET releases. While .NET 11 is in preview, the default remains the supported .NET 10 SDK and .NET 11 is an explicit opt-in. When .NET 11 releases, Workspace Requirements will require the supported .NET 11 SDK as the default. Trying .NET 12 Preview will require a new .NET 12-specific opt-in flag and command; an earlier preview preference will not silently move users to the next preview generation.

For the normal setup:

1. Use the SDK generation recommended by Workspace Requirements.
2. Make sure the repository's `global.json`, if present, allows that SDK to be selected.
3. Restore and build the workspace successfully.
4. Install the runtime bands reported for the evaluated project TFMs.
5. Select **Recheck workspace**. Reload the VS Code window if requested.

## Why C# Dev Kit checks workspace requirements

C# Dev Kit relies on capabilities delivered in the .NET SDK and MSBuild—not only on code contained in the extension. Using the latest SDK generation supported by C# Dev Kit gives the tooling access to project-system, build-coordination, caching, and evaluation improvements that make large workspaces and repeated builds more responsive and use fewer machine resources.

Why the latest supported SDK, rather than simply any installed SDK? These improvements ship in the SDK and MSBuild. Selecting the same older SDK everywhere may make behavior consistent, but it cannot provide capabilities that were not included in that SDK. Staying current is how C# Dev Kit can keep delivering performance and reliability improvements across the .NET toolchain.

See [measured examples from Aspire, Fast Build, and concurrent MSBuild workloads](workspace-requirements-performance.md) for the kinds of time-to-IntelliSense, memory, and incremental-build improvements this work enables.

This matters even more when command-line tools and AI agents run builds in parallel. If each tool selects a different SDK or performs the same project work independently, builds compete for CPU and memory and cannot reliably share improvements. A consistent, current tooling SDK is the foundation for making those operations coordinated and avoiding unnecessary work.

The SDK used to run the tooling is separate from the frameworks your projects target. Moving the tooling to a newer supported SDK does **not** require every project to change its target framework. A current SDK can continue to build projects that target older supported .NET versions.

Workspace Requirements exists to make that dependency visible and recoverable. Instead of allowing an incompatible SDK, missing runtime, or failed project evaluation to cause unrelated features to fail later, it shows the exact stage that needs attention and provides one next action.

To open the view manually, run **C#: Check Workspace Requirements** from the Command Palette in Visual Studio Code.

## What the stages mean

| Stage | What C# Dev Kit checks |
|---|---|
| **Install Tooling Requirements** | A supported .NET SDK can be selected and is compatible with the workspace's `global.json`. |
| **Restore NuGet Packages** | NuGet restore completed sufficiently for project evaluation. |
| **Detect Project Runtime Configuration** | C# Dev Kit evaluated the projects and identified their target frameworks. |
| **Install Project Runtime Requirements** | The .NET and ASP.NET Core runtimes needed to run, debug, or test the evaluated projects are available. |

A red **Failed** state blocks a later stage. An amber **Needs attention** state means C# Dev Kit has usable project information, but part of the workspace is degraded or a project runtime is missing.

## Choose the guide for your task

- [Why the current SDK matters](workspace-requirements-performance.md) — measured Aspire time-to-IntelliSense and memory results, Fast Build improvements, and concurrent-build coordination results.
- [Install and manage SDKs and runtimes](workspace-requirements-installation.md) — platform installation ownership, Windows system servicing, `dotnetup`, SDK-generation switching, `global.json`, explicit SDK paths, and project runtimes.
- [Prepare for offline use](workspace-requirements-offline.md) — pre-provision SDKs, runtimes, packages, workloads, and extensions before disconnecting.
- [Troubleshoot failed stages](workspace-requirements-troubleshooting.md) — validate restore/build behavior, diagnose project detection, recover stale state, collect logs, and report an issue.
