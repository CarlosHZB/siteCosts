import styles from './LinkButton.module.css'
import {Link} from 'react-router-dom'

export default function LinkButton(props){
    return(
        <Link className={styles.btn} to={props.to}>
            {props.text}
        </Link>
    )
}