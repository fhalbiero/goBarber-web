import React, { useCallback, useRef, ChangeEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn, FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/input';
import Button from '../../components/button';

import { Container, Content, AvatarImput } from './styles';
import api from '../../services/apiClient';

interface ProfileFormData {
    name: string;
    email: string;
    old_password: string;
    password: string | null;
    password_confirmation: string | null;
}

const Profile:React.FC = () => {
    
    const formRef = useRef<FormHandles>(null)
    
    const { user, updateUser } = useAuth();
    const { addToast } = useToast();
    const history = useHistory();

    const handleSubmit = useCallback( async (data: ProfileFormData) => {
        formRef.current?.setErrors({});
        try {
            const schema = Yup.object().shape({
                name: Yup.string()
                    .required('Nome é obrigatório'),
                email: Yup.string()
                    .required('E-mail obrigatório')
                    .email('Digite um e-mail válido'),
                old_password: Yup.string(),
                password: Yup.string().when('old_password', {
                    is: val => !!val.length,
                    then: Yup.string().required('Password obrigatório'),
                    otherwise: Yup.string(),
                }),
                password_confirmation: Yup.string().when('old_password', {
                    is: val => !!val.length,
                    then: Yup.string().required('Password obrigatório'),
                    otherwise: Yup.string(),
                })/* .oneOf(
                    [Yup.ref('password'), null],
                    'Confirmação incorreta'
                ) */
            });

            await schema.validate(data, { abortEarly: false});

            const { name, email, old_password, password, password_confirmation } = data;

            const formData = {
                name,
                email,
                ...(old_password
                    ? {
                        old_password,
                        password,
                        password_confirmation
                    }
                    : {}),
            }

            const response = await api.put('/profile', formData);

            updateUser(response.data);

            history.push('/dashboard');

            addToast({
                type: 'success',
                title: 'Perfil atualizado',
                description: 'Suas informações do perfil foram atualizadas.'
            }); 
     
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErrors(error);
                formRef.current?.setErrors(errors);

                return;
            }
            
            addToast({
                type: 'error',
                title: 'Erro ao atualizar o perfil',
                description: 'Ocorreu um erro ao tentar atualizar o perfil'
            });           
        }
    }, [ addToast, history ]);


    const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const data = new FormData();

            data.append('avatar', e.target.files[0]);

            api.patch('/users/avatar', data).then(response => {
                updateUser(response.data);

                addToast({
                    type: 'success',
                    title: 'Avatar atualizado'
                });
            });
        }
    }, [addToast, updateUser])


    return (
        <Container>
            <header>
                <div>
                    <Link to="/dashboard"><FiArrowLeft /></Link>
                </div>
            </header>
            <Content>
                <Form 
                    ref={formRef} 
                    onSubmit={handleSubmit}
                    initialData={{
                        name: user && user.name,
                        email: user && user.email,
                    }}
                > 

                    <AvatarImput>
                        <img src={user && user.avatar_url} alt={user && user.name} />
                        <label htmlFor="avatar">
                            <FiCamera />
                            <input type="file" id="avatar" onChange={ handleAvatarChange }/>
                        </label>             
                    </AvatarImput>
                    <h1>Meu Perfil</h1>
                   

                    <Input name="name" icon={FiUser} placeholder="Nome" />
                    <Input name="email" icon={FiMail} placeholder="E-mail" />
                    
                    <Input 
                        containerStyle={{ marginTop: 24 }}
                        name="old_password" 
                        icon={FiLock} 
                        type="password" 
                        placeholder="Senha atual" 
                    />
                    <Input 
                        name="password" 
                        icon={FiLock} 
                        type="password" 
                        placeholder="Nova Senha" 
                    />
                    <Input 
                        name="password_confirmation" 
                        icon={FiLock} 
                        type="password" 
                        placeholder="Confirmar senha" 
                    />

                    <Button type="submit">Entrar</Button>
                    <Link to="/forgot-password">Esqueci minha senha</Link>
                </Form>

                <Link to="/signup">
                    <FiLogIn />
                    Criar conta
                </Link>
            </Content>
        </Container>
    );
}

export default Profile;