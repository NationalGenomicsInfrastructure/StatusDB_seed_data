FROM couchdb:3.4

# Install curl for healthchecks and data loading
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy seed data and initialization scripts
COPY seed/ /opt/couchdb/seed/
COPY scripts/ /opt/couchdb/scripts/

# Make scripts executable
RUN chmod +x /opt/couchdb/scripts/*.sh

# The base image already sets up CouchDB to run
# We use a custom entrypoint wrapper to initialize data on first boot
COPY scripts/docker-entrypoint-wrapper.sh /docker-entrypoint-wrapper.sh
RUN chmod +x /docker-entrypoint-wrapper.sh

ENTRYPOINT ["tini", "--", "/docker-entrypoint-wrapper.sh"]
CMD ["/opt/couchdb/bin/couchdb"]
