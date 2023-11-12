const apiUrl = 'https://api.openai.com/v1/chat/completions';

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
            document.getElementById('success-message').classList.add('invisible');
            document.getElementById('ec-apikey-entry').classList.add('invisible');
            document.getElementById('popup-container-equations').classList.remove('invisible');
            // loadNewScreen()
        } else {
            console.log('Connection Unsuccessful')
        }
    });
};

function loadNewScreen() {
    console.log('loading screen');
    fetch('home.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('popup-container').innerHTML = data;
        });
};

async function sendMathQuery(mathEquation) {
    const apiKey = await chrome.storage.local.get("apiKey");
    const bearer = 'Bearer ' + apiKey.apiKey;
    const prompt_template = `Take the role of an advanced mathematician and html coder. Explain the following equation: ${mathEquation}. Explain each component of the equation. Return the explanation in a unordered list html tag. Each componenent and its explanation should go in an list item tag within the ul tag. Return solely the html code with no other text.  Do not include any other explanation`;

    const messages = [{"role": "user", "content": prompt_template}];
    const failureMessage = "Unable to send query";

    const params = {
        messages: messages,
        max_tokens: 100,
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
    .then(async response => {
        if (response.status === 200) {
            console.log('Query Sent Successfully');
            const response_json = await response.json();
            const completion = response_json.choices[0].message.content;
            document.getElementById('equation-output').innerHTML = completion;
        } else {
            document.getElementById("equation-output-success-message").textContent = failureMessage;
        }
    });
};

document.getElementById("api-key-submit").addEventListener('click', function (e) {
    e.preventDefault();
    const apiKey = document.getElementById('api-key-input').value;
    testOpenAIKey(apiKey); // uncomment this so the button works
    // loadNewScreen() // uncomment this to test home.html
    chrome.storage.local.set({ 'apiKey': apiKey }, function () {
        console.log('API key saved');
    });
    chrome.storage.local.set({ apiKeySubmitted: true });
});

document.getElementById("equation-submit").addEventListener('click', async function (e) {
    e.preventDefault();
    const math_equation = document.getElementById('equation-input').value;
    await sendMathQuery(math_equation);

});


