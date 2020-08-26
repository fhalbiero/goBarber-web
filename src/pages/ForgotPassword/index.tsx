import React, { useCallback, useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn, FiMail } from 'react-icons/fi';
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
    email: string;
}

const ForgotPassword:React.FC = () => {
    
    const formRef = useRef<FormHandles>(null);
    const [ loading, setLoading ] = useState(false);
    
    const { addToast } = useToast();
   // const history = useHistory();

    const handleSubmit = useCallback( async (data: SignInFormData) => {
        setLoading(true);

        formRef.current?.setErrors({});
        try {
            const schema = Yup.object().shape({
                email: Yup.string()
                    .required('E-mail obrigatório')
                    .email('Digite um e-mail válido'),
            });

            await schema.validate(data, { abortEarly: false});

            await api.post('/password/forgot', {
                email: data.email
            });

            addToast({
                type: 'success',
                title: 'E-mail de recuperação enviado',
                description: 'Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de mensagem.'
            });  
            
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErrors(error);
                formRef.current?.setErrors(errors);

                return;
            }
            
            addToast({
                type: 'error',
                title: 'Erro na recuperação da senha',
                description: 'Ocorreu um erro ao tentar fazer a recuperação de senha.'
            });           
        } finally {
            setLoading(false);
        }
    }, [ addToast ]);

    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />

                    <Form ref={formRef} onSubmit={handleSubmit} >
                        <h1>Recuperar Senha</h1>
                        <Input name="email" icon={FiMail} placeholder="E-mail" />

                        <Button loading={loading} type="submit">Recuperar</Button>
                    </Form>

                    <Link to="/signup">
                        <FiLogIn />
                        Voltar ao Login
                    </Link>
                </AnimationContainer>
            </Content>
            <Background />
        </Container>
    );
}

export default ForgotPassword;