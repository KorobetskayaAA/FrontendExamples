import React, { ButtonHTMLAttributes } from "react";

export interface IconButtonProps {
    className: string;
    iconName: string;
    color: "primary" | "secondary" | "danger" | "warning" | "info" | "success";
    onClickHandler: () => void;
}

export const IconButton: React.FC<
    IconButtonProps & ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, iconName, color, onClickHandler, ...buttonProps }) => {
    return (
        <button
            className={`${className} btn btn-outline-${color} btn-sm bi bi-${iconName}`}
            onClick={onClickHandler}
            {...buttonProps}
        />
    );
};
