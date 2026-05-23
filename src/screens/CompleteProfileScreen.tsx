import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useAuth } from "../context/AuthContext";
import { completeProfile } from "../services/api";
import { CourtSide, DominantHand } from "../types/user";
import { toISODate, toDisplayDate } from "../utils/date";

type PickerOption<T> = { label: string; value: T };

const COURT_SIDE_OPTIONS: PickerOption<CourtSide>[] = [
  { label: "Drive", value: "DRIVE" },
  { label: "Revés", value: "REVES" },
  { label: "Ambos", value: "AMBOS" },
];

const DOMINANT_HAND_OPTIONS: PickerOption<DominantHand>[] = [
  { label: "Derecha", value: "DERECHA" },
  { label: "Izquierda", value: "IZQUIERDA" },
];

function SegmentedPicker<T extends string>({
  options,
  value,
  onSelect,
  label,
}: {
  options: PickerOption<T>[];
  value: T | null;
  onSelect: (v: T) => void;
  label: string;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.segmentRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.segmentBtn,
              value === opt.value && styles.segmentBtnActive,
            ]}
            onPress={() => onSelect(opt.value)}
          >
            <Text
              style={[
                styles.segmentText,
                value === opt.value && styles.segmentTextActive,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function CompleteProfileScreen() {
  const { user, refreshUser } = useAuth();
  const [courtSide, setCourtSide] = useState<CourtSide | null>(null);
  const [dominantHand, setDominantHand] = useState<DominantHand | null>(null);
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- Date Picker state ---
  const maxDate = new Date(); // No se puede elegir una fecha futura
  maxDate.setFullYear(maxDate.getFullYear() - 10); // Mínimo 10 años
  const defaultDate = new Date(1995, 0, 1);

  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate);
  const [showPicker, setShowPicker] = useState(false);
  const [dateConfirmed, setDateConfirmed] = useState(false);

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      // En Android el picker se cierra solo al elegir o cancelar
      setShowPicker(false);
      if (event.type === "set" && date) {
        setSelectedDate(date);
        setDateConfirmed(true);
      }
    } else {
      // En iOS el picker queda abierto; se confirma con el botón
      if (date) setSelectedDate(date);
    }
  };

  const handleSubmit = async () => {
    if (!courtSide || !dominantHand || !dateConfirmed || !phone) {
      Alert.alert("Campos requeridos", "Por favor completá todos los campos.");
      return;
    }

    setIsLoading(true);
    try {
      await completeProfile({
        court_side: courtSide,
        dominant_hand: dominantHand,
        birth_date: toISODate(selectedDate),
        phone,
      });
      await refreshUser();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Error al guardar el perfil.";
      Alert.alert(
        "Error",
        Array.isArray(message) ? message.join("\n") : message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.emoji}>🏓</Text>
        <Text style={styles.title}>Completá tu perfil</Text>
        <Text style={styles.subtitle}>
          Hola {user?.first_name}! Necesitamos algunos datos más para sumarte a
          la liga.
        </Text>
      </View>

      {/* Court Side */}
      <SegmentedPicker
        label="Posición en la cancha"
        options={COURT_SIDE_OPTIONS}
        value={courtSide}
        onSelect={setCourtSide}
      />

      {/* Dominant Hand */}
      <SegmentedPicker
        label="Mano dominante"
        options={DOMINANT_HAND_OPTIONS}
        value={dominantHand}
        onSelect={setDominantHand}
      />

      {/* Birth Date — Date Picker */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Fecha de nacimiento</Text>

        {/* Botón que abre el picker */}
        <TouchableOpacity
          style={[styles.dateButton, dateConfirmed && styles.dateButtonFilled]}
          onPress={() => setShowPicker(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.dateIcon}>📅</Text>
          <Text
            style={[
              styles.dateButtonText,
              dateConfirmed && styles.dateButtonTextFilled,
            ]}
          >
            {dateConfirmed
              ? toDisplayDate(selectedDate)
              : "Seleccioná tu fecha de nacimiento"}
          </Text>
        </TouchableOpacity>

        {/* iOS: picker inline con botón de confirmar */}
        {showPicker && Platform.OS === "ios" && (
          <View style={styles.iosPickerWrapper}>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={onDateChange}
              maximumDate={maxDate}
              minimumDate={new Date(1930, 0, 1)}
              locale="es-AR"
            />
            <TouchableOpacity
              style={styles.iosConfirmBtn}
              onPress={() => {
                setShowPicker(false);
                setDateConfirmed(true);
              }}
            >
              <Text style={styles.iosConfirmText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Android: picker modal nativo */}
        {showPicker && Platform.OS === "android" && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={maxDate}
            minimumDate={new Date(1930, 0, 1)}
          />
        )}
      </View>

      {/* Phone */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="+5491112345678"
          placeholderTextColor="#4B5563"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={20}
        />
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
        activeOpacity={0.85}
      >
        {isLoading ? (
          <ActivityIndicator color="#0F1923" />
        ) : (
          <Text style={styles.submitText}>Guardar y continuar</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1923",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    gap: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 8,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#00D9A6",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  segmentRow: {
    flexDirection: "row",
    gap: 8,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#1E2D3D",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2D3F50",
  },
  segmentBtnActive: {
    backgroundColor: "#00D9A620",
    borderColor: "#00D9A6",
  },
  segmentText: {
    color: "#6B7280",
    fontWeight: "600",
    fontSize: 14,
  },
  segmentTextActive: {
    color: "#00D9A6",
  },
  input: {
    backgroundColor: "#1E2D3D",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#2D3F50",
  },
  // --- Date Picker styles ---
  dateButton: {
    backgroundColor: "#1E2D3D",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#2D3F50",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dateButtonFilled: {
    borderColor: "#00D9A6",
    backgroundColor: "#00D9A610",
  },
  dateIcon: {
    fontSize: 18,
  },
  dateButtonText: {
    color: "#4B5563",
    fontSize: 16,
    flex: 1,
  },
  dateButtonTextFilled: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  iosPickerWrapper: {
    backgroundColor: "#1E2D3D",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2D3F50",
    overflow: "hidden",
    marginTop: 4,
  },
  iosConfirmBtn: {
    backgroundColor: "#00D9A6",
    paddingVertical: 14,
    alignItems: "center",
  },
  iosConfirmText: {
    color: "#0F1923",
    fontWeight: "800",
    fontSize: 15,
  },
  // --- Submit ---
  submitBtn: {
    backgroundColor: "#00D9A6",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#00D9A6",
    shadowOpacity: 0.35,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: "#0F1923",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
