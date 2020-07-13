import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/input';
import Button from '../../components/button';

import { Container, Content, Background } from './styles';

const SignUp:React.FC = () => {

    const formRef = useRef<FormHandles>(null);

    const handleSubmit = useCallback( async (data: object) => {
        formRef.current?.setErrors({});
        try {
            const schema = Yup.object().shape({
                name: Yup.string()
                    .min(4, 'No mínimo 4 digitos'),
                email: Yup.string()
                    .required('E-mail obrigatório')
                    .email('Digite um e-mail válido'),
                password: Yup.string()
                    .min(6, 'No mínimo 6 digitos')
            });

            await schema.validate(data, { abortEarly: false});

            
        } catch (error) {
            const errors = getValidationErrors(error);
            formRef.current?.setErrors(errors);
        }
    }, []);

    return (
        <Container>
            <Background />
            <Content>
                <img src={logoImg} alt="GoBarber" />

                <Form ref={formRef} onSubmit={handleSubmit}>
                    <h1>Faça seu cadastro</h1>
                    <Input name="name" icon={FiUser} placeholder="Nome" />
                    <Input name="email" icon={FiMail} placeholder="E-mail" />
                    <Input name="password" icon={FiLock} type="password" placeholder="Senha" />

                    <Button type="submit">Cadastrar</Button>
                </Form>

                <a href="log">
                    <FiArrowLeft />
                    Voltar para logon
                </a>
            </Content>
        </Container>
    )
};

export default SignUp;