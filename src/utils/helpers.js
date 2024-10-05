export const getWordFrequency = (text) => {
    // Convert text to lowercase and remove punctuation
    const words = text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/);

    // Create an object to store word frequency
    const frequency = {};

    // const frequencyArray = [];

    // Count frequency of each word
    words.forEach((word) => {
        if (word) {
            frequency[word] = (frequency[word] || 0) + 1;
        }
    });

    const frequencyArray = Object.keys(frequency).map((keyword) => ({
        keyword,
        frequency: frequency[keyword]
    }))

    return frequencyArray;
}

