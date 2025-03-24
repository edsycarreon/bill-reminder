You are an expert in TypeScript, React Native, and Mobile App Development.

STRICT:

- Use React Native Reanimated. Do not use React Native's default Animated. I have it installed don't ask to install
- Do not use any other styling. Only use TWRNC.
- Do not use hooks inside functions nor callbacks. Use only hooks on root functional component

IMPORTANT RULES:

- After creating a feature make sure to update @docs.md be clean concise more of a use-case basis. But also mention if Frontend ONLY or already a fullstack implementation. This is crucial.
- If only tasked to create UI-related tasks. Create a separate file for mock data if needed.
- When creating/deleting/updating components always check for documentation on the ai folder first so get context about structure and usecases.
- When asked to do animations. Use React Native Reanimated. If needed, you can also use RN Skia.

Code Style and Structure:

- Write concise, type-safe TypeScript code.
- Use functional components and hooks over class components.
- Ensure components are modular, reusable, and maintainable.
- Organize files by feature, grouping related components, hooks, and styles.

Naming Conventions:

- Use camelCase for variable and function names (e.g., isFetchingData, handleUserInput).
- Use PascalCase for component names (e.g., UserProfile, ChatScreen).
- Directory names should be lowercase and hyphenated (e.g., user-profile, chat-screen) and should include what type like screen, component, hook, util, etc. for example landing.screen.tsx or button.component.tsx

Components Conventions:

- Check always if the component already exists in the src/components folder before creating a new one.
- Components should be segrated by type, for example atoms, molecules, organisms.
- When creating components always use the DefaultComponentProps type for the props.

import React from 'react';
import { View } from 'react-native';

import { DefaultComponentProps } from '@/types';

type Props = DefaultComponentProps & {};

export function ComponentName(props: Props) {
const { style } = props;

      return <View style={[style]}></View>;

}

TypeScript Usage:

- Use TypeScript for all components, favoring types over interfaces for props and state.
- Do not use interfaces or classes unless specified
- Enable strict typing in tsconfig.json.
- Avoid using any; strive for precise types.
- Do not use React.FC when defining functional components with props.

Performance Optimization:

- Avoid anonymous functions in renderItem or event handlers to prevent re-renders.

Database & Storage

- Use react-native-mmkv to manage the data and act as the database.

UI and Styling:

- Use consistent styling, use TWRNC (Tailwind React Native Components) for styling via tw import. Use it for all components. You can use it like this "tw`text-center`". This is react-native so instead of passing it through className, pass it through style.
- Ensure responsive design by considering different screen sizes and orientations.
- Optimize image handling using libraries designed for React Native, like react-native-turbo-image.

Best Practices:

- Follow React Native's threading model to ensure smooth UI performance.
- Use React Navigation for handling navigation and deep linking with best practices.

Project Structure:
app - Folder to put screens and layouts
assets - Folder for images, icons, font
components - Components folder
components/atoms - Atom components
components/molecules - Molecule components
components/organisms - Organism components
config - ENV config folder
constants - Constants folder
hooks - Hooks folder
scripts - Script folder
tailwind - Tailwind config folder
types - Types folder
utils - utilities folder
services - services folder (API requests)
stores - Stores folder (Zustand)
mutations - React Query mutations folder
queries - React Query queries folder
