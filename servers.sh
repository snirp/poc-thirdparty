
#!/usr/bin/env bash

pids=( )    
serverport=8080
pubport=8001

# Prepare exit trap
graceful_shutdown() {
  (( ${#pids[@]} )) && kill "${pids[@]}"
}

# Launch server and wait until accepting requests
http-server -p "$serverport" & pids+=( "$!" ) &
while ! nc -z localhost "$serverport"; do
  echo "Waiting for server..."
  sleep 0.1; 
done

# Spin up webserver for every dir inside publisher folder 
cd publishers || exit
for d in */ ; do
  http-server "$d" -p "$pubport" & pids+=( "$!" )
  (( ++pubport ))
done

# Kill all http-server instances on Ctrl+C
trap graceful_shutdown EXIT
for pid in "${pids[@]}"; do
  wait "$pid" || (( retval |= $? ))
done
exit "$retval"
