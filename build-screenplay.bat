@echo off
REM Build screenplay script for Windows
REM Combines all fountain screenplay scenes into a single file

cd /d "%~dp0"
node build-screenplay.js %*
