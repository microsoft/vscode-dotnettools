# Prepare C# Dev Kit Workspace Requirements for offline use

Workspace Requirements can diagnose and use compatible components that are already installed while the machine is offline. It cannot download an SDK, runtime, workload, or NuGet package without access to the corresponding source. Prepare the machine before disconnecting, or provision the same components through your organization's offline image and package mirrors.

- [Workspace Requirements overview](workspace-requirements.md)
- [Install and manage SDKs and runtimes](workspace-requirements-installation.md)
- [Troubleshoot failed stages](workspace-requirements-troubleshooting.md)

## Offline prerequisites

An offline workspace needs:

1. **A supported tooling SDK.** Install the SDK generation selected by C# Dev Kit. The installed feature band must meet the minimum required by that C# Dev Kit release.
2. **Tooling runtimes.** Ensure the selected .NET installation contains both the .NET runtime and ASP.NET Core runtime for the tooling generation.
3. **Project runtimes.** Install the .NET and ASP.NET Core runtime bands required by the projects' evaluated target frameworks. Projects targeting different modern .NET major versions may require multiple runtime bands side by side. Building alone does not prove the runtimes needed to run, debug, or test are installed.
4. **NuGet packages.** Populate the user's global packages folder or configure reachable offline package sources with every package needed by the workspace. Include authenticated-source credentials through your organization's approved mechanism; do not place credentials in the repository.
5. **Required workloads and targeting packs.** Projects such as .NET MAUI may need workloads, manifests, platform SDKs, or targeting packs beyond the SDK and shared runtimes. Install or restore these before disconnecting.
6. **A satisfiable SDK policy.** If the repository has a `global.json`, make sure its `version`, `rollForward`, `allowPrerelease`, and `sdk.paths` can select an SDK present on the offline machine. An exact pin to a missing SDK cannot be repaired offline.
7. **The required VS Code extensions.** Install C# Dev Kit and any companion extensions before the machine loses access to the Visual Studio Marketplace or your extension mirror.

## Verify before disconnecting

Open a terminal at the workspace root and run:

```console
dotnet --info
dotnet --list-sdks
dotnet --list-runtimes
dotnet restore
dotnet build --no-restore
```

Also run, debug, or test representative projects for each target-framework/runtime band. This verifies the shared runtimes that a build may not exercise.

For repeatable enterprise provisioning, prefer an offline machine image or internal package feeds over relying on one developer's warm caches. Keep the image updated when C# Dev Kit raises its minimum supported tooling SDK or projects add a target framework, workload, or package.

## What works while offline

- **Recheck workspace** remains safe and does not attempt installation by itself.
- An explicit installation action will fail if its download source is unreachable. Workspace Requirements reports the failure rather than silently switching installation systems.
- NuGet restore succeeds only when all required packages and metadata are available from local caches or configured offline sources.
- Vulnerability and update information that depends on online services may be unavailable, but this does not replace the tooling, restore, project-detection, or runtime checks.
