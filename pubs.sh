#!/usr/bin/env bash

pids=( )    
port=8001

graceful_shutdown() {
  (( ${#pids[@]} )) && kill "${pids[@]}"
}

http-server & pids+=( "$!" )
sleep .1

cd publishers || exit
for d in */ ; do
  http-server "$d" -p "$port" & pids+=( "$!" )
  (( ++port ))
done

trap graceful_shutdown EXIT
for pid in "${pids[@]}"; do
  wait "$pid" || (( retval |= $? ))
done
exit "$retval"