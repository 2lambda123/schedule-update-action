/**
 * Main GitHub action code
 * Author: Johan Edman, 2022
 */
const helpers = require("./helper");
const TimeEdit = require("simple-timeedit-api");
const { DateTime } = require("luxon");

const core = require('@actions/core');
const github = require('@actions/github');

const DYNAMIC_START_STRING = "<!-- start dynamic schedule content -->";
const DYNAMIC_END_STRING = "<!-- end dynamic schedule content -->";

async function runTask() {
    const taskParams = {
        baseURL: core.getInput('timeedit-url'),
        courseId: core.getInput('course-name'),
        repoOwner: core.getInput('repo-owner') || github.context.repo.owner,
        repoName: core.getInput('repo-name') || github.context.repo,
        repoFile: core.getInput('repo-file'),
        filterEmpty: helpers.parseBoolean(core.getInput('filter-empty')),
        useKTHPlaces: helpers.parseBoolean(core.getInput('use-kth-places'))};

    const octokit = github.getOctokit(token);

    const content = await updateScheduleFile(taskParams, octokit);
    await commitNewFile(taskParams, octokit, content);
}

/**
 * Fetches the content from the repository file and inserts the new content
 * within the dynamic content tags, if found.
 */
async function updateScheduleFile(taskParams, octokit) {
    try {
        const res = await octokit.request(`GET /repos/{owner}/{repo}/contents/{file}`, {
            owner: taskParams.repoOwner,
            repo: taskParams.repoName
        });

        const { path, sha, content, encoding } = res.data;
        const rawContent = Buffer.from(content, encoding).toString();
        const startIndex = rawContent.indexOf(DYNAMIC_START_STRING);
        const endIndex = rawContent.indexOf(DYNAMIC_END_STRING);
        const updatedContent = `${(startIndex === -1 || endIndex === -1) ? rawContent : rawContent.slice(0, startIndex + DYNAMIC_START_STRING.length)}\n${await getNewContentSection()}\n${rawContent.slice(endIndex)}`

        return { path: path, sha: sha, encoding: encoding, data: updatedContent};
    } catch (error) {
        throw new Error(`There was an error fetching the repository file.`, err);
    }
}


/**
 * Fetches the content from given TimeEdit
 * @returns markdown content
 */
async function getNewContentSection() {
    const timeEdit = new TimeEdit({ baseUrl: process.env.BASE_URL, filterEmpty: process.env.FILTER_EMPTY, useKTHPlaces: process.env.KTH_PLACES });
    const courseEvents = await fetchCourseEvents(timeEdit, process.env.COURSE_NAME);
    return helpers.formatAsMarkdown(courseEvents);
}


/**
 * Fetches the course events for the given courseId
 * @param {*} timeEdit TimeEdit instance
 * @param {*} courseName CourseId
 * @returns Array of events
 */
async function fetchCourseEvents(timeEdit, courseName) {
    const courseCode = await timeEdit.getCourseId(courseName);
    return timeEdit.getCourseEvents(courseCode)
}


/**
 * Commits the changes to the file to the given repository file.
 * @param {string} repo GitHub repository
 * @param {string} owner GitHub user
 * @param {string} path GitHub path
 * @param {string} sha SHA of content
 * @param {string} encoding Encoding
 * @param {string} updatedContent Content to commit.
 */
async function commitNewFile(taskParams, octokit, content) {
    try {
        octokit.request(`PUT /repos/{owner}/{repo}/contents/{path}`, {
            owner: taskParams.repoOwner,
            message: `Update ${content.path}`,
            content: Buffer.from(content.data, "utf-8").toString(content.encoding),
            path: content.path,
            sha: content.sha,
        });
    } catch (err) {
        throw new Error(`There was an error committing the changes in ${taskParams.repoOwner}/${taskParams.repoName}/${taskParams.repoFile}.`, err);
    }

}


/* Initiates the task */
runTask().catch((err) => core.setFailed(err));
