#!/usr/bin/env bash
# Kills any process using the three backend ports.
# Run this from WSL before `npm start`.

PORTS=(8080 50051 50052)

for PORT in "${PORTS[@]}"; do
  PIDS=$(lsof -ti :"$PORT" 2>/dev/null)
  if [ -n "$PIDS" ]; then
    echo "Killing PID(s) $PIDS on port $PORT"
    echo "$PIDS" | xargs kill -9 2>/dev/null
  else
    echo "Port $PORT is free"
  fi
done

echo "Done."
