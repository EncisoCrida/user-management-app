import { Card, Typography, Input, Button, Alert, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { authAdapter } from "../../adapters/authAdapter";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

const { Title, Text } = Typography;

interface FormData {
  email: string;
  name: string;
  password: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      name: "",
      password: ""
    }
  });

  // COUNTDOWN
  useEffect(() => {
    if (!success) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [success, navigate]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await authAdapter.register(data);
      setSuccess(true);
    } catch (err: any) {
      if (err.details && err.details.length > 0) {
        err.details.forEach((e: any) => {
          const field = e.field.toLowerCase();

          setError(field as keyof FormData, {
            type: "server",
            message: e.errors[0]
          });
        });
      } else {
        setError("root" as any, {
          type: "server",
          message: err.message || "Error al registrarse"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card} bodyStyle={{ padding: 24 }}>
        <Title level={3} style={styles.title}>
          Crear cuenta
        </Title>

        <Text type="secondary" style={styles.subtitle}>
          Regístrate para continuar
        </Text>

        {/* SUCCESS */}
        {success && (
          <Alert
            message="Registro exitoso 🎉"
            description={`Redirigiendo al login en ${countdown} segundos...`}
            type="success"
            showIcon
            role="alert"
            style={{ marginBottom: 16 }}
          />
        )}

        {/* ERROR GLOBAL */}
        {errors.root && !success && (
          <Alert
            message={errors.root.message}
            type="error"
            showIcon
            role="alert"
            style={{ marginBottom: 16 }}
          />
        )}

        {!success && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Space direction="vertical" style={{ width: "100%" }} size="middle">

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
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      status={errors.email ? "error" : ""}
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
                      autoComplete="name"
                      aria-invalid={!!errors.name}
                      status={errors.name ? "error" : ""}
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
                <label htmlFor="password">Contraseña</label>
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
                      autoComplete="new-password"
                      aria-invalid={!!errors.password}
                      status={errors.password ? "error" : ""}
                    />
                  )}
                />
                {errors.password && (
                  <Text type="danger" role="alert">
                    {errors.password.message}
                  </Text>
                )}
              </div>

              {/* BOTONES */}
              <div>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  size="large"
                >
                  Registrarse
                </Button>

                <Button
                  block
                  size="large"
                  style={{ marginTop: 10 }}
                  onClick={() => navigate("/login")}
                >
                  Ir al login
                </Button>
              </div>

            </Space>
          </form>
        )}
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
    maxWidth: 420,
    borderRadius: 12
  },
  title: {
    textAlign: "center",
    marginBottom: 4
  },
  subtitle: {
    display: "block",
    textAlign: "center",
    marginBottom: 24
  }
};