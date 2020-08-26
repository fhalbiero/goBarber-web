import React, { useCallback, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import logoImg from '../../assets/logo.svg';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/input';
import Button from '../../components/button';

import { Container, Content, AnimationContainer, Background } from './styles';
import api from '../../services/apiClient';

interface SignInFormData {
    password: string;
    password_confirmation: string | null;
}

const ResetPassword:React.FC = () => {
    
    const formRef = useRef<FormHandles>(null)
    
    const { addToast } = useToast();
    const history = useHistory();
    const location = useLocation();

    const handleSubmit = useCallback( async (data: SignInFormData) => {
        formRef.current?.setErrors({});
        try {
            const schema = Yup.object().shape({
                password: Yup.string().required('Senha obrigatória'),
                password_confirmation: Yup.string().oneOf(
                    [Yup.ref('password'), ''], 'Confirmação incorreta')
            });

            await schema.validate(data, { abortEarly: false});

            const { password, password_confirmation } = data;
            const token = location.search.replace('?token=', '');

            if (!token) {
               throw new Error();
            }

            await api.post('/password/reset', {
                password, 
                password_confirmation,
                token,
            })
           
            history.push('/signin');
            
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErrors(error);
                formRef.current?.setErrors(errors);

                return;
            }
            
            addToast({
                type: 'error',
                title: 'Erro ao resetar senha',
                description: 'Ocorreu um erro ao resetar sua senha, tente novamente.'
            });           
        }
    }, [ addToast, history, location.search ]);

    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />

                    <Form ref={formRef} onSubmit={handleSubmit} >
                        <h1>Resetar senha</h1>
                        <Input name="password" icon={FiLock} type="password" placeholder="Senha" />
                        <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Confirmação de senha" />

                        <Button type="submit">Alterar senha</Button>
                    </Form>
                </AnimationContainer>
            </Content>
            <Background />
        </Container>
    );
}

export default ResetPassword;