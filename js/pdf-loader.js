async function loadQuestions(source) {

    const response = await fetch(
        `/api/fetch-tutorial-questions?source=${encodeURIComponent(source)}`
    );

    if (!response.ok) {
        throw new Error("Unable to load tutorial questions.");
    }

    const payload = await response.json();

    return payload;
}
