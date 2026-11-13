import { useState, useMemo, useCallback } from "react";

export type BanDurationType = "permanent" | "temporary";
export type BanPreset = "1d" | "3d" | "7d" | "14d" | "30d" | "custom";

type UseBanDurationOptions = {
  initialType?: BanDurationType;
  initialPreset?: BanPreset;
  initialCustomDate?: string;
  isEnabled?: boolean;
}

export const PRESET_OPTIONS: { label: string; value: BanPreset }[] = [
  { label: "1 day", value: "1d" },
  { label: "3 days", value: "3d" },
  { label: "7 days", value: "7d" },
  { label: "14 days", value: "14d" },
  { label: "30 days", value: "30d" },
  { label: "Custom date", value: "custom" },
];

export const calculateUnbanDate = ( // tính ngày unban
  preset: string,
  customDate: string
): Date | null => {
  const now = new Date();
  switch (preset) {
    case "1d":
      return new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
    case "3d":
      return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    case "7d":
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case "14d":
      return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    case "custom":
      return customDate ? new Date(customDate) : null;
    default:
      return null;
  }
};

export const useBanDuration = (options: UseBanDurationOptions = {}) => {
  const {
    initialType = "permanent",
    initialPreset = "7d",
    initialCustomDate,
    isEnabled = true,
  } = options;

  const [banDurationType, setBanDurationType] = useState<BanDurationType>(initialType);
  const [banPreset, setBanPreset] = useState<string>(initialPreset);
  const [customUnbanDate, setCustomUnbanDate] = useState<string>(() => {
    return (
      initialCustomDate ||
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
    );
  });

  // Tự động tính toán ngày mở khóa
  const computedUnbanDate = useMemo(() => {
    if (!isEnabled || banDurationType === "permanent") return null;
    return calculateUnbanDate(banPreset, customUnbanDate);
  }, [isEnabled, banDurationType, banPreset, customUnbanDate]);

  // Trả về chuỗi ISO string hoặc null (dùng để gửi trực tiếp lên API)
  const getUnbanDateISO = useCallback((): string | null => {
    if (!isEnabled || banDurationType === "permanent") return null;
    return computedUnbanDate ? computedUnbanDate.toISOString() : null;
  }, [isEnabled, banDurationType, computedUnbanDate]);

  // Reset về trạng thái ban đầu
  const resetBanDuration = useCallback(() => {
    setBanDurationType(initialType);
    setBanPreset(initialPreset);
    setCustomUnbanDate(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
    );
  }, [initialType, initialPreset]);

  // Khôi phục trạng thái từ dữ liệu ban
  const setFromExistingDate = useCallback((unBannedAt?: string | null) => {
    if (unBannedAt) {
      setBanDurationType("temporary");
      setBanPreset("custom");
      setCustomUnbanDate(new Date(unBannedAt).toISOString().slice(0, 16));
    } else {
      setBanDurationType("permanent");
      setBanPreset("7d");
      setCustomUnbanDate(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
      );
    }
  }, []);

  return {
    banDurationType,
    setBanDurationType,
    banPreset,
    setBanPreset,
    customUnbanDate,
    setCustomUnbanDate,
    computedUnbanDate,
    getUnbanDateISO,
    resetBanDuration,
    setFromExistingDate,
  };
};

export default useBanDuration;

