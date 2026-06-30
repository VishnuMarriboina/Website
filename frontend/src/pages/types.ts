import type React from 'react';

export interface ProductItem {
  img: string;
  name: string;
  application: string;
}

export interface JobOpening {
  img: string;
  role: string;
  desc: string;
}

export interface ContactFormState {
  name: string;
  email: string;
  message: string;
}

export interface LoginFormState {
  email: string;
  password: string;
}

export interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

export interface FieldProps {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  rightEl?: React.ReactNode;
}

export interface PasswordFieldProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export interface AuthFormProps {
  onSuccess: (name: string, role: string) => void;
}
