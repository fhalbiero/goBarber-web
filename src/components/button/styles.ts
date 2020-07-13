import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
    background: #FF9000;
    height: 56px;
    border-radius: 10px;
    border: 0;
    padding: 0 16px;
    color: #312E38;
    width: 100%;
    font-weight: bold;
    margin-top: 16px;
    transition: background-color .2s;

    &:hover {
        background: ${shade(0.2, '#ff9000')};
    }
`;