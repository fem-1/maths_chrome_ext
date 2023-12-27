const apiUrl = 'https://api.openai.com/v1/chat/completions';

function return_prompt_template (equation) {
    const prompt_template = `Take the role of an advanced mathematician and html coder. Explain the following equation: ${equation}. Explain each component of the equation. Return the explanation in a unordered list html tag. Each component and its explanation should go in an list item tag within the ul tag. Account for anything you may think is subscript and return it in a html math format. At the top return, a high-level description of what the equation does and check if you recognise the equation to be a well known one. Return solely the html code with no other text. Do not include any other text aside from what is being asked.`;
    return prompt_template;
};

async function testOpenAIKey(openAPIKey) {
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
    .then(async response => {
        if (response.status === 200) {
            console.log('Connection Successful')
            document.getElementById('success-message').textContent = successMessage;
            document.getElementById('success-message').classList.add('invisible');
            document.getElementById('ec-apikey-entry').classList.add('invisible');
            document.getElementById('popup-container-equations').classList.remove('invisible');
        } else {
            console.log('Connection Unsuccessful')
        }
    });
};

function psuedoPass() {
    console.log('Connection Successful')
    document.getElementById('success-message').classList.add('invisible');
    document.getElementById('ec-apikey-entry').classList.add('invisible');
    document.getElementById('popup-container-equations').classList.remove('invisible');
};

async function sendMathQuery(mathEquation) {
    setLoadingSymbol();
    const apiKey = await chrome.storage.local.get("apiKey");
    const bearer = 'Bearer ' + apiKey.apiKey;

    prompt_template = return_prompt_template(mathEquation);
    
    const messages = [{"role": "user", "content": prompt_template}];
    const failureMessage = "Unable to send query";

    const params = {
        messages: messages,
        max_tokens: 300,
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
            rmLoadingSymbol();
        } else {
            rmLoadingSymbol();
            document.getElementById("equation-output-success-message").textContent = failureMessage;

        }
    });
};

function formatGPToutput(gpt_output) {

};

function setLoadingSymbol(){
    document.getElementById('equation-submit').classList.add('invisible');
    document.getElementById('equation-submit-loader').classList.remove('invisible');
};

function rmLoadingSymbol(){
    document.getElementById('equation-submit-loader').classList.add('invisible');
    document.getElementById('equation-submit').classList.remove('invisible');
};

// uncomment this to get normally functionality
// document.getElementById("api-key-submit").addEventListener('click', function (e) {
//     e.preventDefault();
//     const apiKey = document.getElementById('api-key-input').value;
//     async testOpenAIKey(apiKey); 
//     // loadNewScreen() // uncomment this to test home.html
//     chrome.storage.local.set({ 'apiKey': apiKey }, function () {
//         console.log('API key saved');
//     });
//     chrome.storage.local.set({ apiKeySubmitted: true });
// });

document.getElementById("api-key-submit").addEventListener('click', function (e) {
    psuedoPass();
});

document.getElementById("equation-submit").addEventListener('click', async function (e) {
    e.preventDefault();
    const math_equation = document.getElementById('equation-input').value;
    await sendMathQuery(math_equation);
});


