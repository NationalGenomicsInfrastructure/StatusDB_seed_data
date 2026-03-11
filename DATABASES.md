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

## DEPRECATED `expected_yields`

One document per run mode and sequencer. Not sure where this is used.

---

## DEPRECATED `flowcells`

Illumina flowcells database used for pre HiSeq-X. Not updated after 2016.

---

## `gs_configs`

Miscelaneous config files used for genomics status.

---

## `gs_links`

Tracking the links added to projects on Genomics Status. One project link per document.

---

## `gs_users`

Genomics Status users, one document for each user. Keeps track of Initials, roles and user presets.

---

## DEPRECATED `instrument_logs`

Instrument logs very similar to the biomek_logs databse, but seems to have been used by the Bravo computers, last update was August 2025 but I think the Bravo computers were taken offline after that.

---

## `instruments`

Might be out of date, used by fc_trends plot to name the instruments. A database to list all sequencing instrument IDs and corresponding names. Can be replaced with a gs_config document.

---

## `nanopore_runs`

The flowcells database for ONT. One document per flowcell and run. A reused flowcell will generate a new document.

---


## `people_assignments`

Keeps track of assignment of people to projects. Used in Genomics Status project cards and the project page introduced around 2025.

---

## [DEPRECATED] `pricing_components`

Was used for cost calculator on Genstat before it was actually launched. The information is now instead baked into cost_calculator documents.

---

### `pricing_exchange_rates`

Tracking exchange rates USD to SEK and EUR to SEK. Keeping a historical record so we can rewind time when changing agreements that was generated some time ago and we would like to keep the same exchange rate. One document per update, updated weekly by a cronjob.

---

## [DEPRECATED] `pricing_products`

Was used for cost calculator on Genstat before it was actually launched. The information is now instead baked into cost_calculator documents.

---

## `projects`

One of the major databases that has been around from the start. One document per project. Since it has been around so long, there might be some differences in format/missing fields in documents from different years.

---

## [Might be DEPRECATED] `reference`

Seems to be a mapping between fields we use in genstat or in other places and how we fetch them from LIMS. Not sure if its used.

---


## `running_notes`

Keeps all the running notes, one document per note. A partitioned database, which is a bit different, the partition key is the `parent` of the running note, which is commonly the specific project, workset or flowcell.

---

## [WARNING] `sample_requirements`

Never made it into use, was supposed to keep track of sample requirements for different preps. Still visible on Genomics Status.

---

## `sensorpush`

Uploades time series data for our freezers and fridges that are connected with a sensorpush sensor. One document per sensor and 24h. Data is uploaded by a script running on ngi_internal polling the sensorpush API. We suspect that the API isn't great and sometimes misses out data, but it could also be sensors that drop out.

Data is visualized on Genomics Status.

---

## `server_status`

Tracking storage of server file systems, used to display status on Genomics Status index page. One document per server/system and day. Updated by a TACA command run as a cronjob on ngi-preproc. It's a bit broken since the script is using `df -h` and the network mounted storage systems are not always giving correct stats for that command. 

---

## `suggestion_box`

Keeps track of which items have been added to the suggestion box. Keeps a link to the Jira item and whether its been archived or not.

---

## [DEPRECATED] `taca_flowcells`

Abandoned project for taca to uploade flowcells I think. Only one document and uploaded 2015.

---

## `userman`

Database to keep track of the Charon users.

---

## `worksets`

The worksets database populated by LIMS2DB. One document per workset.

---

## `x_flowcells`

The Illumina flowcells database, updated by TACA and visualised on Genomics Status. Was named `x` since it was introduced with the HiSeq X machines which had a very different metadata output from the previous generation.

---

## `y_flowcells`

A database to track the transfer status of all flowcells handled by the transfer script introduced with Project Helix. Updated every hour using a cronjob on ngi-preproc. The name was chosen because it comes after x_flowcells.

---

## `yggdrasil`

Internal database used by yggdrasil for high level logging.

---