import {
  Card,
  Typography,
  Input,
  Alert,
  Spin,
  Space,
  Tag,
  Button
} from "antd";
import { useAuth } from "../../context/AuthContext";
import { userAdapter } from "../../adapters/userAdapter";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
}

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const queryId = params.get("id");
  const userIdToFetch = queryId || user?.id;

  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res = await userAdapter.getUserById(
          userIdToFetch!,
          token!
        );

        setData(res);
      } catch (err: any) {
        setError(err.message || "Error cargando perfil");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [queryId]);

  if (loading) {
    return (
      <div style={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Card
        style={styles.card}
        styles={{ body: { padding: 24 } }} 
      >
        {/* HEADER */}
        <Space
          orientation="horizontal"
          style={styles.header}
          wrap
        >
          <Title level={3} style={{ margin: 0 }}>
            {queryId ? "Perfil de Usuario" : "Mi Perfil"}
          </Title>

          <Button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/users");
              }
            }}
          >
            ← Volver
          </Button>
        </Space>

        {/* ERROR */}
        {error && (
          <Alert
            title={error}
            type="error"
            showIcon
            role="alert"
            style={{ marginTop: 16 }}
          />
        )}

        {/* CONTENIDO */}
        <Space orientation="vertical" style={{ width: "100%", marginTop: 20 }} size="middle">

          {/* EMAIL */}
          <div>
            <label htmlFor="email">
              <Text strong>Email</Text>
            </label>
            <Input
              id="email"
              value={data?.email}
              size="large"
              disabled
              aria-label="Email del usuario"
            />
          </div>

          {/* NOMBRE */}
          <div>
            <label htmlFor="name">
              <Text strong>Nombre</Text>
            </label>
            <Input
              id="name"
              value={data?.name}
              size="large"
              disabled
              aria-label="Nombre del usuario"
            />
          </div>

          {/* ROL */}
          <div>
            <Text strong>Rol</Text>
            <div style={{ marginTop: 4 }}>
              <Tag color={data?.role === "admin" ? "blue" : "default"}>
                {data?.role}
              </Tag>
            </div>
          </div>

          {/* ESTADO */}
          <div>
            <Text strong>Estado</Text>
            <div style={{ marginTop: 4 }}>
              {data?.isActive ? (
                <Tag color="green">Activo</Tag>
              ) : (
                <Tag color="red">Inactivo</Tag>
              )}
            </div>
          </div>

        </Space>
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
  header: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center"
  },
  loading: {
    textAlign: "center",
    marginTop: 100
  }
};