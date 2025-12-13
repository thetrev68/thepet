#!/bin/bash
# Build screenplay script for Unix-like systems
# Combines all fountain screenplay scenes into a single file

cd "$(dirname "$0")"
node build-screenplay.js "$@"
