import './charList.scss';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import { Component } from 'react';
import PropTypes from 'prop-types';

class CharList extends Component {
    state = {
        characters: [],
        loading: true,
        newItemLoading: false,
        error: false,
        offset: 1548,
        listEnded: false
    };

    marvelService = new MarvelService();
    itemRefs = [];

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharacterListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharsLoaded)
            .catch(this.onError);
    }

    onCharacterListLoading = () => {
        this.setState({ newItemLoading: true })
    }

    onCharsLoaded = (newCharacters) => {
        let isListEnded = false;
        if (newCharacters.length < 9) {
            isListEnded = true;
        }

        this.setState(({ offset, characters }) => ({
            characters: [...characters, ...newCharacters],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            listEnded: isListEnded
        }));
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        });
    }

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    render() {
        const { characters, loading, error, newItemLoading, offset, listEnded } = this.state;
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;

        const charItems = characters.map((item, i) => {
            let imgStyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'contain' };
            }

            return (
                <li className="char__item"
                    ref={this.setRef}
                    key={item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i);
                    }}
                    onKeyUp={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
                        }
                    }}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });

        const content = !(loading || error)
            ? <View
                charItems={charItems}
                newItemLoading={newItemLoading}
                offset={offset}
                onRequest={this.onRequest}
                listEnded={listEnded} />
            : null;

        return (
            <>
                {errorMessage}
                {spinner}
                {content}
            </>
        )
    }
}

const View = ({ charItems, newItemLoading, offset, onRequest, listEnded }) => {
    const buttonStyle = { 'display': listEnded ? 'none' : 'block' };
    return (
        <div className="char__list">
            <ul className="char__grid">
                {charItems}
            </ul>
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={buttonStyle}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;