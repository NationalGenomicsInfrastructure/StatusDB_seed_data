#!/bin/bash
set -e

# This wrapper script runs the initialization in the background after CouchDB starts
# The actual data loading happens via init-seed-data.sh

# Start the initialization script in the background
# It will wait for CouchDB to be ready before loading data
/opt/couchdb/scripts/init-seed-data.sh &

# Execute the original CouchDB entrypoint
exec /docker-entrypoint.sh "$@"
