import React from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

import { DefaultComponentProps } from "../../types";
import { billSchema, BillFormValues } from "../../utils/validation";
import { Bill } from "../../types/bill";

type Props = DefaultComponentProps & {
  initialValues?: Partial<Bill>;
  onSubmit: (data: BillFormValues) => void;
  onCancel: () => void;
};

export function BillForm(props: Props) {
  const { initialValues, onSubmit, onCancel, style } = props;

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
      <Text style={tw`mb-2 text-base font-medium text-gray-700`}>
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
        <Text style={tw`text-2xl font-bold text-gray-900`}>
          {initialValues?.id ? "Edit Bill" : "Add New Bill"}
        </Text>
        <Text style={tw`mt-1 text-base text-gray-500`}>
          Fill in the details below to {initialValues?.id ? "update your" : "create a new"} bill.
        </Text>
      </View>

      <View
        style={[
          tw`rounded-2xl bg-white p-6`,
          {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
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
                  tw`rounded-lg border bg-white p-4`,
                  errors.name ? tw`border-red-300` : tw`border-gray-200`,
                ]}
                placeholder="Enter bill name"
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
                style={tw`rounded-lg border border-gray-200 bg-white p-4`}
                placeholder="Add an optional description"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            )}
          />
        </FormField>

        <FormField label="Amount" required error={errors.amount?.message}>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, value } }) => (
              <View style={tw`relative`}>
                <Text style={tw`absolute top-4 left-4 text-lg text-gray-500`}>$</Text>
                <TextInput
                  style={[
                    tw`rounded-lg border bg-white p-4 pl-7`,
                    errors.amount ? tw`border-red-300` : tw`border-gray-200`,
                  ]}
                  placeholder="0.00"
                  value={value?.toString()}
                  onChangeText={(text) => {
                    if (text === "") {
                      onChange(0);
                    } else {
                      const numValue = parseFloat(text);
                      onChange(isNaN(numValue) ? 0 : numValue);
                    }
                  }}
                  keyboardType="decimal-pad"
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
                      tw`rounded-lg border bg-white p-4`,
                      errors.dueDay ? tw`border-red-300` : tw`border-gray-200`,
                    ]}
                    placeholder="1-31"
                    value={value?.toString()}
                    onChangeText={(text) => {
                      if (text === "") {
                        onChange(1);
                      } else {
                        const numValue = parseInt(text, 10);
                        onChange(isNaN(numValue) ? 1 : numValue);
                      }
                    }}
                    keyboardType="number-pad"
                  />
                )}
              />
            </FormField>
          </View>

          <View style={tw`ml-3 flex-1`}>
            <FormField label="Reminder Days" error={errors.reminderDays?.message}>
              <Controller
                control={control}
                name="reminderDays"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      tw`rounded-lg border bg-white p-4`,
                      errors.reminderDays ? tw`border-red-300` : tw`border-gray-200`,
                    ]}
                    placeholder="Days before"
                    value={value?.toString()}
                    onChangeText={(text) => {
                      if (text === "") {
                        onChange(3);
                      } else {
                        const numValue = parseInt(text, 10);
                        onChange(isNaN(numValue) ? 3 : numValue);
                      }
                    }}
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
                style={tw`rounded-lg border border-gray-200 bg-white p-4`}
                placeholder="Enter category (optional)"
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
              <View style={tw`flex-row flex-wrap`}>
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      tw`m-1 h-12 w-12 items-center justify-center rounded-xl`,
                      { backgroundColor: color },
                      value === color && tw`border-4 border-gray-200`,
                    ]}
                    onPress={() => onChange(color)}
                  >
                    {value === color && <Ionicons name="checkmark" size={24} color="white" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </FormField>

        <View style={tw`mt-8 flex-row justify-end`}>
          <TouchableOpacity style={tw`mr-3 rounded-lg bg-gray-100 px-6 py-4`} onPress={onCancel}>
            <Text style={tw`font-semibold text-gray-700`}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`rounded-lg bg-teal-600 px-6 py-4`}
            onPress={handleSubmit(onFormSubmit, onError)}
          >
            <Text style={tw`font-semibold text-white`}>
              {initialValues?.id ? "Update Bill" : "Add Bill"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
