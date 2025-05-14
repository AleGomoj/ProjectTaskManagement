@echo off
REM Script para Windows: inicia backend y frontend en terminales separadas

start "Backend" cmd /k "cd backend && node app.js"
start "Frontend" cmd /k "cd frontend && npm start"
