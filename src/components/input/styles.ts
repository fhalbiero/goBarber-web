import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

interface ContainerProps {
    isFocused: boolean;
    isFilled: boolean;
    isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
    background: #232129;
    border-radius: 10px;
    padding: 16px;
    width:100%;
    border: 2px solid #232129;
    color: #666360;

    ${props =>  props.isErrored && css`
        border-color: #C53030;
    `}

    ${props =>  props.isFocused && css`
        border-color: #FF9000;
        color: #FF9000;
    `}

    ${props =>  props.isFilled && css`
        color: #FF9000;
    `}
    
    display:flex;
    align-items: center;

    & + div {
        margin-top: 8px;
    }

    svg {
        margin-right: 16px;
    }

    
    input {  
        flex: 1;
        background: transparent;
        color: #F4EDE8;
        border:0;

        &::placeholder {
            color: #666360;
        } 
    }
`;


export const Error = styled(Tooltip)`
    width: 20px;
    margin-left: 16px;
    
    svg {
        margin: 0;
    }

    span {
        background: #C53030;
        color: #fff;

        ::before {
           border-color: #C53030 transparent;  
        }
    }
`;