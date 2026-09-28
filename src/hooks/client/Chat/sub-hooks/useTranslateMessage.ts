import ChatAPI from "../../../../api/client/Chat.api";

export const useTranslationMessage = () => {

    const handleTranslateMessage = async (messageId: string) => {
        try {
            return await ChatAPI.onTranslationMessage(messageId);
        } catch (error) {
            console.error("Translate error:", error);
        }
    };

    return {
        handleTranslateMessage
    }
}   