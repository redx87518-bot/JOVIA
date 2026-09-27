import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="top-center"
      toastOptions={{
        style: {
          background: "rgba(22, 3, 47, 0.92)",
          border: "1px solid rgba(107, 79, 161, 0.45)",
          color: "#F3EFFF",
          backdropFilter: "blur(12px)",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
