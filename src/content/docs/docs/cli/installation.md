---
title: Installing the CLI
description: Get the agelo CLI on your machine.
sidebar:
  order: 2
---

The Agelo CLI is a Python package. Wheels are published as assets on the
[GitHub Releases page](https://github.com/Agelo-Platform/agelo-cli/releases).

## Requirements

- Python 3.11 or newer

## Install from a release wheel

The repository is public, so the wheel installs straight from its release URL:

```bash
pip install https://github.com/Agelo-Platform/agelo-cli/releases/download/v0.0.1.0/agelo_cli-0.0.1.0-py3-none-any.whl
```

Prefer an isolated install? Use [pipx](https://pipx.pypa.io/):

```bash
pipx install https://github.com/Agelo-Platform/agelo-cli/releases/download/v0.0.1.0/agelo_cli-0.0.1.0-py3-none-any.whl
```

Or fetch the wheel with the GitHub CLI first (handy in CI):

```bash
gh release download v0.0.1.0 --repo Agelo-Platform/agelo-cli --pattern '*.whl'
pip install ./agelo_cli-*.whl
```

Replace the version with the latest tag from the
[releases page](https://github.com/Agelo-Platform/agelo-cli/releases).

## Verifying the install

```bash
agelo --version
agelo --help
```

If `agelo --help` lists subcommands, you're set. Move on to
[auth](/docs/cli/auth) to wire up credentials.

## Upgrading

Install the wheel for a newer release tag over the top:

```bash
pip install --upgrade https://github.com/Agelo-Platform/agelo-cli/releases/download/<newer-tag>/agelo_cli-<newer-version>-py3-none-any.whl
```

## Uninstalling

```bash
pip uninstall agelo-cli      # or: pipx uninstall agelo-cli
```

The config file at `~/.agelo/config.json` is left in place — remove it
manually if you want a clean state.
