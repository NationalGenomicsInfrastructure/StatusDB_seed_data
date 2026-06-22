# StatusDB NGI

Holds views and test data to fire up a dev instance of StatusDB (CouchDB). This repository replaces the StatusDB_views repository which was kept private.

# Views
The first part of this repository is the code for the CouchDB views used for the NGI Stockholm StatusDB. The views are organised in the directory StatusDB_views and listed in the views_config.yaml.

## History
StatusDB_views was kept private since it could contain some project details or other details that was not supposed to be public. However this decision was changed in 2026 since there is no real reason to keep sensitive information in this repository. The content of the repository was moved to StatusDB_NGI since the git history might still hide details which are not supposed to be made public. Here are the contributors of the old repository:

## Contributors of historic StatusDB_Views repository
- @aanil
- @alneberg
- @galithil
- @kedhammar
- @chuan-wang
- @remiolsen
- @kate-v-stepanova
- @silverslott
- @ewels
- @vezzi
- @sylvinite
- @ssjunnebo
- @FranBonath
- @pekrau
- @mariogiov

Thank you!

## Checking and updating the views_config.yaml
To try to keep the views_config.yaml file up to date with the content of the repository, the script script/validate_views_config.py can be used:

```
> python scripts/validate_views_config.py --config views_config.yaml --views-dir StatusDB_views --check
✅ Config is up to date with directory structure
```

And to update the config (default is that a new view will not be included in dev):
```
> python scripts/validate_views_config.py --config views_config.yaml --views-dir StatusDB_views --update
```

# Seed Data
The second part of this repository is the seed data, which is mock data that can be used for testing and demoing a range of internal services that use StatusDB as its backend. The data is located in the seed_data directory and is used to populate the database when building the docker image.

## Seed Data Structure

The `seed_data/` directory contains JSON documents that are loaded into CouchDB on startup.

### Directory Structure

```
seed_data/
├── <database_name>/     # Creates a database and loads all JSON files into it
    ├── doc1.json
    └── doc2.json
```

### Document Format

Each JSON file should contain a single CouchDB document. If the document has an `_id` field, it will be used as the document ID. Otherwise, CouchDB will auto-generate an ID.

Example document (`seed_data/example_project.json`):

```json
{
  "_id": "project_001",
  "type": "project",
  "name": "Example Genomics Project",
  "project_id": "P12345",
  ...
}
```

# Docker Image

The docker image is most commonly used in the docker-compose setup for genomics status. In that case, the docker is built automatically as part of the setup. In case the docker image should be used standalone, it needs to be built using:

```
cd Statusdb_NGI
docker build .
```

And starting a container using

```bash
docker run -d \
  -p 5984:5984 \
  -e COUCHDB_USER=admin \
  -e COUCHDB_PASSWORD=admin \
  ghcr.io/scilifelab/StatusDB_NGI:latest
```

After this, CouchDB will be available at:

- API: <http://localhost:5984>
- Fauxton UI: <http://localhost:5984/_utils>
- Credentials: `admin` / `admin`

The seed data is automatically loaded on first startup along with the views marked as 

### Persisting Data

To persist data between container restarts:

```bash
docker run -d \
  -p 5984:5984 \
  -e COUCHDB_USER=admin \
  -e COUCHDB_PASSWORD=admin \
  -v couchdb-data:/opt/couchdb/data \
  ghcr.io/scilifelab/StatusDB_NGI:latest
```

## Development Container (VS Code)

The easiest way to develop seed data is using the VS Code Dev Container:

1. Install [VS Code](https://code.visualstudio.com/) and the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
2. Open this repository in VS Code
3. When prompted, click "Reopen in Container" (or run `Dev Containers: Reopen in Container` from the command palette)
4. VS Code will build and start CouchDB automatically



## Building the Image Locally

```bash
docker build -t StatusDB_NGI .
docker run -p 5984:5984 -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=admin StatusDB_NGI
```

## Adding New Seed Data

1. Add JSON files to the `seed_data/` directory (or subdirectories for specific databases)
2. Commit and push to `main` branch
3. GitHub Actions will automatically build and publish a new image

## Using with Genomics Status

The [genomics-status](https://github.com/SciLifeLab/genomics-status) repository is configured to use this image in its dev container setup. When you open genomics-status in VS Code with Dev Containers, it will automatically pull this image and start CouchDB with the seed data.
