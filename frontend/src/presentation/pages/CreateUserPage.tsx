import {
  Card,
  Typography,
  Input,
  Button,
  Alert,
  Select,
  Space
} from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { userAdapter } from "../../adapters/userAdapter";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";

const { Title, Text } = Typography;

interface FormData {
  email: string;
  name: string;
  password: string;
  role: string;
}

export default function CreateUserPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      role: "user"
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError("");

      await userAdapter.createUser(data, token!);

      navigate("/users");
    } catch (err: any) {
      let message = "Error al crear usuario";

      if (err?.message && err.message !== "null") {
        message = err.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Card
        style={styles.card}
        styles={{ body: { padding: 24 } }} 
      >
        <Title level={3} style={styles.title}>
          Crear Usuario
        </Title>

        <Text type="secondary" style={styles.subtitle}>
          Completa la información del usuario
        </Text>

        {/* ERROR GLOBAL */}
        {error && (
          <Alert
            title={error}
            type="error"
            showIcon
            role="alert"
            style={{ marginBottom: 16 }}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Space orientation="vertical" style={{ width: "100%" }} size="middle">

            {/* EMAIL */}
            <div>
              <label htmlFor="email">Email</label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email requerido",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email inválido"
                  }
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    size="large"
                    placeholder="usuario@email.com"
                    status={errors.email ? "error" : ""}
                    aria-invalid={!!errors.email}
                  />
                )}
              />
              {errors.email && (
                <Text type="danger" role="alert">
                  {errors.email.message}
                </Text>
              )}
            </div>

            {/* NAME */}
            <div>
              <label htmlFor="name">Nombre</label>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "Nombre requerido",
                  minLength: {
                    value: 3,
                    message: "Mínimo 3 caracteres"
                  }
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    size="large"
                    placeholder="Nombre completo"
                    status={errors.name ? "error" : ""}
                    aria-invalid={!!errors.name}
                  />
                )}
              />
              {errors.name && (
                <Text type="danger" role="alert">
                  {errors.name.message}
                </Text>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label htmlFor="password">Password</label>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password requerido",
                  validate: (value) => {
                    if (!value) return "Password requerido";
                    if (value.length < 8) return "Mínimo 8 caracteres";
                    if (!/[A-Z]/.test(value)) return "Debe tener mayúscula";
                    if (!/[a-z]/.test(value)) return "Debe tener minúscula";
                    if (!/[0-9]/.test(value)) return "Debe tener número";
                    if (!/[^A-Za-z0-9]/.test(value))
                      return "Debe tener carácter especial";
                    return true;
                  }
                }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    id="password"
                    size="large"
                    placeholder="********"
                    status={errors.password ? "error" : ""}
                    aria-invalid={!!errors.password}
                  />
                )}
              />
              {errors.password && (
                <Text type="danger" role="alert">
                  {errors.password.message}
                </Text>
              )}
            </div>

            {/* ROLE */}
            <div>
              <label htmlFor="role">Rol</label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    id="role"
                    size="large"
                    style={{ width: "100%" }}
                    aria-label="Seleccionar rol"
                    options={[
                      { value: "admin", label: "Admin" },
                      { value: "user", label: "User" }
                    ]}
                  />
                )}
              />
            </div>

            {/* BOTONES */}
            <Space orientation="vertical" style={{ width: "100%" }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
              >
                Crear Usuario
              </Button>

              <Button
                block
                size="large"
                onClick={() => navigate("/users")}
              >
                Cancelar
              </Button>
            </Space>

          </Space>
        </form>
      </Card>
    </div>
  );
}

const styles: any = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    background: "#f0f2f5"
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 12
  },
  title: {
    textAlign: "center",
    marginBottom: 8
  },
  subtitle: {
    display: "block",
    textAlign: "center",
    marginBottom: 16
  }
};