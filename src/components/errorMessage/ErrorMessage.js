import img from './error.gif';
import './errorMessage.scss';

const ErrorMessage = () => {
    return (
        <img className='error-message' src={img} alt='Error'/>
    )
}

export default ErrorMessage;