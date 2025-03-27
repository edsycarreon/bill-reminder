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

  return (
    <ScrollView style={[tw`flex-1`, style]} contentContainerStyle={tw`p-4`}>
      <View style={tw`mb-4`}>
        <Text style={tw`mb-1 font-medium text-gray-700`}>Bill Name *</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[
                tw`rounded-lg border bg-white p-3`,
                errors.name ? tw`border-red-500` : tw`border-gray-300`,
              ]}
              placeholder="Enter bill name"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.name && <Text style={tw`mt-1 text-red-500`}>{errors.name.message}</Text>}
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`mb-1 font-medium text-gray-700`}>Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={tw`rounded-lg border border-gray-300 bg-white p-3`}
              placeholder="Enter optional description"
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          )}
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`mb-1 font-medium text-gray-700`}>Amount *</Text>
        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[
                tw`rounded-lg border bg-white p-3`,
                errors.amount ? tw`border-red-500` : tw`border-gray-300`,
              ]}
              placeholder="0.00"
              value={value?.toString()}
              onChangeText={(text) => {
                // Handle empty or non-numeric input
                if (text === "") {
                  onChange(0);
                } else {
                  const numValue = parseFloat(text);
                  onChange(isNaN(numValue) ? 0 : numValue);
                }
              }}
              keyboardType="decimal-pad"
            />
          )}
        />
        {errors.amount && <Text style={tw`mt-1 text-red-500`}>{errors.amount.message}</Text>}
      </View>

      <View style={tw`mb-4 flex-row`}>
        <View style={tw`mr-2 flex-1`}>
          <Text style={tw`mb-1 font-medium text-gray-700`}>Due Day *</Text>
          <Controller
            control={control}
            name="dueDay"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  tw`rounded-lg border bg-white p-3`,
                  errors.dueDay ? tw`border-red-500` : tw`border-gray-300`,
                ]}
                placeholder="1-31"
                value={value?.toString()}
                onChangeText={(text) => {
                  // Handle empty input or non-numeric input
                  if (text === "") {
                    onChange(1); // Default to 1 when empty
                  } else {
                    const numValue = parseInt(text, 10);
                    onChange(isNaN(numValue) ? 1 : numValue);
                  }
                }}
                keyboardType="number-pad"
              />
            )}
          />
          {errors.dueDay && <Text style={tw`mt-1 text-red-500`}>{errors.dueDay.message}</Text>}
        </View>

        <View style={tw`ml-2 flex-1`}>
          <Text style={tw`mb-1 font-medium text-gray-700`}>Reminder Days</Text>
          <Controller
            control={control}
            name="reminderDays"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  tw`rounded-lg border bg-white p-3`,
                  errors.reminderDays ? tw`border-red-500` : tw`border-gray-300`,
                ]}
                placeholder="Days before due"
                value={value?.toString()}
                onChangeText={(text) => {
                  // Handle empty or non-numeric input
                  if (text === "") {
                    onChange(3); // Default to 3 days
                  } else {
                    const numValue = parseInt(text, 10);
                    onChange(isNaN(numValue) ? 3 : numValue);
                  }
                }}
                keyboardType="number-pad"
              />
            )}
          />
          {errors.reminderDays && (
            <Text style={tw`mt-1 text-red-500`}>{errors.reminderDays.message}</Text>
          )}
        </View>
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`mb-1 font-medium text-gray-700`}>Category</Text>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={tw`rounded-lg border border-gray-300 bg-white p-3`}
              placeholder="Enter category (optional)"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
      </View>

      <View style={tw`mb-6`}>
        <Text style={tw`mb-2 font-medium text-gray-700`}>Color</Text>
        <Controller
          control={control}
          name="color"
          render={({ field: { onChange, value } }) => (
            <View style={tw`flex-row flex-wrap`}>
              {colorOptions.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    tw`m-1 h-10 w-10 rounded-full`,
                    { backgroundColor: color },
                    value === color && tw`border-4 border-gray-300`,
                  ]}
                  onPress={() => onChange(color)}
                />
              ))}
            </View>
          )}
        />
      </View>

      <View style={tw`mt-4 flex-row justify-end`}>
        <TouchableOpacity style={tw`mr-3 rounded-lg bg-gray-200 px-4 py-3`} onPress={onCancel}>
          <Text style={tw`font-medium text-gray-800`}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`rounded-lg bg-teal-600 px-4 py-3`}
          onPress={handleSubmit(onFormSubmit, onError)}
        >
          <Text style={tw`font-medium text-white`}>
            {initialValues?.id ? "Update Bill" : "Add Bill"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
