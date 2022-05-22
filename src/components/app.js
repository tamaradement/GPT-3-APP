import React, { Component } from 'react';
import './app.css';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userTextPrompt: "",
            isSubmitted: false,
            results: [],
        }
        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.state.isSubmitted === true) {
            const response = await (await getPrompt(this.state.userTextPrompt)).json();
            let item = {
                prompt: this.state.userTextPrompt,
                responseText: response.choices[0].text
            };
            let newResults = this.state.results.slice();
            newResults.unshift(item);

            this.setState({
                userTextPrompt: '',
                isSubmitted: !this.state.isSubmitted,
                results: newResults
            });

        }

    }

    handleUserInput(event) {
        this.setState({ userTextPrompt: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.userTextPrompt !== '') {
            this.setState({ isSubmitted: !this.state.isSubmitted });
        }
    }

    render() {
        this.componentDidMount();

        return (
            <div>
                <div><h1>Fun with AI</h1></div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <input
                            type="text"
                            value={this.state.userTextPrompt}
                            onChange={this.handleUserInput}
                            placeholder="Send prompt..."
                        />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <div><h2>Responses:</h2></div>
                <ul>
                    {this.state.results.map((response, index) => {
                        return (
                            <div key={index}>
                                <li><b>Prompt:</b> {response.prompt}
                                    <br></br>
                                    <b>Response:</b> {response.responseText}
                                </li>
                                <br></br>
                            </div>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

export default App;

const getPrompt = async (prompt) => {

    const secret = process.env.REACT_APP_SECRET_KEY;
    const data = {
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 64,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
    };
    try {
        const response = await fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${secret}`,
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            return response
        }

    } catch (e) {
        console.error('Something went wrong.')
    }
}