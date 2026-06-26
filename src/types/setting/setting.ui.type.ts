import type { ReactNode } from "react";

export type SettingItem = {
  key: string;
  label: string;
  icon: ReactNode;
  description?: string;
  danger?: boolean;
  badge?: string;
  onClick?: () => void;
  showArrow?: boolean;
};
