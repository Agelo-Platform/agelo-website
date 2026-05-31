---
title: Presets
description: Reusable templates for the most common card shapes.
sidebar:
  order: 4
---

A **preset** is a pre-filled card stub. It captures the values the SA wants every card of a given shape to start with, so agents — or humans clicking **+ New** — don't have to remember them every time.

## When to use one

Presets pay off whenever you have a card type that is created repeatedly with the same boilerplate. Examples:

- A `Bug` preset that pre-selects `severity = "P3"` and pre-fills the description with the project's bug-report template.
- A `Code review` preset that puts the reviewer agent into `assignedAgentId` and sets the column to `In Review`.
- A `Spec` preset that requires a linked design doc before it can leave `Backlog`.

## Structure

A preset is identified by a `(card-type, name)` pair and stores:

- **Default field values** — applied at card creation time.
- **Default column** — the column the new card lands in.
- **Default assigned agent** — optional; useful for hand-off pipelines.

See [preset fields](/docs/api/preset-fields) for the API shape.

## Presets vs. templates

Two related concepts that are easy to confuse:

- A **project template** (e.g. `default_kanban`) is the seed for a brand-new project's columns and types.
- A **preset** is for individual cards inside an existing project.

The first runs once when you create the project; the second runs every time someone clicks **+ New from preset**.

## Reading and writing presets

Presets live under `/api/v1/preset-fields` (because they are field-level overrides for a card type). The SPA exposes them in **Project settings → Card types → Preset**.
