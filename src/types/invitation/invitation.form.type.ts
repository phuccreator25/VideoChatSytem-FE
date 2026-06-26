import type { SyntheticEvent } from "react";
import type { ContactSection } from "../contact.type";
import type {
  RelationStatus,
} from "./invitation.model.type";

export type UserOption = {
  id: string;
  fullname: string;
  email: string;
  avatar?: string;
  statusInvitation: RelationStatus;
  invitationId: string;
};

export type AddContactData = {
  selectedUser: UserOption | null;
  invitationMessage: string;
};

export type AddContactDataHook = {
  userId: string;
  invitationMessage?: string;
};

export type HandleQuickActionParams = {
  event: SyntheticEvent;
  option: UserOption;
  onUpdateOptionStatus?: (
    invitationId: string,
    nextStatus: RelationStatus,
  ) => void;
};

export type invitationSeachResult = {
  _id: string;
  fullname: string;
  email: string;
  avatar?: string;
  relationStatus: RelationStatus;
  invitationId: string;
};

export type UserInvitation = {
  contactSections: ContactSection[];
};
