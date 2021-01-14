import classNames from "classnames";

export interface Props {
  size?: "small" | "medium" | "large";

  // shape?: 'default' | 'circle';
  ghost?: boolean;
  disabled?: boolean;
  selected?: boolean;
  onClick?(): any;
  children?: string;
  className?: string;

  // Icons
  prefix?: JSX.Element;
  suffix?: JSX.Element;

  wide?: boolean;
}

export function Button(props: Props) {
  const {
    size = "medium",
    ghost = false,
    disabled = false,
    selected = false,
    onClick = () => null,
    children,
    className,
    prefix,
    suffix,
    wide = false,
  } = props;

  const clickHandler = (e: any) => {
    if (onClick) {
      e.stopPropagation();
      onClick();
    }
  };

  const onClickFn = disabled ? () => null : clickHandler;

  const color = "blue-200";

  const outline = ghost
    ? ["border-solid", "border-2", "bg-transparent", `border-${color}`]
    : ["border-none"];

  const off = disabled
    ? ["cursor-not-allowed", "opacity-50"]
    : ["cursor-pointer"];

  const text = selected ? [`text-black`] : ["text-black"];

  const fontSize =
    size === "medium" ? "text-base" : size === "large" ? "text-lg" : "text-xs";

  // Make bg crop to text with tailwind on gradient
  // https://tailwindcss.com/docs/background-clip#class-reference

  return (
    <div
      className={classNames(
        "flex",
        "justify-center",
        "items-center",
        "outline-none",
        "duration-300",
        "ease-in-out",
        "text-center",
        "rounded-md",
        "select-none",
        "uppercase",
        "font-raleway",
        "font-semibold",
        `bg-${color}`,
        fontSize,
        wide && "tracking-widest",
        !disabled && "hover:bg-blue-300",
        size === "small" ? "px-2" : "px-4",
        size === "small" ? "py-1" : "py-2",
        off,
        text,
        outline,
        className
      )}
      role="button"
      tabIndex={-1}
      onClick={onClickFn}
    >
      {prefix && (
        <div className={classNames("flex", "items-center", children && "pr-2")}>
          {prefix}
        </div>
      )}
      {children}
      {suffix && (
        <div className={classNames("flex", "items-center", children && "pl-2")}>
          {suffix}
        </div>
      )}
    </div>
  );
}
