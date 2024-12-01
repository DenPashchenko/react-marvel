import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErroorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';
import { Component } from "react";

class App extends Component {
    state = {
        selectedChar: null
    }

    onCharSelected = (id) => {
        this.setState({
            selectedChar: id
        })
    }

    render() {
        return (
            <div className="app">
                <AppHeader />
                <main>
                    <ErroorBoundary>
                        <RandomChar />
                    </ErroorBoundary>                    
                    <div className="char__content">
                        <ErroorBoundary>
                            <CharList onCharSelected={this.onCharSelected} />
                        </ErroorBoundary>                        
                        <ErroorBoundary>
                            <CharInfo charId={this.state.selectedChar} />
                        </ErroorBoundary>

                    </div>
                    <img className="bg-decoration" src={decoration} alt="vision" />
                </main>
            </div>
        )
    }
}

export default App;