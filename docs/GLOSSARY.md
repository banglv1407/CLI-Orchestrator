# Glossary

## Agent

An AI coding collaborator operating inside the repository.

## Harness

The repo-level operating system that tells humans and agents how to turn intent
into safe product changes.

## Product Contract

The current expected behavior of the product. Product docs plus executable tests
become the living contract once implementation exists.

## Story Packet

A story-sized work file or folder that describes the product contract, affected
docs, design notes, and validation expectations for a feature.

## Feature Intake

The classification step that turns a prompt into tiny, normal, or high-risk
work before implementation begins.

## Harness Delta

A documentation, template, validation, backlog, or decision update that makes
future agent work safer or easier.

## Durable Layer

The SQLite database and CLI (`scripts/harness`) that stores operational records
(intakes, stories, decisions, backlog items, traces) as structured, queryable
data. Policy docs describe how to work; the durable layer stores what happened.

## Product Delta

A product-facing change such as code, tests, API shape, data model, or product
documentation.

## Trace

A structured record of what an agent did during a task: actions taken, files
read, files changed, decisions made, errors encountered, outcome, and any
harness friction discovered.

