import React, { ChangeEvent, useCallback, useRef } from "react";
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";

import api from "../../services/api";

import { useToast } from "../../hooks/toast";

import getValidationErrors from "../../utils/getValidationErrors";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { Container, Content, AvatarInput } from "./styles";
import { useAuth } from "../../hooks/auth";

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required("Name is required"),
          email: Yup.string()
            .required("E-mail is required")
            .email("Inform a valid e-mail"),
          old_password: Yup.string(),
          password: Yup.string().when("old_password", {
            is: (val) => !!val.length,
            then: Yup.string().required(),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when("old_password", {
              is: (val) => !!val.length,
              then: Yup.string().required(),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref("password"), undefined], "Passwords must match"),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put("/profile", formData);

        updateUser(response.data);

        history.push("/dashboard");
        addToast({
          type: "success",
          title: "Updated sucess!",
          description: "Your information has been updated!",
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }
        addToast({
          type: "error",
          title: "Updating error",
          description: "Updating error, please try again.",
        });
      }
    },
    [history, addToast, updateUser]
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();

        data.append("avatar", e.target.files[0]);

        api.patch("/users/avatar", data).then((response) => {
          updateUser(response.data);
          addToast({
            type: "success",
            title: "Updated avatar!",
          });
        });
      }
    },
    [addToast, updateUser]
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/Dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              <input type="file" id="avatar" onChange={handleAvatarChange} />
              <FiCamera />
            </label>
          </AvatarInput>

          <h1>Profile</h1>

          <Input name="name" icon={FiUser} placeholder="Name" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Actual password"
          />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="New password"
          />
          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirm password"
          />

          <Button type="submit">Confirm</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
