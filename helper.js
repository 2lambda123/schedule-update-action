/**
 * Contains helper functions for formatting.
 * Author: Johan Edman, 2022
 */

/**
 * 
 * @param {string} string String to capitalize 
 * @returns 
 */
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Formats content as markdown.
 * @param {*} courseEvents 
 * @returns Formatted markdown string
 */
function formatAsMarkdown(courseEvents) {
    let markdownText = "  \n";

    courseEvents.forEach(event => {
        const date = capitalize(event.startDate.setLocale('sv-se').toFormat('cccc, D'));
        const startTime = event.startDate.setLocale('sv-se').toFormat('t');
        const endTime = event.endDate.setLocale('sv-se').toFormat('t');

        markdownText += `#### ${event.type}, ${date}\n`;
        markdownText += `Time: ${startTime} - ${endTime}  \n`;
        markdownText += `Locations: `;
        
        for (let i = 0; i < event.location.length; i++) {
            markdownText += `[${event.location[i].replace("§", "")}](${event.locationUrl[i]})${i < event.location.length - 1 ? "," : ""} `;
        }

        markdownText += "  \n";
        markdownText += `Teachers: ${event.lecturers}\n\n`;
        markdownText.replace("§", "");
    });

    return markdownText;
}

/**
 * Parses string to boolean parameter
 * @param {string} param Input string
 */
function parseBoolean(value) {
    return (value === 'true' || value === '1');
}


module.exports = { capitalize, formatAsMarkdown, parseBoolean };
