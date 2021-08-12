import React, { ButtonHTMLAttributes } from "react";

import { Container } from "./styles";

// import {Input} from "./styles";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
  <Container type="button" {...rest}>
    {loading ? "loading..." : children}
  </Container>
);

export default Button;
