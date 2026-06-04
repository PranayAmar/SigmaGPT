import "dotenv/config";

const getGeminiAPIResponse = async (message) => {
    const options = {
        method: "POST",
        headers: {
            "x-goog-api-key": process.env.GEMINI_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [
                {
                    role: "user",
                    parts: [{
                        text: message
                    }
                    ]
                }
            ]
        })
    };


    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent", options);
        const data = await response.json();
        console.log(data);

        if (!data.candidates) {
            console.log(data);
            return null;
        }

        return data.candidates[0].content.parts[0].text;

    } catch (err) {
        console.log(err);
    }
}

export default getGeminiAPIResponse;