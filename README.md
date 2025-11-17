
# StatusDB_seed_data

Holds test data to fire up a dev instance of statusdb

## Development Container (Recommended)

The easiest way to get started is using the VS Code Dev Container:

1. Install [VS Code](https://code.visualstudio.com/) and the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
2. Open this repository in VS Code
3. When prompted, click "Reopen in Container" (or run `Dev Containers: Reopen in Container` from the command palette)
4. VS Code will build and start CouchDB automatically

CouchDB will be available at:

- API: <http://localhost:5984>
- Fauxton UI: <http://localhost:5984/_utils>
- Credentials: `admin` / `secret`

## Docker

This repository contains a small `Dockerfile` that is a thin wrapper around the
official CouchDB 3.1.1 image and provides a mount point for seed data.

Build the image (from the repo root):

```bash
docker build -t statusdb-seed-couchdb:3.1.1 .
```

Run CouchDB with an admin user and mounted seed data directory:

```bash
# Start container with admin credentials and map port 5984
docker run --rm -p 5984:5984 \
  -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=secret \
  -v "$PWD/seed:/opt/couchdb/seed" \
  statusdb-seed-couchdb:3.1.1
```

Notes:

- Do not commit credentials into the repository. Prefer runtime env vars or Docker
  secrets in production.
- The official CouchDB image will initialize the database cluster and create the
  admin user when `COUCHDB_USER` and `COUCHDB_PASSWORD` are provided.
- Place any JSON documents or init scripts you want applied at container startup
  in the `seed` folder and mount it into `/opt/couchdb/seed`.

## Seed Data

The `seed/` directory contains example JSON documents that can be loaded into CouchDB
to populate a development instance with test data.

### Example Documents

- **`example_project.json`**: A sample genomics project document with project metadata,
  sample information, and sequencing run details. This demonstrates the typical structure
  for a StatusDB project entry.

### Loading Seed Data

To load seed data into your running CouchDB instance, you can use the CouchDB HTTP API:

```bash
# Create a database (if it doesn't exist)
curl -X PUT http://admin:secret@localhost:5984/statusdb

# Load a document
curl -X POST http://admin:secret@localhost:5984/statusdb \
  -H "Content-Type: application/json" \
  -d @seed/example_project.json
```

Alternatively, you can use the CouchDB web interface (Fauxton) at <http://localhost:5984/_utils>
to manually create databases and upload documents.
