# Issue-Labeler Workflows

This repository uses actions from [dotnet/issue-labeler](https://github.com/dotnet/issue-labeler) to predict area labels for issues.

The following workflow templates were imported and updated from [dotnet/issue-labeler/wiki/Onboarding](https://github.com/dotnet/issue-labeler/wiki/Onboarding):

1. `labeler-cache-retention.yml`
2. `labeler-predict-issues.yml`
3. `labeler-promote.yml`
4. `labeler-train.yml`

## Repository Configuration

Across these workflows, the following changes were made to configure the issue labeler for this repository:

1. Update the `github.repository_owner` checks that prevent workflow runs outside 'microsoft'
    - `labeler-cache-retention.yml`
    - `labeler-predict-issues.yml`
2. Set `LABEL_PREFIX` to `"area-"`:
    - `labeler-predict-issues.yml`
    - `labeler-train.yml`
3. Remove the `DEFAULT_LABEL` setting since no default label is applied when prediction is not made:
    - `labeler-predict-issues.yml`
4. Remove the `EXCLUDED_AUTHORS` value as we do not bypass labeling for any issue authors in this repository:
    - `labeler-predict-issues.yml`
5. Remove the `repository` input for training the models against another repository:
    - `labeler-train.yml`
6. Update the cache retention cron schedule to an arbitrary time of day:
    - `labeler-cache-retention.yml`
7. Disable pull request label prediction
    - `labeler-train.yml` - Change the default from "Both" to "Issues"
    - `labeler-cache-retention.yml` - Remove "pulls" from the job matrix (leaving a comment)
    - Remove `labeler-predict-pulls.yml`; pull request prediction is not used in this repository
