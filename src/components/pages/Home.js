import styles from './Home.module.css'
import savings2 from '../../img/savings2.svg'
import LinkButton from '../layout/LinkButton'

export default function Home(){
    return (
        <section className={styles.home_container}>
            <h1>Bem-vindo ao <span>Custos</span></h1>
            <p>Comece a gerenciar os seus projetos agora mesmo!</p>
            <LinkButton to="/newproject" text="Criar projeto"/>
            <img src={savings2} alt="Custos" />
        </section>
    )
}