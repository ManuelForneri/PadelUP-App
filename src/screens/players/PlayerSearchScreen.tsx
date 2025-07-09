import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import { useTheme } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import playerService from "../../services/api/player.service";
import { Player, PlayerFilters } from "../../../types";

type Props = NativeStackScreenProps<RootStackParamList, "PlayerSearch">;

const PlayerSearchScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { user: currentUser } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filters, setFilters] = useState<PlayerFilters>({});
  const [searchText, setSearchText] = useState<string>("");

  // Cargar jugadores cuando cambian los filtros o al montar el componente
  useEffect(() => {
    console.log("Filtros actualizados:", filters);
    loadPlayers();
  }, [filters]);

  // Función para obtener el ID del usuario actual
  const getCurrentUserId = () => {
    if (!currentUser) return null;
    // El contexto de autenticación usa 'id' en lugar de '_id'
    return (currentUser as any).id || (currentUser as any)._id;
  };

  // Función para cargar jugadores con los filtros actuales
  const loadPlayers = async () => {
    try {
      setLoading(true);
      const response = await playerService.getPlayers(filters);
      const currentUserId = getCurrentUserId();

      // Filtrar para excluir al usuario actual
      const filteredPlayers = (response.data || []).filter(
        (player: Player) =>
          player._id !== currentUserId &&
          (!player.id || player.id !== currentUserId)
      );

      setPlayers(filteredPlayers);
    } catch (error) {
      console.error("Error al cargar jugadores:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Función para manejar el refrescado
  const handleRefresh = () => {
    setRefreshing(true);
    loadPlayers();
  };

  // Función para buscar jugadores
  const handleSearch = () => {
    console.log("Buscando jugadores con texto:", searchText);
    setFilters((prev) => ({
      ...prev,
      search: searchText.trim() || undefined,
    }));
  };

  // Renderizar cada elemento de la lista
  const renderPlayerItem = ({ item }: { item: Player }) => (
    <TouchableOpacity
      style={[styles.playerCard, { backgroundColor: colors.card }]}
      onPress={() =>
        navigation.navigate("PlayerDetails", { playerId: item._id })
      }
    >
      <View style={styles.playerInfo}>
        {item.profileImage ? (
          <Image source={{ uri: item.profileImage }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {item.firstName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.playerDetails}>
          <Text style={[styles.playerName, { color: colors.text }]}>
            {item.firstName}
          </Text>
          <View style={styles.playerMeta}>
            <Text style={[styles.playerMetaText, { color: colors.text }]}>
              {item.category} • {item.level}
            </Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color={colors.text} />
    </TouchableOpacity>
  );

  // Renderizar el componente de carga
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <TextInput
          style={[
            styles.searchInput,
            { color: colors.text, backgroundColor: colors.background },
          ]}
          placeholder="Buscar jugadores..."
          placeholderTextColor={colors.text + "80"}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: colors.primary }]}
          onPress={handleSearch}
        >
          <Ionicons name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        {/* Aquí podrías agregar botones para filtrar por categoría, nivel, etc. */}
      </View>

      {/* Lista de jugadores */}
      <FlatList
        data={players}
        renderItem={renderPlayerItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people" size={60} color={colors.text + "80"} />
            <Text style={[styles.emptyText, { color: colors.text + "80" }]}>
              No se encontraron jugadores
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  filtersContainer: {
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  playerMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  playerMetaText: {
    fontSize: 14,
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
});

export default PlayerSearchScreen;
