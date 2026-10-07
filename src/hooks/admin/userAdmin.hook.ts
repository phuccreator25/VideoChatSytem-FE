import { useCallback, useEffect, useMemo, useState } from "react";
import userAdminAPI from "../../api/admin/userAdmin.api";
import type { AdminUserItem, typeDataCreateUser, typeDataUpdateUser, typeQueryUser } from "../../types/admin/userAdmin.type";
import { useSearchParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

type Pagination = {
    total: number;
    totalPages: number;
}

type ModalActionType = "create" | "detail" | "update" | "ban" | "unban" | null;
type ModalState = {
    type: ModalActionType;
    user: AdminUserItem | null;
}

export default function useUserAdmin() {
    const [searchParams] = useSearchParams();
    const [users, setUsers] = useState<AdminUserItem[]>([]);

    const [modals, setModals] = useState<ModalState>({
        type: null,
        user: null
    });

    const { query, page, limit } = useMemo(() => {
        return {
            query: {
                search: searchParams.get("search") || null,
                role: searchParams.get("role") || "all",
                isActive: searchParams.get("isActive") || "all",
                isBanned: searchParams.get("isBanned") || "all",
                isOnline: searchParams.get("isOnline") || "all",
            } as typeQueryUser,
            page: Number(searchParams.get("page")) || 1,
            limit: Number(searchParams.get("limit")) || 10,
        };
    }, [searchParams]);

    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        totalPages: 0,
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [isSendMailing, setIsSendMailing] = useState<{ [key: string]: boolean }>({});


    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);

            const res = await userAdminAPI.onGetDataUser({ query, page, limit });

            const result = res.data?.data

            setUsers(result.data || []);

            setPagination({
                total: result.pagination.total,
                totalPages: result.pagination.totalPages,
            });

            return
        } catch (error) {
            console.error("ERROR FETCH USERS:", error);
            enqueueSnackbar("Failed to fetch users.", { variant: "error" });
        } finally {
            setLoading(false);
        }
    }, [query, page, limit,]);

    const onCreateAdmin = async (newAdmin: typeDataCreateUser) => {
        try {
            if (!newAdmin) return;
            const res = await userAdminAPI.onCreateAdmin({ newAdmin });

            if (res.status === 201) {
                enqueueSnackbar('Created admin successfully', {
                    variant: 'success',
                })
                await fetchUsers();
            }

            return
        } catch (error) {
            console.error("ERROR CREATE ADMIN:", error);
            enqueueSnackbar("Failed to create admin.", { variant: "error" });
        }
    }

    const onUpdateAdmin = async (updatedAdmin: typeDataUpdateUser) => {
        try {
            if (!updatedAdmin) return;
            const res = await userAdminAPI.onUpdateAdmin({ updatedAdmin });

            if (res.status === 200) {
                enqueueSnackbar('Admin updated successfully', {
                    variant: 'success',
                })
                await fetchUsers();
            }

            return
        } catch (error) {
            console.error("ERROR UPDATE ADMIN:", error);
            enqueueSnackbar("Failed to update user.", { variant: "error" });
        }
    }

    const onBanAdmin = async ({ _id, banReason }: { _id: string, banReason: string }) => {
        try {
            if (!_id || !banReason) return;
            const res = await userAdminAPI.onBanAdmin({ _id, banReason });

            if (res.status === 200) {
                enqueueSnackbar('User banned successfully', {
                    variant: 'success',
                })
                await fetchUsers();
            }

            return
        } catch (error) {
            console.error("ERROR BAN ADMIN:", error);
            enqueueSnackbar("Failed to ban user.", { variant: "error" });
        }
    }

    const onUnbanAdmin = async (id: string) => {
        try {
            if (!id) return

            const res = await userAdminAPI.onUnbanAdmin(id);

            if (res.status === 200) {
                enqueueSnackbar('User unbanned successfully', {
                    variant: 'success',
                })
                await fetchUsers();
            }

            return
        } catch (error) {
            console.error("ERROR UNBAN ADMIN:", error);
            enqueueSnackbar("Failed to unban user.", { variant: "error" });
        }
    }

    const onSendMailVerify = async (id: string) => {
        if (!id) return;
        try {

            setIsSendMailing((prev) => ({ ...prev, [id]: true }));

            const res = await userAdminAPI.onSendMailVerify(id);

            if (res.status === 200) {
                enqueueSnackbar('Email sent successfully.', {
                    variant: 'success'
                })
            }

            return
        } catch (error) {
            console.log('ERROR SEND MAIL: ', error);
            enqueueSnackbar("Failed to send verification email.", { variant: "error" });
        } finally {
            setIsSendMailing((prev) => ({ ...prev, [id]: false }));
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);


    return {
        ui: {
            loading,
            query,
            page,
            limit,
            isSendMailing,
            createOpen: modals.type === "create",
            detailUser: modals.type === "detail" ? modals.user : null,
            updateUser: modals.type === "update" ? modals.user : null,
            banUser: modals.type === "ban" ? modals.user : null,
            unbanUser: modals.type === "unban" ? modals.user : null,
        },
        data: {
            users,
            pagination
        },
        handler: {
            fetchUsers,
            onCreateAdmin,
            onUpdateAdmin,
            onBanAdmin,
            onUnbanAdmin,
            onSendMailVerify,
            openModal: (type: ModalActionType, user: AdminUserItem | null = null) => {
                setModals({ type, user });
            },
            closeModal: () => {
                setModals({ type: null, user: null });
            }
        }
    }
}