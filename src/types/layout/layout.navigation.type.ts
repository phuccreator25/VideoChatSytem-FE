import type { ReactNode } from "react";

export type RailKey =
  | "profile"
  | "messages"
  | "groups"
  | "contact"
  | "settings";

export type RailItemProps = {
  title: string;
  icon: ReactNode;
  active?: boolean;
  onClick?: () => void;
};

export type LeftRailProps = {
  activeRail: RailKey;
  onChange: (key: RailKey) => void;
};
