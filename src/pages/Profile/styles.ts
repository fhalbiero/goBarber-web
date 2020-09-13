import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';


export const Container = styled.div`
    height: 100vh;

    > header {
        display: flex;
        align-items: center;
        height: 144px;
        background: #28262e;

        div {
            width: 100%;
            max-width: 1120px;
            margin: 0 auto;
            
            svg {
                color: #999591;
                width: 24px;
                height: 24px;
            }
        }
    }
`;


export const AvatarImput = styled.div`
    position: relative;
    margin-bottom: 32px;
    align-self: center;
    margin: -176px auto 0;

   img {
       width: 186px;
       height: 186px;
       border-radius: 50%;
   } 

   label {
       position: absolute;
       display: flex;
       align-items: center;
       justify-content: center;
       cursor: pointer;

       width: 48px;
       height: 48px;
       background: #ff9000;
       border-radius: 50%;
       right: 0;
       bottom: 0;
       border: 0;
       transition: background-color 0.2s;

       input {
           display: none;
       }

       svg {
         width: 20px;
         height: 20px;
         color: #333;

         &:hover {
             background-color: ${shade(0.2, '#ff9000')}
         } 
       }

   }
`;


export const Content = styled.div`
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    place-content: center;
    width:100%;
    margin: 0 auto;

    form {
        display: flex;
        flex-direction: column;
        margin: 80px 0;
        width:340px;
        text-align: center;

        h1 {
            margin-bottom: 20px;
            text-align: left;
        }


        a {
            color: #F4EDE8;
            display: block;
            margin-top: 24px;
            text-decoration: none;
            transition: color .2s;

            &:hover {
                color: ${shade(0.2, '#F4EDE8')}
            }
        }
    }

`;

export const appearFromLeft = keyframes`
    from {
        opacity: 0;
        transform: translateX(-50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
`;

