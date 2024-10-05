
/**
 * 
 * @param {String} summery 
 * @returns Array
 */

export const getWordFrequency = (summery) => {
    // ----------- Convert text to lowercase and removing punctuation -----------
    const words = summery
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/);

    // ----------- object for storing word frequency -----------
    const frequency = {};

    // ----------- If new then add it into frequency object  elese increse the frequency of word -----------
    words.forEach((word) => {
        if (word) {
            frequency[word] = (frequency[word] || 0) + 1;
        }
    });

    // ----------- creating array of objects to display in chart -----------
    const frequencyArray = Object.keys(frequency).map((keyword) => ({
        keyword,
        frequency: frequency[keyword]
    }))

    return frequencyArray;
}

