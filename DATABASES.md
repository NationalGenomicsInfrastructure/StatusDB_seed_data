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

## `application_categories`

Listing our application categories and abrevation, with one document per application. Used by the statistics api of genstat which in turn feeds the dashboard.

---

## `bioinfo_analysis`

Listing status flags for bioinfo tab on Genomics Status. One document per sample-flowcell-lane combination, which gets problematic when setting a status on flowcell level when there is a lot of samples on many lanes.
Documents are created by ngi-pipeline or TACA and statuses can be set from Genomics Status UI.

---

## `biomek_logs`

Short log messages from the biomek runs.

---

## `charon`

Huge database tracking sample status on the bioinfo side. Database for the Charon web application which has up to 2025 also been used by the Uppsala node of NGI. Lots of different types of documents with different content and structure.

---

## `cost_calculator`

Storing the prices for our different offerings. One document per version of the cost calculator. Updated from Genomics Status and used by Genomics Status to display cost and generate agreements.

---

## `cronjobs`

Storing the output of `crontab -l` for different users and servers, updated by TACA in a cronjob, and displayed on Genomics Status. One document per server, with different users appended to the document.

---

## `element_runs`

Flowcells database for the Element Bioisciences sequencing instrument. Created by TACA and displayed on Genomics Status.

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
