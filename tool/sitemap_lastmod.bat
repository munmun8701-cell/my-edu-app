@echo off
rem Double-click this file. It runs sitemap_lastmod.ps1 (sets sitemap lastmod dates from real file dates).
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0sitemap_lastmod.ps1"
