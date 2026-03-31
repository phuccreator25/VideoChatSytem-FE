import { useEffect, useState } from "react";
import type { ProfileData } from "../../types/data.type";
import userApi from "../../api/User.api";

export const useProfile = () => {
    const [initialProfile, setProfile] = useState<ProfileData>({
        fullname: "Patricia Smith",
        username: "patricia.smith",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        email: "saaaa"
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await userApi.onGetDataUser();
                setProfile(response.data.data);
            } catch (err: any) {
                console.log('Error fetching profile data:', err.response?.data?.message || err.message);
                throw err;
            }
        };

        fetchProfileData();
    }, []);

    return {
        initialProfile,
        setProfile
    };
};