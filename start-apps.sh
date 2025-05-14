#!/bin/bash
# Script para iniciar backend y frontend en paralelo
cd "$(dirname "$0")"

# Inicia backend en segundo plano y guarda el PID
cd backend && node app.js &
BACKEND_PID=$!
cd ..

# Inicia frontend en segundo plano y guarda el PID
cd frontend && npm start &
FRONTEND_PID=$!
cd ..

# Espera a que ambos procesos terminen
wait $BACKEND_PID
wait $FRONTEND_PID
