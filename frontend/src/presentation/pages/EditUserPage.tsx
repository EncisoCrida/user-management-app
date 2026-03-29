import {
  Card,
  Typography,
  Input,
  Button,
  Alert,
  Select,
  Spin,
  Space,
  Divider
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { userAdapter } from "../../adapters/userAdapter";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

const { Title, Text } = Typography;

interface FormData {
  email: string;
  name: string;
  role?: string;
  isActive?: boolean;
  password?: string;
}

export default function EditUserPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [fetchLoading, setFetchLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";
  const isSelf = user?.id === id;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormData>();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await userAdapter.getUserById(id!, token!);

        setValue("email", data.email);
        setValue("name", data.name);
        setValue("role", data.role);
        setValue("isActive", data.isActive);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setFetchLoading(false);
      }
    };

    load();
  }, [id]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const payload: any = {
        name: data.name
      };

      if (isAdmin) {
        payload.role = data.role;
        payload.isActive = data.isActive;
      }

      if (data.password) {
        payload.password = data.password;
      }

      await userAdapter.updateUser(id!, payload, token!);
      navigate("/users");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div style={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Card style={styles.card} styles={{ body: { padding: 24 } }}>
        <Title level={3} style={styles.title}>
          Editar Usuario
        </Title>

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
                render={({ field }) => (
                  <Input {...field} id="email" size="large" disabled />
                )}
              />
            </div>

            {/* NAME */}
            <div>
              <label htmlFor="name">Nombre</label>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "El nombre es obligatorio",
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
              <label htmlFor="password">Nueva contraseña</label>

              <Controller
                name="password"
                control={control}
                rules={{
                  validate: (value) => {
                    if (!value) return true;
                    if (value.length < 8) return "Mínimo 8 caracteres";
                    if (!/[A-Z]/.test(value)) return "Debe tener una mayúscula";
                    if (!/[a-z]/.test(value)) return "Debe tener una minúscula";
                    if (!/[0-9]/.test(value)) return "Debe tener un número";
                    if (!/[^A-Za-z0-9]/.test(value))
                      return "Debe tener un carácter especial";
                    return true;
                  }
                }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    id="password"
                    size="large"
                    placeholder="Opcional"
                    status={errors.password ? "error" : ""}
                    aria-invalid={!!errors.password}
                  />
                )}
              />

              {errors.password ? (
                <Text type="danger" role="alert">
                  {errors.password.message}
                </Text>
              ) : (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Déjalo vacío si no deseas cambiarla
                </Text>
              )}
            </div>

            {/* ADMIN */}
            {isAdmin && !isSelf && (
              <>
                <Divider />

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
                          { value: "admin", label: "Administrador" },
                          { value: "user", label: "Usuario" }
                        ]}
                      />
                    )}
                  />
                </div>

                <div>
                  <label htmlFor="status">Estado</label>
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        id="status"
                        size="large"
                        style={{ width: "100%" }}
                        aria-label="Seleccionar estado"
                        options={[
                          { value: true, label: "Activo" },
                          { value: false, label: "Inactivo" }
                        ]}
                      />
                    )}
                  />
                </div>
              </>
            )}

            {/* BOTONES */}
            <Space orientation="vertical" style={{ width: "100%" }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                block
              >
                Guardar cambios
              </Button>

              <Button
                size="large"
                block
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
    padding: 16
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 12
  },
  title: {
    textAlign: "center",
    marginBottom: 16
  },
  loading: {
    textAlign: "center",
    marginTop: 100
  }
};