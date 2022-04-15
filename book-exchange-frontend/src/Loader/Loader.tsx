import React from "react";
import styled, { keyframes } from "styled-components";

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

interface ISpinnerProps {
  height?: string,
  width?: string
}

const Spinner = styled.div<ISpinnerProps>`
  animation: ${rotate360} 2s linear infinite;  
  border-top: 10px solid lightgray;
  border-right: 10px solid lightgray;
  border-bottom: 10px solid lightgray;
  border-left: 10px solid var(--dark-blue);
  background: transparent;
  width: ${props => props.width ? props.width: '100px'};
  height: ${props => props.height ? props.height : '100px'};
  border-radius: 50%;
`;

const Loader: React.FC = () => {
    return (
      <Spinner />           
    )
}

export default Loader