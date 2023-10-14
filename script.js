
function testOpenAIKey(openAPIKey) {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const messages = [{"role": "user", "content": "test"}];
    const successMessage = 'Connection Successful';
    const bearer = 'Bearer ' + openAPIKey;

    const params = {
        messages: messages,
        max_tokens: 10,
        model: "gpt-3.5-turbo"
    };

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



document.getElementById("api-key-submit").addEventListener('click', function (e) {
    e.preventDefault();
    const apiKey = document.getElementById('api-key-input').value;
    testOpenAIKey(apiKey);
    chrome.storage.local.set({ 'apiKey': apiKey }, function () {
        console.log('API key saved');
    });
});
