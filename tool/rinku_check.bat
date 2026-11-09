@echo off
rem Double-click this file. It runs link_check.ps1 (checks that every link points to an existing file).
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0link_check.ps1"
