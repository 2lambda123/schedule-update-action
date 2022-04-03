## Dynamic schedule update | [![Update schedule in README.md](https://github.com/EdmanJohan/DD2482-ScheduleAction/actions/workflows/scheduleUpdate.yml/badge.svg)](https://github.com/EdmanJohan/DD2482-ScheduleAction/actions/workflows/scheduleUpdate.yml)
This GitHub action provides the functionality to:
- Automatically fetch events from a given TimeEdit calendar and
output the calendar events in a markdown file as formatted markdown content.
- The script places content within a set area indicated by dynamic content tags.  
Should the tags be missing, then no action will be taken.

### Usage
Simply place the following tags in the markdown file where the content should be inserted.
```
<!-- start dynamic schedule content -->
<!-- end dynamic schedule content -->
```
#### Inputs


#### Environment variables:
`GH_ACCESS_TOKEN` GitHub access token.  
`BASE_URL`  URL for TimeEdit. E.g. `https://cloud.timeedit.net/kth/web/public01/`.   
`COURSE_NAME` Course name. E.g. `DD2482`.  
`REPO_OWNER` Owner of repository.    
`REPO_NAME` Name of repository.  


### Limitations  
Due to the fact that TimeEdit deletes events that have passed, and the script itself does not maintain memory,
old events will simply be deleted as time passes.
