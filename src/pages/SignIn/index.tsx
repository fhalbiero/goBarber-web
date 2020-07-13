import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import logoImg from '../../assets/logo.svg';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/input';
import Button from '../../components/button';

import { Container, Content, Background } from './styles';

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn:React.FC = () => {
    
    const formRef = useRef<FormHandles>(null)
    
    const { signIn } = useAuth();
    const { addToast } = useToast();

    const handleSubmit = useCallback( async (data: SignInFormData) => {
        formRef.current?.setErrors({});
        try {
            const schema = Yup.object().shape({
                email: Yup.string()
                    .required('E-mail obrigatório')
                    .email('Digite um e-mail válido'),
                password: Yup.string()
                    .required('Senha obrigatória')
            });

            await schema.validate(data, { abortEarly: false});
            await signIn({
                email: data.email,
                password: data.password
            });
            
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErrors(error);
                formRef.current?.setErrors(errors);
            }
            
            addToast({
                type: 'error',
                title: 'Erro na autenticação',
                description: 'Ocorreu um erro ao fazer login, cheque as credenciais.'
            });           
        }
    }, [ signIn, addToast ]);

    return (
        <Container>
            <Content>
                <img src={logoImg} alt="GoBarber" />

                <Form ref={formRef} onSubmit={handleSubmit} >
                    <h1>Faça seu logon</h1>
                    <Input name="email" icon={FiMail} placeholder="E-mail" />
                    <Input name="password" icon={FiLock} type="password" placeholder="Senha" />

                    <Button type="submit">Entrar</Button>
                    <a href="/forgot">Esqueci minha senha</a>
                </Form>

                <a href="log">
                    <FiLogIn />
                    Criar conta
                </a>
            </Content>
            <Background />
        </Container>
    );
}

export default SignIn;