import React, { useRef, useCallback, useState } from "react";
import { FiLogIn, FiMail } from "react-icons/fi";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";
import { Link } from "react-router-dom";

import { useToast } from "../../hooks/toast";
import getValidationErrors from "../../utils/getValidationErrors";

import logoImg from "../../assets/logo.svg";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { Container, Content, Background, AnimationContainer } from "./styles";
import api from "../../services/api";

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required("E-mail is required")
            .email("Inform a valid e-mail"),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        // history.push("/dashboard");

        await api.post("/password/forgot", {
          email: data.email,
        });

        addToast({
          type: "success",
          title: "E-mail de recuperacao de senha",
          description:
            " Enviamos um email para confirmar a recuperacao de senha. Checkout fella",
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }
        addToast({
          type: "error",
          title: "Erro na recuperacao de senha",
          description:
            "Ocorreu um erro ao fazer a recuperacao de senha, cheque as credenciais",
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast]
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Button loading={loading} type="submit">
              Recuperar
            </Button>
          </Form>

          <Link to="/">
            <FiLogIn />
            Back to sign in
          </Link>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};

export default ForgotPassword;
