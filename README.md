# C# Dev Kit for Visual Studio Code

This repository provides enhanced file organization for C# development in Visual Studio Code through intelligent file-nesting patterns.

## Features

This extension automatically configures file-nesting patterns in the VS Code Explorer to organize related files together. When enabled, the following file types will be nested under their parent files:

### File-Nesting Patterns

- **C# Files (`*.cs`)**
  - `file.designer.cs` → nested under `file.cs`
  - `file.g.cs` → nested under `file.cs`
  - `file.generated.cs` → nested under `file.cs`

- **Project Files (`*.csproj`)**
  - `project.csproj.user` → nested under `project.csproj`

- **Configuration Files (`*.json`)**
  - `appsettings.Development.json` → nested under `appsettings.json`

- **Razor Pages (`*.cshtml`)**
  - `page.cshtml.cs` → nested under `page.cshtml`
  - `page.cshtml.css` → nested under `page.cshtml`

- **Blazor Components (`*.razor`)**
  - `component.razor.cs` → nested under `component.razor`
  - `component.razor.css` → nested under `component.razor`

- **XAML Files (`*.xaml`)**
  - `window.xaml.cs` → nested under `window.xaml`

## Usage

Once this extension is installed, the file-nesting patterns are automatically applied when:

1. File nesting is enabled in VS Code (`explorer.fileNesting.enabled: true`)
2. You have matching files in your workspace

To enable file nesting manually, add this to your VS Code settings:

```json
{
  "explorer.fileNesting.enabled": true
}
```

## Contributing

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
