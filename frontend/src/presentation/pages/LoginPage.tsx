import { Input, Button, Card, Typography, Alert, Space } from "antd";
import { useEffect, useState } from "react";
import { authAdapter } from "../../adapters/authAdapter";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

const { Title, Text } = Typography;

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  useEffect(() => {
    if (user) {
      navigate("/users", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const res = await authAdapter.login(data);

      login({
        token: res.token,
        user: res.user
      });

      navigate("/users", { replace: true });

    } catch (err: any) {
      setError("root", {
        type: "server",
        message: err.message || "Credenciales inválidas"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <Title level={3} style={styles.title}>
          Iniciar sesión
        </Title>

        <Text type="secondary" style={styles.subtitle}>
          Accede a tu cuenta
        </Text>

        {errors.root && (
          <Alert
            message={errors.root.message}
            type="error"
            showIcon
            role="alert"
            style={{ marginBottom: 16 }}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Space orientation="vertical" style={{ width: "100%" }} size="middle">

            {/* EMAIL */}
            <div>
              <label htmlFor="email">Email</label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "El email es obligatorio",
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
                    placeholder="admin@demo.com"
                    autoComplete="email"
                    status={errors.email ? "error" : ""}
                  />
                )}
              />
              {errors.email && (
                <Text type="danger">{errors.email.message}</Text>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label htmlFor="password">Contraseña</label>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "La contraseña es obligatoria"
                }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    id="password"
                    size="large"
                    placeholder="********"
                    autoComplete="current-password"
                    status={errors.password ? "error" : ""}
                  />
                )}
              />
              {errors.password && (
                <Text type="danger">{errors.password.message}</Text>
              )}
            </div>

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              size="large"
            >
              Ingresar
            </Button>

          </Space>
        </form>

        <Text style={styles.link}>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </Text>
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
  },
  link: {
    display: "block",
    textAlign: "center",
    marginTop: 12
  }
};