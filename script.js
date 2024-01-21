const apiUrl = 'https://api.openai.com/v1/chat/completions';

function return_prompt_template (equation) {
    const prompt_template = `Take the role of an advanced mathematician and html coder. Explain the equation ${equation}, returning the output in an unordered list html tag. Each component should be in an li tag with the explanation next to it like so: <li> component – explanation. Account for anything you may think is mathematical notation using html math format. Include a high-level description in a <p> tag. Include the class “ec-equation-para” in the <p> tag. Include the class “ec-equation-list-element” in the <li> tag.  Include the class “ec-equation-ul-element” in the <ul> tag. Check if you recognise the equation to be well-known. Keep the component and the explanation of it in the same <li> tag! Return ONLY the html code with no other text. Do not include any text that is not html.`;
    const new_prompt_template = `Explain the equation ${equation}. Give a summary of the equation in one paragraph of approximately 60 words and give a further explanation of each component of the equation in separated lines like so: component: explanation.`
    return new_prompt_template;
};

async function testOpenAIKey(openAPIKey) {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const messages = [{"role": "user", "content": "test"}];
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
            document.getElementById('ec-apikey-entry').classList.add('invisible');
            document.getElementById('popup-container-equations').classList.remove('invisible');
        } else {
            console.log('Connection Unsuccessful')
        }
    });
};

function psuedoPass() {
    console.log('Connection Successful')
    document.getElementById('ec-apikey-entry').classList.add('invisible');
    document.getElementById('popup-container-equations').classList.remove('invisible');
};

async function sendMathQuery(mathEquation) {
    setLoadingSymbol();
    const apiKey = await chrome.storage.local.get("apiKey");
    console.log(apiKey)
    const bearer = 'Bearer ' + apiKey.apiKey;

    prompt_template = return_prompt_template(mathEquation);
    
    const messages = [{"role": "user", "content": prompt_template}];
    const failureMessage = "Unable to send query";

    const params = {
        messages: messages,
        max_tokens: 300,
        model: "gpt-3.5-turbo", 
        temperature: 0.1
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
            formatted = formatEquationText(completion);
            document.getElementById('equation-output').classList.remove('invisible')
            document.getElementById('equation-output').innerHTML = formatted;
            rmLoadingSymbol();
        } else {
            rmLoadingSymbol();
            document.getElementById("equation-output-success-message").textContent = failureMessage;

        }
    });
};


function setLoadingSymbol(){
    document.getElementById('equation-submit').classList.add('invisible');
    document.getElementById('equation-submit-loader').classList.remove('invisible');
};

function rmLoadingSymbol(){
    document.getElementById('equation-submit-loader').classList.add('invisible');
    document.getElementById('equation-submit').classList.remove('invisible');
};


function returnToApiSubmit() {
    document.getElementById('ec-apikey-entry').classList.remove('invisible');
    document.getElementById('popup-container-equations').classList.add('invisible');
};


function formatEquationText(text) {
    // Split the text into paragraphs

    const paragraphs = text.split('\n\n');

    console.log(paragraphs)

    const components = paragraphs[1].split('\n');

    console.log(components);

    let componentList = '<ul class="ec-equation-ul-element">';
    components.forEach(component => {
        componentList += `<li class="ec-equation-list-element">${component.trim()}</li>`
    });
    componentList += '</ul>';

    paragraphs[1] = componentList;
    const formattedText = paragraphs.join('\n\n');

    return formattedText;
};


// Document Listeners

document.getElementById("api-key-submit").addEventListener('click', function (e) {
    psuedoPass();
});

document.getElementById("return-to-api-submit").addEventListener('click', function (e) {
    returnToApiSubmit();
});

document.getElementById("equation-submit").addEventListener('click', async function (e) {
    e.preventDefault();
    const math_equation = document.getElementById('equation-input').value;
    await sendMathQuery(math_equation);
});

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
