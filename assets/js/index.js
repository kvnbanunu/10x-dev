document.addEventListener('DOMContentLoaded', () => {
    const baseURL = "https://4537api.banunu.dev/10x-dev";
    const genBtn = document.getElementById('generate');
    const clearBtn = document.getElementById('clear');
    const promptElem = document.getElementById('prompt');
    const outputElem = document.getElementById('output');

    genBtn.onclick = async () => {
        try {
            const response = await fetch(baseURL + '/prompt', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: promptElem.value
                }),
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const json = await response.json().output;
            outputElem.value = json;

        } catch (error) {
            console.error(error.message);
        }
    }

    clearBtn.onclick = () => {
        outputElem.value = '';
    }
});

