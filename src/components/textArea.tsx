import { ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";

interface TextAreaProps {
    value: string;
    idTextArea: string;
    label: string;
    placeholder: string;
    rows: number;
    labelColor:string;
    textAreaColor: string;
    onChangeFunction: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export function TextArea({ idTextArea, label, placeholder, rows, onChangeFunction, value, textAreaColor, labelColor }: TextAreaProps) {
    return(
        <label htmlFor={idTextArea} className={twMerge("flex flex-col gap-2 text-2xl font-semibold", labelColor)}>
            {label}
            <textarea
                value={value}
                id={idTextArea}
                rows={rows}
                className={twMerge("w-full resize-none rounded-lg p-2 text-base font-normal focus:outline-none border", textAreaColor)}
                placeholder={placeholder}
                onChange={onChangeFunction}
            ></textarea>
        </label>
    )
}
