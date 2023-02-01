import styles from '../project/ProjectCard.module.css'

export default function ServiceCard({id, name, cost, description, handleRemove}){
    return (
        <div className={styles.project_card}>
            <h4>{name}</h4>
            <p>
                <span>Custo total:</span> R${cost}
            </p>
            <p>{description}</p>
        </div>
    )
}