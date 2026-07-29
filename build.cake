#nullable enable
using System.Collections.Generic;
#load "version.cake"

var target = Argument("target", "Default");
var packOutputDir = Argument("output_dir", EnvironmentVariable("OUTPUT_DIR") ?? "artifacts");
var version = Argument("package_version", EnvironmentVariable("PACKAGE_VERSION") ?? "");
var stagingDir = "./.cake/package";


IReadOnlyList<string> GetCommandOutput(string fileName, string arguments)
{
    IEnumerable<string> output;
    IEnumerable<string> error;

    var exitCode = StartProcess(
        fileName,
        new ProcessSettings
        {
            Arguments = arguments,
            RedirectStandardOutput = true,
            RedirectStandardError = true
        },
        out output,
        out error);

    var outputLines = output.ToList();
    var errorLines = error.ToList();

    if (exitCode != 0)
    {
        foreach (var line in errorLines)
        {
            Error(line);
        }

        throw new Exception($"{fileName} {arguments} failed with exit code {exitCode}.");
    }

    return outputLines;
}

void RunCommand(string fileName, string arguments)
{
    GetCommandOutput(fileName, arguments);
}

string NpmExecutable => IsRunningOnWindows() ? "npm.cmd" : "npm";

void RunNpm(string arguments)
{
    Information($"> npm {arguments}");
    RunCommand(NpmExecutable, $"--cache \"./.cake/npm-cache\" {arguments}");
}

void RunNode(string arguments)
{
    Information($"> node {arguments}");
    RunCommand("node", arguments);
}

void RunNpx(string arguments)
{
    var executable = IsRunningOnWindows() ? "npx.cmd" : "npx";
    Information($"> npx {arguments}");
    RunCommand(executable, $"--cache \"./.cake/npm-cache\" {arguments}");
}

bool CommandSucceeds(string fileName, string arguments)
{
    var exitCode = StartProcess(
        fileName,
        new ProcessSettings
        {
            Arguments = arguments,
            RedirectStandardOutput = true,
            RedirectStandardError = true
        });

    return exitCode == 0;
}

Task("Clean")
    .Description("Removes generated Node package output")
    .Does(() =>
    {
        CleanDirectory(packOutputDir);
        CleanDirectory(stagingDir);
    });

Task("Version")
    .IsDependentOn("Clean")
    .Description("Calculates the npm package version")
    .Does(() =>
    {
        if (string.IsNullOrWhiteSpace(version))
        {
            version = CalculateVersion();
        }

        Information($"Version {version}");
    });

Task("Install")
    .IsDependentOn("Version")
    .Description("Installs dependencies from package-lock.json")
    .Does(() => RunNpm("ci"));

Task("SecurityAudit")
    .IsDependentOn("Install")
    .Description("Audits dependencies")
    .Does(() => RunNpm("audit --audit-level=critical"));

Task("Format")
    .IsDependentOn("SecurityAudit")
    .Description("Checks formatting without changing source files")
    .Does(() => RunNpm("run format:check"));

Task("Lint")
    .IsDependentOn("Format")
    .Description("Runs JavaScript linting")
    .Does(() => RunNpm("run lint"));

Task("Test")
    .IsDependentOn("Lint")
    .Description("Runs Node's built-in test runner")
    .Does(() => RunNode("--test"));

Task("Build")
    .IsDependentOn("Test")
    .Description("Validates the syntax of package source files")
    .Does(() =>
    {
        foreach (var sourceFile in GetFiles("./src/**/*.js"))
        {
            RunNode($"--check \"{sourceFile}\"");
        }
    });

Task("Pack")
    .IsDependentOn("Build")
    .Description("Stages and creates a versioned npm package archive")
    .Does(() =>
    {
        EnsureDirectoryExists(stagingDir);
        EnsureDirectoryExists(packOutputDir);

        CopyFileToDirectory("./package.json", stagingDir);
        CopyFileToDirectory("./package-lock.json", stagingDir);
        if (FileExists("./README.md"))
        {
            CopyFileToDirectory("./README.md", stagingDir);
        }

        CopyDirectory("./src", $"{stagingDir}/src");

        RunNpm(
            $"version {version} --allow-same-version --no-git-tag-version " +
            $"--ignore-scripts --prefix \"{stagingDir}\"");
        RunNpm($"pack \"{stagingDir}\" --pack-destination \"{MakeAbsolute(Directory(packOutputDir))}\"");
    });

Task("Default")
    .IsDependentOn("Pack");

RunTarget(target);


