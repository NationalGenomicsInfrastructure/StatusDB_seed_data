# Database Documentation

This file documents the purpose and contents of each CouchDB database in the seed data.

---

## `agreement_templates`

Storing templates used to create user agreements. One document per template. Seems to be both versions (different documents) and editions (updates of document)?

---

## `agreements`

Stores user agreements created in Genomics Status, connected to the cost calculator implementation in Genoimcs Status.

---

## DEPRECATED: `analysis`

Summary statistics from various analysis, likely updated from `Piper` or similar since its not updated anymore. Likely stopped being updated around 2020 or similar.

---

## `gs_configs`

Miscelaneous config files used for genomics status.

---

## `gs_users`

Genomics Status users, one document for each user. Keeps track of Initials, roles and user presets.

---

## `people_assignments`

Keeps track of assignment of people to projects. Used in Genomics Status project cards and the project page introduced around 2025.

---

## `projects`

One of the major databases that has been around from the start. One document per project. Since it has been around so long, there might be some differences in format/missing fields in documents from different years.

---

## `running_notes`

Keeps all the running notes, one document per note. A partitioned database, which is a bit different, the partition key is the `parent` of the running note, which is commonly the specific project, workset or flowcell.

---

## `sensorpush`

Uploades time series data for our freezers and fridges that are connected with a sensorpush sensor. One document per sensor and 24h. Data is uploaded by a script running on ngi_internal polling the sensorpush API. We suspect that the API isn't great and sometimes misses out data, but it could also be sensors that drop out.

Data is visualized on Genomics Status.

---

## `server_status`

Tracking storage of server file systems, used to display status on Genomics Status index page. One document per server/system and day. Updated by a TACA command run as a cronjob on ngi-preproc. It's a bit broken since the script is using `df -h` and the network mounted storage systems are not always giving correct stats for that command. 
