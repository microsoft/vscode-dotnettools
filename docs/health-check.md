<a id="c-health-check"></a>

# C# Doctor

C# Doctor is C# Dev Kit's health-check view. It checks that the .NET tooling and project runtimes required by your workspace are available, identifies the affected stage when something needs attention, and offers a recovery action.

## The happy path

C# Dev Kit needs two different parts of .NET to be compatible and complete:

1. **A supported SDK selected by the .NET CLI for the workspace** runs the tooling, restore, project evaluation, and builds. The selected SDK must satisfy C# Dev Kit's tooling requirements and the repository's SDK policy.
2. **The runtime bands required by your projects' evaluated target frameworks (TFMs)** run, debug, and test the applications. Install the .NET and ASP.NET Core runtime bands identified by C# Doctor.

The tooling SDK and project target frameworks do not have to be the same generation. For example, a project targeting `net8.0` can be built with a newer compatible SDK while still requiring the .NET 8 runtime to run, debug, or test. A multi-targeted workspace may need several runtime bands installed side by side.

For the normal setup:

1. From the workspace, run `dotnet --info` and confirm that the selected SDK meets the repository and C# Dev Kit requirements.
2. Make sure the repository's `global.json`, if present, allows that SDK to be selected.
3. Restore and build the workspace successfully.
4. Install the runtime bands reported for the evaluated project TFMs.
5. Select **Recheck**. Reload the VS Code window if requested.

<a id="why-c-health-check-validates-your-workspace"></a>

## Why C# Doctor validates your workspace

C# Dev Kit relies on capabilities delivered in the .NET SDK and MSBuild—not only on code contained in the extension. Using a current, compatible SDK gives the tooling access to project-system, build-coordination, caching, and evaluation improvements that can make large workspaces and repeated builds more responsive and use fewer machine resources.

These improvements ship in the SDK and MSBuild. An older SDK cannot provide capabilities that were not included in that release, so keeping the workspace on a current supported SDK helps C# Dev Kit deliver performance and reliability improvements across the .NET toolchain.

See [measured examples from Aspire, Fast Build, and concurrent MSBuild workloads](health-check-performance.md) for the kinds of time-to-IntelliSense, memory, and incremental-build improvements available across the current C# Dev Kit and .NET toolchain. These are complementary improvements; changing SDK versions alone does not produce every measured result.

The larger goal is to remove duplicated project-system work across the .NET ecosystem. Today, an editor, language server, `dotnet watch`, `dotnet format`, and build tools can each evaluate the same projects and maintain separate caches. That duplicates engineering effort and machine work, and it can produce different answers depending on which tool started the operation.

By moving reusable project understanding, cache formats, evaluation data, and up-to-date primitives from C# Dev Kit into Roslyn, the .NET SDK, and MSBuild, the work can benefit the C# language server, `dotnet watch`, `dotnet format`, Fast Build, and other SDK-based tools. A shared foundation means an improvement can be implemented once and used across the ecosystem instead of being rebuilt independently in every product.

## Upcoming benefits of staying current

More .NET development capabilities are moving into the shared SDK and MSBuild layer so editors, command-line tools, tests, and agents can benefit from the same improvements. Planned areas include:

- **Coordinated builds.** Broader adoption of the [MSBuild Build Coordinator](https://github.com/dotnet/msbuild/blob/main/documentation/MSBuild-Coordinator.md) can give concurrent builds a shared machine-wide resource budget instead of allowing each process to independently exhaust CPU and memory.
- **Priority-aware scheduling.** The [next Coordinator implementation](https://github.com/dotnet/msbuild/pull/14725) adds `Low`, `Normal`, and `High` priorities plus reserved capacity, so a latency-sensitive build can start promptly even when background builds already occupy the machine. Queue aging prevents lower-priority work from waiting forever.
- **Shared project information and caches.** A common project model can reduce repeated evaluation work and let C# Dev Kit, the C# language server, `dotnet watch`, `dotnet format`, Fast Build, and other compatible tools reuse project information rather than each rebuilding it independently.
- **Faster up-to-date decisions.** Moving reliable up-to-date primitives into MSBuild can help tools skip projects that have not changed and do less work for incremental builds.
- **Consistent improvements across entry points.** When VS Code, terminal commands, tests, and agents use the same current SDK, compatible features can behave consistently regardless of where a build starts.

These capabilities will arrive incrementally and may require a supporting C# Dev Kit release, SDK release, or explicit feature enablement. The health check keeps the tooling foundation current; it does not by itself enable every upcoming feature.

This matters even more when command-line tools and AI agents run builds in parallel. If each tool selects a different SDK or performs the same project work independently, builds compete for CPU and memory and cannot reliably share improvements. A consistent, current tooling SDK is the foundation for making those operations coordinated and avoiding unnecessary work.

The SDK used to run the tooling is separate from the frameworks your projects target. Moving the tooling to a newer supported SDK does **not** require every project to change its target framework. A current SDK can continue to build projects that target older supported .NET versions.

The health check makes that dependency visible and recoverable. Instead of allowing an incompatible SDK, missing runtime, or failed project evaluation to cause unrelated features to fail later, it shows the exact stage that needs attention and provides one next action.

To open C# Doctor, run **C#: Check health with C# Doctor** from the Command Palette in Visual Studio Code.

## What the stages mean

| Stage | What C# Dev Kit checks |
|---|---|
| **Tooling Requirements** | A supported .NET SDK can be selected and is compatible with the workspace's `global.json`. |
| **Restore NuGet Packages** | NuGet restore completed sufficiently for project evaluation. |
| **Detect Project Configuration** | C# Dev Kit evaluated the projects and identified their target frameworks. |
| **Project Runtime Requirements** | The .NET and ASP.NET Core runtimes needed to run, debug, or test the evaluated projects are available. |

A red **Failed** state blocks that requirement and may block a later stage. An amber **Needs attention** state means C# Dev Kit has usable project information, but part of the workspace is degraded. Missing required project runtimes block runtime readiness until all reported .NET and ASP.NET Core runtime bands are installed.

## Choose the guide for your task

- [Why the current SDK matters](health-check-performance.md) — measured Aspire time-to-IntelliSense and memory results, Fast Build improvements, and concurrent-build coordination results.
- [Install and manage SDKs and runtimes](health-check-installation.md) — choose Windows or macOS and Linux installation steps, then recover SDK, `global.json`, and runtime problems.
- [Prepare for offline use](health-check-offline.md) — pre-provision SDKs, runtimes, packages, workloads, and extensions before disconnecting.
- [Troubleshoot failed stages](health-check-troubleshooting.md) — validate restore/build behavior, diagnose project detection, recover stale state, collect logs, and report an issue.
