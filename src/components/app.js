import React, { Component } from "react";
import "./app.css";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userTextPrompt: "",
            results: [],
            engine: "curie"
        };
        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectOption = this.handleSelectOption.bind(this);
    }

    handleUserInput(event) {
        this.setState({ userTextPrompt: event.target.value });
    }

    handleSelectOption(event) {
        this.setState({ engine: event.target.value });
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (this.state.userTextPrompt !== "") {
            const response = await getPrompt(
                this.state.userTextPrompt,
                this.state.engine
            );

            let item = {
                prompt: this.state.userTextPrompt,
                responseText: response.choices[0].text,
                engine: this.state.engine,
            };

            let newResults = this.state.results.slice();
            newResults.unshift(item);

            this.setState({
                userTextPrompt: "",
                results: newResults
            });
        }
    }

    render() {
        return (
            <div>
                <div>
                    <h1>Fun with AI</h1>
                </div>
                <div style={{ padding: 20 }}>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Pick your engine:
                            <br></br>
                            <select
                                value={this.state.engine}
                                onChange={this.handleSelectOption}
                            >
                                <option value="curie">Curie</option>
                                <option value="babbage">Babbage</option>
                                <option value="ada">Ada</option>
                            </select>
                        </label>
                        <br></br>
                        <input
                            type="text"
                            value={this.state.userTextPrompt}
                            onChange={this.handleUserInput}
                            placeholder="Send prompt..."
                        />
                        <input type="submit" value="Submit" />
                    </form>
                    {this.state.results.length > 0 && (
                        <div>
                            <h2>Responses:</h2>
                        </div>
                    )}
                    <ul>
                        {this.state.results.map((response, index) => {
                            return (
                                <div key={index}>
                                    <li>
                                        <b>Prompt:</b> {response.prompt}
                                        <br></br>
                                        <b>Response from {response.engine}:</b> {response.responseText}
                                    </li>
                                    <br></br>
                                </div>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}

export default App;

const getPrompt = async (prompt, engine) => {
    const secret = process.env.REACT_APP_SECRET_KEY;
    const data = {
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 64,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
    };
    try {
        const response = await fetch(
            `https://api.openai.com/v1/engines/text-${engine}-001/completions`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${secret}`
                },
                body: JSON.stringify(data)
            }
        );
        const decodedResponse = await response.json();

        return decodedResponse;
    } catch (e) {
        console.log("Something went wrong...");
    }
};
