import React, { useEffect, useState } from "react";
import * as yup from "yup";

import { useAppSelector, useAppDispatch } from "../../store/hooks";

import TextField from "../common/form/TextField";
import SelectField from "../common/form/SelectField";
import RadioField from "../common/form/RadioField";
import MultiSelectField from "../common/form/MultiSelectField";
import CheckBoxField from "../common/form/CheckBoxField";
import { getQualities } from "../../store/qualitiesSlice/selectors";
import { getProfessions } from "../../store/professionsSlice/selectors";
import { signUp } from "../../store/usersSlice/actions";

type dataState = {
  email: string;
  name: string;
  password: string;
  profession: string;
  sex: string;
  qualities: [];
  licence: false;
};

type QualitiesObj = {
  label: string;
  value: string;
  color: string;
};

const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch();

  const validateScheme = yup.object().shape({
    licence: yup
      .bool()
      .oneOf(
        [true],
        "Вы не сможете продолжить, если не подтвердите лицензионное соглашение"
      ),

    qualities: yup.array().min(1, "Хотя бы одно качество должно быть выбрано"),

    sex: yup.string().required("Пол обязательно должен быть выбран"),

    profession: yup
      .string()
      .required("Профессия обязательно должна быть выбрана"),

    password: yup
      .string()
      .required("Пароль обязателен для заполнения")
      .matches(
        /[A-Z]+/g,
        "Пароль должен содержать хотя бы одну заглавную букву"
      )
      .matches(/\d+/g, "Пароль должен содержать хотя бы одну цифру")
      .matches(
        /(?=.*[!@#$%^&*])/,
        "Пароль должен содержать один из специальных символов (!@#$%^&*)"
      )
      .matches(/(?=.{8,})/, "Пароль должен содержать хотя бы 8 симолов"),

    name: yup
      .string()
      .required("Имя обязательно для заполнения")
      .min(3, "Имя должно состоять минимум из 3 символов"),

    email: yup
      .string()
      .required("Электронная почта почта обязательна для заполнения")
      .email("Email введен некорректно"),
  });

  const [data, setData] = useState<dataState>({
    email: "",
    name: "",
    password: "",
    profession: "",
    sex: "",
    qualities: [],
    licence: false,
  });

  const [error, setError] = useState<{
    email?: string;
    name?: string;
    password?: string;
    profession?: string;
    sex?: string;
    qualities?: string;
    licence?: string;
  }>({});

  const professions = useAppSelector(getProfessions());
  const qualities = useAppSelector(getQualities());

  if (!qualities || !professions) return <>Loading...</>;

  useEffect(() => {
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const qualitiesList = qualities.map((quality) => ({
    label: quality.name,
    value: quality._id,
    color: quality.color,
  }));

  const professionsList = professions.map((profession) => ({
    label: profession.name,
    value: profession._id,
  }));

  const validate = () => {
    validateScheme
      .validate(data)
      .then(() => setError({}))
      .catch((err) => setError({ [err.path]: err.message }));
    return Object.keys(error).length === 0;
  };

  const isValid = Object.keys(error).length === 0;

  const handleChange = (target: any) => {
    setData((prevState) => ({ ...prevState, [target.name]: target.value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return null;
    const { qualities } = data;

    const newData = {
      ...data,
      qualities: qualities.map((qu: QualitiesObj) => qu.value),
    };
    dispatch(signUp(newData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        type="text"
        label="Электронная почта"
        name="email"
        value={data.email}
        error={error.email ? error.email : null}
        onChange={handleChange}
      />
      <TextField
        type="text"
        label="Имя"
        name="name"
        value={data.name}
        error={error.name ? error.name : null}
        onChange={handleChange}
      />
      <TextField
        type="password"
        label="Пароль"
        name="password"
        value={data.password}
        error={error.password ? error.password : null}
        onChange={handleChange}
      />
      <SelectField
        label="Выберите вашу профессию"
        name="profession"
        value={data.profession}
        options={professionsList}
        onChange={handleChange}
        defaultOption="Choose..."
        error={error.profession ? error.profession : null}
      />
      <RadioField
        options={[
          { name: "Male", value: "male" },
          { name: "Female", value: "female" },
          { name: "Other", value: "other" },
        ]}
        label="Выберите ваш пол"
        value={data.sex}
        name="sex"
        error={error.sex ? error.sex : null}
        onChange={handleChange}
      />
      <MultiSelectField
        label="Выберите ваши качества"
        defaultValue={data.qualities}
        options={qualitiesList}
        name="qualities"
        onChange={handleChange}
        error={error.qualities ? error.qualities : null}
      />
      <CheckBoxField
        name="licence"
        value={data.licence}
        onChange={handleChange}
        error={error.licence ? error.licence : null}
      >
        <>
          Подтвердить <a>лицензионное соглашение</a>
        </>
      </CheckBoxField>
      <button
        type="submit"
        disabled={!isValid}
        className="btn btn-primary w-100 mx-auto"
      >
        Отправить
      </button>
    </form>
  );
};

export default RegisterForm;
