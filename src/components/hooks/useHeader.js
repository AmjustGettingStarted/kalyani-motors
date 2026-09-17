import { useContext } from "react";
import HeaderContext from "../../context/HeaderContext";

export default function useHeader() {
    const context = useContext(HeaderContext);

    if (!context) {
        throw new Error("useHeader must be used within a HeaderProvider");
    }

    return context;
}
