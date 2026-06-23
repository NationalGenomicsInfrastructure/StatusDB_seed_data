FROM couchdb:3.4

# Install curl for healthchecks and data loading
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    python3-pip \
    python3-yaml \
    && rm -rf /var/lib/apt/lists/*

# Copy seed data and initialization scripts
COPY seed_data/ /opt/couchdb/seed_data/
COPY scripts/ /opt/couchdb/scripts/

# Copy views configuration and design documents
COPY views_config.yaml /opt/couchdb/views_config.yaml
COPY StatusDB_views/ /opt/couchdb/StatusDB_views/

# Make scripts executable
RUN chmod +x /opt/couchdb/scripts/*.sh

# The base image already sets up CouchDB to run
# We use a custom entrypoint wrapper to initialize data on first boot
COPY scripts/docker-entrypoint-wrapper.sh /docker-entrypoint-wrapper.sh
RUN chmod +x /docker-entrypoint-wrapper.sh

ENTRYPOINT ["tini", "--", "/docker-entrypoint-wrapper.sh"]
CMD ["/opt/couchdb/bin/couchdb"]
