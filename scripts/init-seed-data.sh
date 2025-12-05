#!/bin/bash
set -e

# Configuration
COUCHDB_HOST="${COUCHDB_HOST:-localhost}"
COUCHDB_PORT="${COUCHDB_PORT:-5984}"
COUCHDB_USER="${COUCHDB_USER:-admin}"
COUCHDB_PASSWORD="${COUCHDB_PASSWORD:-admin}"
SEED_DIR="${SEED_DIR:-/opt/couchdb/seed}"
INIT_MARKER="/opt/couchdb/data/.seed_initialized"

COUCHDB_URL="http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@${COUCHDB_HOST}:${COUCHDB_PORT}"

# Wait for CouchDB to be ready
wait_for_couchdb() {
    echo "Waiting for CouchDB to be ready..."
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if curl -s "${COUCHDB_URL}/_up" | grep -q '"status":"ok"'; then
            echo "CouchDB is ready!"
            return 0
        fi
        echo "Attempt $attempt/$max_attempts: CouchDB not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    done

    echo "ERROR: CouchDB failed to start within expected time"
    return 1
}

# Create system databases required by CouchDB
create_system_databases() {
    echo "Creating system databases..."
    for db in _users _replicator _global_changes; do
        curl -s -X PUT "${COUCHDB_URL}/${db}" > /dev/null 2>&1 || true
    done
}

# Create a database if it doesn't exist
create_database() {
    local db_name="$1"
    echo "Creating database: ${db_name}"
    local response=$(curl -s -w "\n%{http_code}" -X PUT "${COUCHDB_URL}/${db_name}")
    local http_code=$(echo "$response" | tail -n1)

    if [ "$http_code" = "201" ]; then
        echo "  Database '${db_name}' created successfully"
    elif [ "$http_code" = "412" ]; then
        echo "  Database '${db_name}' already exists"
    else
        echo "  Warning: Unexpected response creating '${db_name}': $http_code"
    fi
}

# Load a single JSON document into a database
load_document() {
    local db_name="$1"
    local json_file="$2"

    local doc_id=$(jq -r '._id // empty' "$json_file" 2>/dev/null)

    if [ -n "$doc_id" ]; then
        # Document has an _id, use PUT
        echo "  Loading document '${doc_id}' into '${db_name}'..."
        curl -s -X PUT "${COUCHDB_URL}/${db_name}/${doc_id}" \
            -H "Content-Type: application/json" \
            -d @"$json_file" > /dev/null
    else
        # No _id, use POST to auto-generate
        echo "  Loading document from '$(basename "$json_file")' into '${db_name}'..."
        curl -s -X POST "${COUCHDB_URL}/${db_name}" \
            -H "Content-Type: application/json" \
            -d @"$json_file" > /dev/null
    fi
}

# Load all seed data
load_seed_data() {
    echo "Loading seed data from ${SEED_DIR}..."

    # Check if seed directory exists and has files
    if [ ! -d "$SEED_DIR" ]; then
        echo "Seed directory not found: ${SEED_DIR}"
        return 0
    fi

    # Load database-specific directories
    # Structure: seed/<database_name>/*.json
    for db_dir in "$SEED_DIR"/*/; do
        if [ -d "$db_dir" ]; then
            local db_name=$(basename "$db_dir")
            echo "Processing database: ${db_name}"
            create_database "$db_name"

            # Load all JSON files in the database directory
            for json_file in "$db_dir"/*.json; do
                if [ -f "$json_file" ]; then
                    load_document "$db_name" "$json_file"
                fi
            done
        fi
    done

    # Also load any top-level JSON files into a 'statusdb' database (legacy support)
    local has_toplevel_json=false
    for json_file in "$SEED_DIR"/*.json; do
        if [ -f "$json_file" ]; then
            if [ "$has_toplevel_json" = false ]; then
                create_database "statusdb"
                has_toplevel_json=true
            fi
            load_document "statusdb" "$json_file"
        fi
    done

    echo "Seed data loading complete!"
}

# Main execution
main() {
    # Check if we've already initialized
    if [ -f "$INIT_MARKER" ]; then
        echo "Seed data already initialized, skipping..."
        exit 0
    fi

    wait_for_couchdb
    create_system_databases
    load_seed_data

    # Create marker file to indicate initialization is complete
    touch "$INIT_MARKER"
    echo "Initialization complete!"
}

main "$@"
