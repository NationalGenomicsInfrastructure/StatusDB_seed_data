# StatusDB Seed Data

Holds test data to fire up a dev instance of StatusDB (CouchDB).

## Docker Image

A pre-built Docker image with CouchDB and seed data is available:

```bash
docker pull ghcr.io/scilifelab/statusdb_seed_data:latest
```

### Running the Image

```bash
docker run -d \
  -p 5984:5984 \
  -e COUCHDB_USER=admin \
  -e COUCHDB_PASSWORD=admin \
  ghcr.io/scilifelab/statusdb_seed_data:latest
```

CouchDB will be available at:

- API: <http://localhost:5984>
- Fauxton UI: <http://localhost:5984/_utils>
- Credentials: `admin` / `admin`

The seed data is automatically loaded on first startup.

### Persisting Data

To persist data between container restarts:

```bash
docker run -d \
  -p 5984:5984 \
  -e COUCHDB_USER=admin \
  -e COUCHDB_PASSWORD=admin \
  -v couchdb-data:/opt/couchdb/data \
  ghcr.io/scilifelab/statusdb_seed_data:latest
```

## Development Container (VS Code)

The easiest way to develop seed data is using the VS Code Dev Container:

1. Install [VS Code](https://code.visualstudio.com/) and the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
2. Open this repository in VS Code
3. When prompted, click "Reopen in Container" (or run `Dev Containers: Reopen in Container` from the command palette)
4. VS Code will build and start CouchDB automatically

## Seed Data Structure

The `seed/` directory contains JSON documents that are loaded into CouchDB on startup.

### Directory Structure

```
seed/
├── <database_name>/     # Creates a database and loads all JSON files into it
│   ├── doc1.json
│   └── doc2.json
└── *.json               # Top-level JSON files are loaded into 'statusdb' database
```

### Document Format

Each JSON file should contain a single CouchDB document. If the document has an `_id` field, it will be used as the document ID. Otherwise, CouchDB will auto-generate an ID.

Example document (`seed/example_project.json`):

```json
{
  "_id": "project_001",
  "type": "project",
  "name": "Example Genomics Project",
  "project_id": "P12345",
  ...
}
```

## Building the Image Locally

```bash
docker build -t statusdb_seed_data .
docker run -p 5984:5984 -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=admin statusdb_seed_data
```

## Adding New Seed Data

1. Add JSON files to the `seed/` directory (or subdirectories for specific databases)
2. Commit and push to `main` branch
3. GitHub Actions will automatically build and publish a new image

## Using with Genomics Status

The [genomics-status](https://github.com/SciLifeLab/genomics-status) repository is configured to use this image in its dev container setup. When you open genomics-status in VS Code with Dev Containers, it will automatically pull this image and start CouchDB with the seed data.
