# Use official CouchDB 3.1.1 image
FROM couchdb:3.1.1

# Do not include credentials in the image. Configure admin credentials at runtime
# via environment variables: COUCHDB_USER and COUCHDB_PASSWORD (or using
# COUCHDB_USER and COUCHDB_PASSWORD with the image's supported env vars).

# Create a directory for seeded data (optional mount point)
VOLUME ["/opt/couchdb/data", "/opt/couchdb/seed"]

# Expose CouchDB default port
EXPOSE 5984

# Metadata
LABEL org.opencontainers.image.title="StatusDB_seed_data-couchdb"
LABEL org.opencontainers.image.description="CouchDB 3.1.1 image used for seeding StatusDB data. Configure admin credentials at runtime; do not bake secrets into the image."

# Default command from the official image is fine; we don't override it so
# the image behaves like the official CouchDB image. This Dockerfile exists
# mainly to provide a named image in the project and a mount point for seeds.
