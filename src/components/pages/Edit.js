import {parse, v4 as uuidv4} from 'uuid'
import styles from './Edit.module.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Loading from '../layout/Loading'
import Container from '../layout/Container'
import ProjectForm from '../project/ProjectForm'
import Message from '../layout/Message'
import ServiceForm from '../service/ServiceForm'
import ServiceCard from '../service/ServiceCard'

export default function Edit(){

    const {id} = useParams()

    const [project, setPtoject] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)

    const [message, setMessage] = useState()
    const [type, setType] = useState()

    const [services, setServices] = useState([])

    const [showServiceForm, setShowServiceForm] = useState(false)


    useEffect(()=> {
        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((resp) => resp.json())
        .then((data)=>{
            setPtoject(data)
            setServices(data.services)
        })
        .catch(err => console.log(err))
    }, [id])

    function editPost(project){
        setMessage('')

        if(project.budget < project.cost){
            setMessage('O orçamento não pode ser menor que o custo do projeto!')
            setType('error')
            return false
        }

        fetch(`http://localhost:5000/projects/${project.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project),
        })
        .then((resp) => resp.json())
        .then((data)=>{
            setPtoject(data)
            setShowProjectForm(!showProjectForm)
            setMessage('Projeto atualizado com sucesso!')
            setType('success')
        })
        .catch(err => console.log(err))
    }

    function createService(project){
        setMessage('')
        const lastService = project.services[project.services.length -1]

        lastService.id = uuidv4()

        const newCost = parseFloat(lastService.cost) + parseFloat(project.cost)

        if(newCost > parseFloat(project.budget)){
            setMessage('Valor do orçamento ultrapassado, verifique o valor do serviço')
            setType('error')
            project.services.pop()
            return false
        }
        
        project.cost = newCost

        fetch(`http://localhost:5000/projects/${project.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        }).then(resp => resp.json())
        .then(data => {

        })
          .catch(err => console.log(err))

    }

    function toggleProjectForm(){
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm(){
        setShowServiceForm(!showServiceForm)
    }

    function removeService(){

    }

    return (
        <>
        {project.name ? (
            <div className={styles.edit_details}>
            <Container customClass="column">
                {message && <Message type={type} msg={message}/>}
                <div className={styles.details_container}>
                    <h1>Projeto: {project.name}</h1>
                    <button onClick={toggleProjectForm}>
                        {!showProjectForm ?  ('Editar projeto') : ('Fechar')}
                    </button>
                    {!showProjectForm ? (
                        <div className={styles.edit_info}>
                            <p>
                                <span>Categoria:</span> {project.category.name}
                            </p>
                            <p>
                                <span>Total de Orçamento:</span> R$ {project.budget}
                            </p>
                            <p>
                                <span>Total Utilizado:</span> R$ {project.cost}
                            </p>
                        </div>
                    ):(
                        <div className={styles.edit_info}>
                            <ProjectForm handleSubmit={editPost} btnText="Conlcuir edição" projectData={project}/>
                        </div>
                    )}
                </div>
                <div className={styles.service_form_container}>
                        <h2>Adicione um serviço</h2>
                        <button className={styles.btn} onClick={toggleServiceForm}>
                        {!showServiceForm ?  ('Adicionar serviço') : ('Fechar')}
                        </button>
                        <div className={styles.edit_info}>
                            {showServiceForm && (
                            <ServiceForm 
                            handleSubmit={createService}
                            btnText="Adicionar serviço"
                            projectData={project}
                            />
                            )}
                        </div>
                </div>
                <h2>Serviços</h2>
                <Container customClass="start">
                    {services.length > 0 &&
                        services.map((service) => (
                            <ServiceCard 
                                id={service.id}
                                name={service.name}
                                cost={service.cost}
                                description={service.description}
                                key={service.id}
                                handleRemove={removeService}
                            />
                        ))
                    }
                    {services.length === 0 && <p>Não há serviços cadastrados</p>}
                </Container>
            </Container>
             </div>
        ):(
            <Loading/>
        )}

        </>
    )

}