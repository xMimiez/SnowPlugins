export default function TextInputRow({ label, value, onChange, placeholder, isClearable, isDisabled, keyboardType, }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    isClearable?: boolean;
    isDisabled?: boolean;
    keyboardType?: "numeric" | "email-address" | "phone-pad" | undefined;
}): import("react").JSX.Element;
