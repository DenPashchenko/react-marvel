import './randomChar.scss';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import mjolnir from '../../resources/img/mjolnir.png';
import { Component } from 'react';

class RandomChar extends Component {
    state = {
        character: {},
        loading: true,
        error: false
    }

    textLimit = 185;
    emptyDescriptionText = 'Description not defined.';

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    _beautifyDescription = (desc) => {
        if (desc == '') {
            return this.emptyDescriptionText;
        }

        if (desc.length >= this.textLimit) {
            return desc.slice(0, this.textLimit - 3) + '...';
        }

        return desc;
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        });
    }

    onCharLoaded = (character) => {
        const description = this._beautifyDescription(character.description);
        character.description = description;
        this.setState({ character, loading: false });
    }

    onCharLoading = () => {
        this.setState({loading: true, error: false});
    }

    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.onCharLoading();
        this.marvelService
            .getCharacterById(id)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    render() {
        const { character, loading, error } = this.state;
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error)
            ? <View character={character} />
            : null;

        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br />
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button
                        className="button button__main"
                        onClick={this.updateChar}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
                </div>
            </div>
        )
    }
}

const View = ({ character }) => {
    const { name, description, thumbnail, homepage, wiki } = character;

    let imgStyle = { 'objectFit': 'cover' };
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = { 'objectFit': 'contain' };
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character"
                className="randomchar__img" style={imgStyle} />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;