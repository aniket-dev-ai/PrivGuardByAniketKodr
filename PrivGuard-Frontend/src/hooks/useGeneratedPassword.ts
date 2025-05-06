import { useState } from "react";

export default function useGeneratedPassword(): [
    string,
    (value: string) => void,
    () => string
] {
    const [password, setPassword] = useState("");

    const generate = (): string => {
        const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // no I, O
        const lowercase = "abcdefghijkmnopqrstuvwxyz"; // no l
        const numbers = "23456789"; // no 0, 1
        const specialChars = "!@#$%^&*_-+=";

        let newPassword = "";
        newPassword += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
        newPassword += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
        newPassword += numbers.charAt(Math.floor(Math.random() * numbers.length));
        newPassword += specialChars.charAt(Math.floor(Math.random() * specialChars.length));

        const allChars = uppercase + lowercase + numbers + specialChars;
        const remainingLength = 16 - newPassword.length;

        for (let i = 0; i < remainingLength; i++) {
            newPassword += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }

        newPassword = shuffleString(newPassword);
        setPassword(newPassword);
        return newPassword;
    };

    const shuffleString = (str: string): string => {
        const array = str.split("");
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join("");
    };

    return [password, setPassword, generate];
}
