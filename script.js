function testOpenAIKey(openAPIKey) {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const prompt = 'test';
    const successMessage = 'Connection Successful';
    const bearer = 'Bearer ' + openAPIKey;

    const params = {
        prompt: prompt,
        max_tokens: 10,
        model: "gpt-3.5-turbo"
    };

    const headers = {
        'Authorisation': bearer,
        'Content-Type': 'application/json'
    };

    console.log(headers);

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
    .then(response => {
        if (response.status === 200) {
            console.log('Connection Successful')
            document.getElementById('success-message').textContent = successMessage;
        } else {
            console.log('Connection Unsuccessful')
        }
    });
};

document.getElementById('api-key-submit').addEventListener('click', function () {
    const apiKey = document.getElementById('api-key-input').value;
    chrome.storage.local.set({ 'apiKey': apiKey }, function () {
        testOpenAIKey(apiKey);
        console.log('API key saved');
    });
});
