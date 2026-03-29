import { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Typography,
  Tag,
  Spin,
  Alert,
  Popconfirm,
  message,
  Grid
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { userAdapter } from "../../adapters/userAdapter";
import { useAuth } from "../../context/AuthContext";

const { Title } = Typography;
const { useBreakpoint } = Grid;

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
}

export default function UsersPage() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const data = await userAdapter.getUsers(search, token);
      setUsers(data || []);
    } catch (err: any) {
      setError(err.message || "Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (user?.id === id) {
      return message.warning("No puedes eliminarte a ti mismo");
    }

    try {
      await userAdapter.deleteUser(id, token!);
      message.success("Usuario eliminado");
      fetchUsers();
    } catch (err: any) {
      message.error(err.message || "Error al eliminar");
    }
  };


  const columns: ColumnsType<User> = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={role === "admin" ? "blue" : "default"}>
          {role}
        </Tag>
      )
    },
    {
      title: "Estado",
      dataIndex: "isActive",
      key: "isActive",
      render: (active: boolean) =>
        active ? <Tag color="green">Activo</Tag> : <Tag color="red">Inactivo</Tag>
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: User) => (
        <Space wrap>
          {(user?.role === "admin" || user?.id === record.id) && (
            <Button
              type="link"
              onClick={() => navigate(`/profile?id=${record.id}`)}
              aria-label="Ver usuario"
            >
              Ver
            </Button>
          )}

          {(user?.role === "admin" || user?.id === record.id) && (
            <Button
              type="link"
              onClick={() => navigate(`/users/${record.id}/edit`)}
              aria-label="Editar usuario"
            >
              Editar
            </Button>
          )}

          {user?.role === "admin" && user?.id !== record.id && (
            <Popconfirm
              title="¿Eliminar usuario?"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button danger type="link" aria-label="Eliminar usuario">
                Eliminar
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <Space
        orientation={screens.xs ? "vertical" : "horizontal"}
        style={styles.header}
        size="middle"
      >
        <Title level={3} style={{ margin: 0 }}>
          Gestión de Usuarios
        </Title>

        <Space wrap>
          <Button onClick={() => navigate("/profile")}>
            Mi perfil
          </Button>

          {user?.role === "admin" && (
            <Button type="primary" onClick={() => navigate("/users/new")}>
              Crear Usuario
            </Button>
          )}

          <Button
            danger
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Cerrar sesión
          </Button>
        </Space>
      </Space>

      {/* BUSCADOR */}
      <Space
        orientation={screens.xs ? "vertical" : "horizontal"}
        style={styles.search}
      >
        <Input
          placeholder="Buscar por email o nombre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onPressEnter={fetchUsers}
          size="large"
          aria-label="Buscar usuarios"
        />

        <Button type="primary" onClick={fetchUsers} size="large">
          Buscar
        </Button>
      </Space>

      {/* ERROR */}
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          role="alert"
          style={{ marginBottom: 16 }}
        />
      )}

      {/* TABLA */}
      {loading ? (
        <div style={styles.loading}>
          <Spin size="large" />
        </div>
      ) : (
        <Table<User>
          dataSource={users}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
          locale={{ emptyText: "No hay usuarios disponibles" }}
        />
      )}
    </div>
  );
}

const styles: any = {
  container: {
    padding: 16,
    maxWidth: 1200,
    margin: "0 auto"
  },
  header: {
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 20
  },
  search: {
    width: "100%",
    marginBottom: 20
  },
  loading: {
    textAlign: "center",
    marginTop: 60
  }
};