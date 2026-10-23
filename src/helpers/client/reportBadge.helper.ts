import type { ReportStatus } from "../../types/Report.type";

export const getStatusBadgeStyle = (status: ReportStatus) => {
    switch (status) {
        case 'pending':
            return {
                color: '#B45309', // Hổ phách đậm
                bg: '#FEF3C7', // Vàng kem nhạt
                border: '#FDE68A',
                dot: '#F59E0B',
            };
        case 'in_progress':
            return {
                color: '#1D4ED8', // Xanh dương
                bg: '#EFF6FF', // Xanh nhạt
                border: '#93C5FD',
                dot: '#3B82F6',
            };
        case 'resolved':
            return {
                color: '#059669', // Xanh ngọc
                bg: '#ECFDF5',
                border: '#A7F3D0',
                dot: '#10B981',
            };
        case 'rejected':
        default:
            return {
                color: '#475569', // Xám Slate
                bg: '#F1F5F9',
                border: '#CBD5E1',
                dot: '#94A3B8',
            };
    }
};

export const getSelectStyle = (isActive: boolean) => ({
    height: 40,
    fontSize: "0.835rem",
    fontWeight: isActive ? 600 : 500,
    borderRadius: "10px",
    bgcolor: isActive ? "#F5F3FF" : "#F8FAFC",
    color: isActive ? "#7C3AED" : "#334155",
    transition: "all 0.2s ease",
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: isActive ? "#A78BFA" : "#E2E8F0",
        borderWidth: isActive ? "1.5px" : "1px",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: isActive ? "#7C3AED" : "#CBD5E1",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#7C3AED",
        boxShadow: "0 0 0 3px rgba(124, 58, 237, 0.12)",
    },
    "& .MuiSelect-select": {
        py: 1,
        px: 1.5,
        display: "flex",
        alignItems: "center",
    },
});