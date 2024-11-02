import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type Props = {
  tag?: Tag;
  size?: Tag;
} & React.HTMLAttributes<HTMLHeadingElement>;

const Heading: React.FC<React.PropsWithChildren<Props>> = ({
  tag = "h3",
  size,
  className,
  children,
}) => {
  const Tag = tag;
  const tagSize = size || tag;
  return (
    <Tag
      className={cn(
        "font-semibold",
        {
          "text-4xl font-bold": tagSize === "h1",
          "text-3xl font-bold": tagSize === "h2",
          "text-2xl": tagSize === "h3",
          "text-xl": tagSize === "h4",
          "text-lg": tagSize === "h5",
          "text-md": tagSize === "h6",
        },
        className
      )}
    >
      {children}
    </Tag>
  );
};

export default Heading;
