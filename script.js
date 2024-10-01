function loginOnOpen() {
    chrome.storage.local.get('apiKey', function(result) {
        if (result.apiKey) {
            changeScreen();
        } else {
            console.log('No pre-saved API key');
        }
    });
}

loginOnOpen();

const apiUrl = 'https://api.openai.com/v1/chat/completions';

function return_prompt_template (equation) {
    const new_prompt_template = `You are a mathematician who is capable of understanding and explaining any mathematical equation. Your role will be to explain the elements of an equation.
    Return your results as a json in the form: {"explanation": "explanation of the element", "element1": "explanation of element1", "element2": "explanation of element2"} and so on.
    For example, if given the equation y = mx + c, your response will be {"explanation": "This equation represents the slope-intercept form of a linear equation", "y": "This represents the dependent variable or the output of the function, which changes depending on the value of x", "m": "This is the slope of the line. The slope measures how steep the line is and is the change in y divided by the change in x", "c": " The y-intercept, representing the value of y when x is equal to zero."}
    Explain the equation ${equation} using this format.`
    return new_prompt_template;
};

async function testOpenAIKey(openAPIKey) {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const messages = [{"role": "user", "content": "test"}];
    const bearer = 'Bearer ' + openAPIKey;

    const params = {
        messages: messages,
        max_tokens: 10,
        model: "gpt-4-turbo"
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
            changeScreen();
        } else {
            console.log('Connection Unsuccessful')
        }
    });
};

function changeScreen() {
    console.log('Connection Successful')
    document.getElementById('ec-apikey-entry').classList.add('invisible');
    document.getElementById('popup-container-equations').classList.remove('invisible');
};

function psuedoPass() {
    console.log('Connection Successful')
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
        model: "gpt-4-turbo", 
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
            console.log(response_json);
            const completion = response_json.choices[0].message.content;
            console.log(completion);
            formatted = formatEquationText(completion);
            document.getElementById('equation-output').classList.remove('invisible');
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


function formatEquationText(gpt_response) {

    const jsonInput = JSON.parse(gpt_response);
    
    const explanation = `<p class="ec-equation-para">${jsonInput.explanation}</p>`;

    const elements = Object.keys(jsonInput)
        .filter(key => key !== "explanation")
        .map(key => `<li class="ec-equation-list-element"><strong>${key}:</strong> ${jsonInput[key]}</li>`);

    const elementsList = `<ul class="ec-equation-ul-element">\n${elements.join("\n")}\n</ul>`;

    const formattedText = [explanation, elementsList].join("\n\n");

    return formattedText
}


// Document Listeners

// document.getElementById("api-key-submit").addEventListener('click', function (e) {
//     psuedoPass();
// });

const return_button = document.getElementById('return-to-api-submit');
if (return_button) {
    return_button.addEventListener('click', function (e) {
        returnToApiSubmit();
    });
};

const equation_submit = document.getElementById('equation-submit');
if (equation_submit) {
    equation_submit.addEventListener('click', async function (e) {
        e.preventDefault();
        const math_equation = document.getElementById('equation-input').value;
        await sendMathQuery(math_equation);
    });
};

const api_key_submit = document.getElementById("api-key-submit");
if (api_key_submit) {
    api_key_submit.addEventListener('click', function (e) {
        e.preventDefault();
        const apiKey = document.getElementById('api-key-input').value;
        testOpenAIKey(apiKey); 
        chrome.storage.local.set({ 'apiKey': apiKey }, function () {
            console.log('API key saved');
        });
        chrome.storage.local.set({ apiKeySubmitted: true });
    });
};

window.onblur = function() {
    chrome.runtime.sendMessage({popupClosed: true});
};
