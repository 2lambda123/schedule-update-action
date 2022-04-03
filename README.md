## Schedule update action
This GitHub action provides the functionality to:
- Automatically fetch events from a given TimeEdit calendar and
output the calendar events in a markdown file as formatted markdown content.
- The script places content within a set area indicated by dynamic content tags.  
Should the tags be missing, then no action will be taken.


![Alt text](./actionFlowChart.svg)
<img src="./actionFlowChart.svg">

### Usage
Place the following tags in the markdown file where the content should be inserted.
```
<!-- start dynamic schedule content -->
<!-- end dynamic schedule content -->
```
### Inputs
#### `timeedit-url`
**Required** The url of the TimeEdit site to use. E.g. `https://cloud.timeedit.net/kth/web/public01/`  

#### `course-name`
**Required** The name of the course to fetch events for. E.g. `DD2482`
#### `repo-owner`
**Optional** Repository owner where file to update resides. Defaults to current context.

#### `repo-name`
**Optional** Repository name where file to update resides. Defaults to current context.

#### `repo-file`
**Optional** Full name of file to update. Defaults to `README.md`.

#### `token`
**Required** GitHub token to interact with API. Default `github.token`

#### `filter-empty`
**Optional** Boolean value to indicate whether empty events should be filtered. Default `true`

#### `use-kth-places`
**Optional** Boolean value to indicate whether to replace locations with KTH Places links. Default `false´

## Outputs


### External Packages
The GitHub aciton utilizies the [TimeEditAPI](https://github.com/EdmanJohan/TimeEditAPI) developed specifically for this action.  
It has been published as an [NPM package](https://www.npmjs.com/package/simple-timeedit-api).

### Limitations  
Due to the fact that TimeEdit deletes events that have passed, and the script  
itself does not maintain memory, old events will simply be deleted as time passes.
