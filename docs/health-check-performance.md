# Why C# Dev Kit benefits from the current .NET SDK

C# Dev Kit relies on capabilities delivered in the .NET SDK and MSBuild—not only on code contained in the extension. Staying on the latest SDK generation supported by C# Dev Kit lets the tooling use new build coordination, caching, project-evaluation, and incremental-build capabilities as they become available.

- [C# Doctor overview](health-check.md)
- [Install and manage SDKs and runtimes](health-check-installation.md)
- [Prepare for offline use](health-check-offline.md)
- [Troubleshoot failed stages](health-check-troubleshooting.md)

## Measured examples

These measurements illustrate the kinds of improvements enabled by the current C# Dev Kit and .NET toolchain. They are scenario-specific engineering benchmarks, not performance guarantees. Results vary with hardware, repository shape, cache state, installed extensions, and SDK version.

### Time to IntelliSense and C# Dev Kit memory

In a macOS comparison using the public [dotnet/aspire](https://github.com/dotnet/aspire) repository with 343 projects, C# Dev Kit v10.* improved the time from opening the workspace until its project model was ready:

| Scenario | C# Dev Kit v3.* | C# Dev Kit v10.* | Reduction |
|---|---:|---:|---:|
| Cold cache | 121.3 seconds | 34.5 seconds | 72% |
| Warm cache | 29.6 seconds | 0.85 seconds | 97% |

In the same comparison, C# Dev Kit server memory fell from approximately 1.8 GB to 203–242 MB, a reduction of approximately 87%.

This is an end-to-end C# Dev Kit v3.*-to-v10.* comparison, not an isolated SDK benchmark. The current SDK remains important because C# Dev Kit v10.* builds on SDK and MSBuild capabilities and because future improvements continue moving into that shared toolchain.

### Fast incremental builds

C# Dev Kit's Fast Build path avoids entering MSBuild when it can prove that outputs are current and minimizes work when a build is required. In a controlled 42-project fixture with a warm resident build server, measured over 15 timed iterations:

| Scenario | Normal `dotnet build` | Fast Build | Improvement |
|---|---:|---:|---:|
| No changes | 3,261 ms | 667 ms | Approximately 5× faster |
| Incremental leaf edit | 3,791 ms | 1,763 ms | Approximately 2× faster |

The benchmark verified byte-identical outputs with SHA-256 and observed coefficient of variation at or below 7%. Larger real-world gains are possible when a no-op build can use the optimized skip path or when implementation-only changes avoid dependent recompilation, but the exact benefit depends on the project graph.

Fast Build is a C# Dev Kit capability that complements the current SDK strategy. This benchmark does not compare SDK generations, and selecting a newer SDK alone does not produce the measured Fast Build gain. A current supported SDK provides the MSBuild and tooling foundation on which C# Dev Kit can safely build and continue improving this path.

### Coordinating concurrent builds

AI agents, editors, terminals, and background tools can start several builds on one machine. Without coordination, each MSBuild process can independently request a large worker pool, creating CPU contention and memory pressure.

The [MSBuild Build Coordinator](https://github.com/dotnet/msbuild/blob/main/documentation/MSBuild-Coordinator.md) provides a system-wide node budget and fair-share allocation. In a 12-core macOS engineering benchmark running 20 service projects across 10 worktrees, the coordinated configuration changed:

| Metric | Uncoordinated | Coordinated | Improvement |
|---|---:|---:|---:|
| Build time | 188 seconds | 86 seconds | 54% faster |
| Peak MSBuild memory | 41.3 GB | 4.8 GB | 88% less |
| Total peak memory | 45.3 GB | 12.7 GB | 72% less |

This benchmark represents a deliberately high-contention workload. Its purpose is to demonstrate why all participating tools need a current SDK/MSBuild with the same coordination capabilities; ordinary single-build workloads should not expect the same ratios.

Using a coordinator-capable SDK does not enable coordination by itself. The MSBuild Coordinator is optional and must be enabled, and every participating build must run through a compatible coordinated MSBuild path to share the system-wide budget. The health check establishes a supported tooling foundation; it does not promise that every external build tool or command is participating in coordination.

<a id="why-c-health-check-asks-users-to-update"></a>

## Why C# Doctor asks users to update

The newer C# Dev Kit architecture removes duplicated work from the extension, while newer SDK and MSBuild releases provide capabilities that can benefit the editor, command-line builds, tests, agents, and other .NET tools. Using the same current tooling SDK helps those components:

- coordinate instead of independently exhausting the machine;
- share compatible project information and caches;
- skip work that is already up to date;
- receive performance and reliability improvements through SDK servicing.

The goal is not to keep these improvements private to C# Dev Kit. Project evaluation, cache data, up-to-date checks, and build coordination are useful to every tool that needs to understand or build a .NET project. Moving reusable capabilities into Roslyn, the .NET SDK, and MSBuild lets the C# language server, `dotnet watch`, `dotnet format`, Fast Build, and future tools share the same implementation and project understanding.

That removes two kinds of duplication: teams no longer need to implement equivalent project-system features separately in each tool, and a developer's machine no longer needs every tool to repeat the same project evaluation and caching work. It also reduces inconsistent behavior caused by different tools independently interpreting the same project.

The tooling SDK is separate from project target frameworks. Updating the SDK used by C# Dev Kit does not require every project to retarget. Projects can continue targeting older supported TFMs while using their matching runtime bands for Run, Debug, and Test.

## What this enables next

Keeping tools on a current, consistent SDK creates a delivery path for additional improvements that are being developed across C# Dev Kit, MSBuild, and the .NET SDK:

- broader participation in system-wide MSBuild coordination;
- [priority-aware Coordinator scheduling](https://github.com/dotnet/msbuild/pull/14725), so hosts can distinguish latency-sensitive work from normal and background builds while preventing starvation;
- shared project information and compatible caches across C# Dev Kit, the C# language server, `dotnet watch`, `dotnet format`, Fast Build, and agents;
- native up-to-date checks that avoid evaluating or building unchanged projects; and
- faster incremental builds that perform only the work required by the change.

These are forward-looking areas, not guarantees attached to a particular benchmark. Availability may depend on a future C# Dev Kit or SDK release and may initially require explicit enablement.

The priority-aware scheduling work follows the base Coordinator rather than replacing it. The Coordinator first establishes one machine-wide node budget; priority scheduling then decides how that capacity is reserved and queued. In its public sustained-contention benchmark, changing only a delayed request from `Normal` to `High` reduced its grant wait from 223.7 seconds to 0.9 seconds for Roslyn and from 81.8 seconds to 1.5 seconds for Aspire. That improvement deliberately transfers capacity to the selected high-priority request, so it can reduce throughput for continuously backlogged normal-priority work.
