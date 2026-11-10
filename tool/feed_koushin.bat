@echo off
rem Double-click this file. It runs feed_koushin.ps1 (rebuilds feed.xml from koushin.html).
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0feed_koushin.ps1"
