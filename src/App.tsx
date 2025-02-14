import './App.css'
import Modal from './components/modal';
import { useState, useEffect, useRef, useMemo } from 'react';
import {useForm} from 'react-hook-form'
import { createContactFormData, createContactFormSchema }  from './validations/createContactFormSchema'
import { zodResolver } from '@hookform/resolvers/zod';

// useref para se referir a primeira renderização 
// useEffect para primeira renderização onde vai pegar os dados do localStorage
// useeffect que não funciona na primeira renderização e que vai mudar os dados do local storage
// useState que vai quardar meu objeto que vai guardar os contatos(Tipar com Interface)
// Interface para tipar as chaves de categorias
// useState que vai conter ou all ou alguma chave de categories('all' | keyof categories)
// useState para armazenar cada contato individualmente e depois acrecentado ao useState que representa o objeto de contém todos os contatos
// useState que representa um objeto para os contatos editados(Tipar através de uma interface), com duas chaves(enabled: false) e contact(para armazenar os valores do contato que será editado(iniciar cada chave com '' e false para as categorias))

interface Categoria{
  familia: boolean,
  amigos: boolean,
  colegas: boolean
}

interface Contact{
  nome: string,
  numero: string,
  email: string,
  categoria: Categoria
}

function App() {

  const defaultValues = {
    nome: '',
    numero: '',
    email: '',
    categoria: {
      familia: false,
      amigos: false,
      colegas: false
    }
  }

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalExclude, setModalExclude] = useState<boolean>(false);
  const [contacts, setContacts] = useState<Contact[]>([])
  const [phone, setPhone] = useState<string>('');
  const isFirstRender = useRef<boolean>(true);
  const {register, handleSubmit, reset, formState:{errors}} = useForm<createContactFormData>({resolver: zodResolver(createContactFormSchema), 
    defaultValues
  });

  useEffect(() => {

    const savedContacts = localStorage.getItem('jujuba@');

    if (savedContacts){
      const parsedContacts: Contact[] = JSON.parse(savedContacts);
      setContacts(parsedContacts);
    }

  }, [])

  useEffect(() => {

    if (isFirstRender.current){
      isFirstRender.current = false;
      return;
    }

    localStorage.setItem('jujuba@', JSON.stringify(contacts));

  }, [contacts])

  const contactTotal = useMemo(() => {

    return contacts.length;

  }, [contacts])


  const onSubmit = (data:Contact) => {

    const hasPriority = Object.values(data.categoria).some((value) => value);

    if (data.nome.trim() === '' || data.email.trim() === '' || data.numero.trim() === '' || (!hasPriority)){
      alert('Você precisa preencher todos os campos!');
      return;
    }

    setContacts(prevContact => [...prevContact, data]);
    setPhone('');
    reset()
    setIsModalOpen(false);

  }


  const formatPhoneNumber = (input: string): string => {
      input = input.replace(/\D/g, '');

      if (input.length <= 2) {
          input = `(${input}`;
      } else if (input.length <= 6) {
          input = `(${input.slice(0, 2)}) ${input.slice(2)}`;
      } else if (input.length <= 10) {
          input = `(${input.slice(0, 2)}) ${input.slice(2, 7)}-${input.slice(7)}`;
      } else {
          input = `(${input.slice(0, 2)}) ${input.slice(2, 7)}-${input.slice(7, 11)}`;
      }

      return input;
  };

  // Função para tratar a mudança do input
  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      // Formata o valor enquanto digita
      const formattedPhone = formatPhoneNumber(event.target.value);
      setPhone(formattedPhone); // Atualiza o estado com o número formatado
  };


  return (
    <>
      <header className='header' id='header'>

        <div className='header-content'>
          <h1 className='title'>Contatos</h1>
          <a href='#header'>
            <i className="fa-solid fa-code
            logo-code" aria-label='Logo de café'></i>
          </a>
        </div>
       
      </header>

      <section className='functionalitys'>
        <div className='functionalitys-content'>
          <a onClick={() => setIsModalOpen(true)}>+</a>
          <p>{contactTotal} contato(s)</p>
        </div>
      </section>

      <section className='input-section'>
        <div className='input-container'>
          <i className="fa-solid fa-magnifying-glass input-icon"></i>
          <input className='input-search' placeholder='Busque seu contato' ></input>
        </div>
      </section>

      <section className='categorys'>
        <div className='category-buttons'>
          <div className='category-button'>
            Todos
          </div>
          <div className='category-button'>
            Amigos
          </div>
          <div className='category-button'>
            Família
          </div>
          <div className='category-button'>
            Colegas
          </div>
        </div>
      </section>

      <section className='contacts-cards'>

            <div className='contact-card-content'>
              { contacts.map((contact, index) => {
                return (
                  <article key={index} className='contact-card'>
      
                    <div className='contact-datas-container principal-data'>
                      <div className='contact-circle'>
                        <i className="fa-regular fa-user"></i>
                      </div>
                      <h1>{contact.nome}</h1>
                    </div>
                    
                    <div className='contact-datas-container'>
                      <label>Número: </label>
                      <p>{contact.numero}</p>
                    </div>
        
                    <div className='contact-datas-container'>
                      <label>Email: </label>
                      <p>{contact.email}</p>
                    </div>
        
                    <div className='card-container-category-edit'>
                      <div className='target-category'>
                        <p>{Object.keys(contact.categoria).filter(key => contact.categoria[key as keyof Categoria])}</p>
                      </div>
                      <div className='card-icons'>
                        <i className="fa-regular fa-pen-to-square"></i>
                        <i className="fa-regular fa-trash-can" onClick={() => setModalExclude(true)}></i>
                      </div>
                    </div>
      
                  </article>
                )
              })}
  
            </div>
    
      </section>

      <Modal
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
      >
        {/* CHILDREN */}
        <h2 className='form-title'>Adicionar Contato</h2>
        <form onSubmit={handleSubmit(onSubmit)} className='form'>

          <label htmlFor='username'>* Nome</label>
          <div className='form-input-container'>
            <i className="fa-regular fa-user"></i>
            <input {...register('nome')} className='form-input' placeholder='Digite seu nome'></input>
          </div>
          {errors.nome && <span className='error'>* {errors.nome.message}</span>}

          <label htmlFor='number'>* Número</label>
          <div className='form-input-container'>
            <i className="fa-solid fa-mobile-screen-button"></i>
            <input {...register('numero')} className='form-input' placeholder='(xx) xxxxx-xxxx' value={phone} onChange={handlePhoneChange}></input>
          </div>
          {errors.numero && <span className='error'>* {errors.numero.message}</span>}

          <label htmlFor='email' >* E-mail</label>
          <div className='form-input-container'>
            <i className="fa-regular fa-envelope"></i>
            <input {...register('email')} className='form-input' placeholder='Digite seu email'></input>
          </div>
          {errors.email && <span className='error'>* {errors.email.message}</span>}

          <label>* Categoria</label>
          <div className='checkbox-container'>
            <div className='checkbox-group'>
              <input {...register('categoria.familia')} className='checkbox' type='checkbox'></input>
              <label>Família</label>
            </div>
          </div>
          <div className='checkbox-container'>
            <div className='checkbox-group'>
              <input {...register('categoria.amigos')} className='checkbox' type='checkbox'></input>
              <label>Amigos</label>
            </div>
          </div>
          <div className='checkbox-container'>
            <div className='checkbox-group'>
              <input {...register('categoria.colegas')} className='checkbox' type='checkbox'></input>
              <label>Colegas</label>
            </div>
          </div>
          {errors.categoria && <span className='error'>* {errors.categoria.message}</span>}

          <button type='submit' className="modal-button">Salvar contato</button>

        </form>
      </Modal>
      <Modal
      isOpen={modalExclude}
      setIsOpen={setModalExclude}
      className="modal-exclude">
        {/* CHILDREN */}
          <p className='exclude-description'>Certeza que quer excluir o contato de:</p>          
          <button className="modal-button button-exclude">Excluir</button>

      </Modal>

      
    </>
  )
}

export default App
