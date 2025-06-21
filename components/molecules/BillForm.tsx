import React from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tw } from "../../tailwind";
import { Ionicons } from "@expo/vector-icons";

import { DefaultComponentProps } from "../../types";
import { billSchema, BillFormValues } from "../../utils/validation";
import { Bill } from "../../types/bill";
import { useTheme } from "../../utils/themeContext";
import { z } from "zod";

type Props = DefaultComponentProps & {
  initialValues?: Partial<Bill>;
  onSubmit: (data: BillFormValues) => void;
  onCancel: () => void;
};

export function BillForm(props: Props) {
  const { initialValues, onSubmit, onCancel, style } = props;
  const { isDarkMode } = useTheme();

  // Default values for new bill
  const defaultValues: BillFormValues = {
    name: "",
    description: "",
    amount: 0,
    dueDay: 1,
    reminderDays: 3,
    category: "",
    color: "#0f766e", // Default teal color
  };

  // Set up form with validation
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BillFormValues>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    },
  });

  // Available colors for selection
  const colorOptions = [
    "#0f766e", // teal
    "#be123c", // rose
    "#0369a1", // sky
    "#4338ca", // indigo
    "#65a30d", // lime
    "#9333ea", // purple
    "#ea580c", // orange
    "#0f172a", // slate
  ];

  // Form submission handler
  const onFormSubmit = (data: BillFormValues) => {
    console.log("Form submitted with data:", data);
    onSubmit(data);
  };

  // Log form errors on submit failure
  const onError = (errors: any) => {
    console.error("Form validation errors:", errors);
  };

  const FormField = ({
    label,
    required,
    error,
    children,
  }: {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
  }) => (
    <View style={tw`mb-5`}>
      <Text
        style={tw`mb-2 text-base font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
      >
        {label}
        {required && <Text style={tw`text-red-500`}> *</Text>}
      </Text>
      {children}
      {error && <Text style={tw`mt-1 text-sm text-red-500`}>{error}</Text>}
    </View>
  );

  return (
    <ScrollView style={[tw`flex-1`, style]} contentContainerStyle={tw`p-4`}>
      <View style={tw`mb-6`}>
        <Text style={tw`text-2xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
          {initialValues?.id ? "Edit Bill" : "Add New Bill"}
        </Text>
        <Text style={tw`mt-1 text-base ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          Fill in the details below to {initialValues?.id ? "update your" : "create a new"} bill.
        </Text>
      </View>

      <View
        style={[
          tw`rounded-2xl p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`,
          {
            shadowColor: isDarkMode ? "#000" : "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDarkMode ? 0.3 : 0.05,
            shadowRadius: 4,
          },
        ]}
      >
        <FormField label="Bill Name" required error={errors.name?.message}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  tw`rounded-lg border p-4 ${isDarkMode ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-white"}`,
                  errors.name ? tw`border-red-300` : "",
                  tw`${isDarkMode ? "text-gray-100" : "text-gray-900"}`,
                ]}
                placeholder="Enter bill name"
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#6b7280"}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </FormField>

        <FormField label="Description">
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  tw`rounded-lg border p-4 ${isDarkMode ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-white"}`,
                  tw`${isDarkMode ? "text-gray-100" : "text-gray-900"}`,
                ]}
                placeholder="Add an optional description"
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#6b7280"}
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            )}
          />
        </FormField>

        <FormField label="Amount" error={errors.amount?.message}>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, value, onBlur } }) => (
              <View style={tw`relative`}>
                <Text
                  style={tw`absolute top-4 left-4 text-lg ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  ₱
                </Text>
                <TextInput
                  style={[
                    tw`rounded-lg border p-4 pl-7 ${isDarkMode ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-white"}`,
                    errors.amount ? tw`border-red-300` : "",
                    tw`${isDarkMode ? "text-gray-100" : "text-gray-900"}`,
                  ]}
                  placeholder="0.00"
                  placeholderTextColor={isDarkMode ? "#9ca3af" : "#6b7280"}
                  value={value?.toString()}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="numeric"
                />
              </View>
            )}
          />
        </FormField>

        <View style={tw`mb-5 flex-row`}>
          <View style={tw`mr-3 flex-1`}>
            <FormField label="Due Day" required error={errors.dueDay?.message}>
              <Controller
                control={control}
                name="dueDay"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      tw`rounded-lg border p-4 ${isDarkMode ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-white"}`,
                      errors.dueDay ? tw`border-red-300` : "",
                      tw`${isDarkMode ? "text-gray-100" : "text-gray-900"}`,
                    ]}
                    placeholder="1-31"
                    placeholderTextColor={isDarkMode ? "#9ca3af" : "#6b7280"}
                    value={value?.toString()}
                    onChangeText={onChange}
                    keyboardType="number-pad"
                  />
                )}
              />
            </FormField>
          </View>

          <View style={tw`flex-1`}>
            <FormField label="Reminder Days" required error={errors.reminderDays?.message}>
              <Controller
                control={control}
                name="reminderDays"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      tw`rounded-lg border p-4 ${isDarkMode ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-white"}`,
                      errors.reminderDays ? tw`border-red-300` : "",
                      tw`${isDarkMode ? "text-gray-100" : "text-gray-900"}`,
                    ]}
                    placeholder="Days before"
                    placeholderTextColor={isDarkMode ? "#9ca3af" : "#6b7280"}
                    value={value?.toString()}
                    onChangeText={onChange}
                    keyboardType="number-pad"
                  />
                )}
              />
            </FormField>
          </View>
        </View>

        <FormField label="Category">
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  tw`rounded-lg border p-4 ${isDarkMode ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-white"}`,
                  tw`${isDarkMode ? "text-gray-100" : "text-gray-900"}`,
                ]}
                placeholder="e.g., Utilities, Rent, etc."
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#6b7280"}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </FormField>

        <FormField label="Color">
          <Controller
            control={control}
            name="color"
            render={({ field: { onChange, value } }) => (
              <View style={tw`flex-row flex-wrap gap-2`}>
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      tw`h-10 w-10 items-center justify-center rounded-full`,
                      { backgroundColor: color },
                      value === color && tw`border-2 border-white`,
                    ]}
                    onPress={() => onChange(color)}
                  >
                    {value === color && <Ionicons name="checkmark" size={20} color="white" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </FormField>

        <View style={tw`mt-6 flex-row justify-end`}>
          <TouchableOpacity
            style={tw`mr-4 rounded-lg border border-gray-300 px-6 py-3`}
            onPress={onCancel}
          >
            <Text style={tw`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`rounded-lg bg-teal-600 px-6 py-3`}
            onPress={handleSubmit(onFormSubmit, onError)}
          >
            <Text style={tw`font-medium text-white`}>
              {initialValues?.id ? "Update Bill" : "Add Bill"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
