import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const toast = ({ title, description, variant }: ToastProps) => {
    if (variant === "destructive") {
      sonnerToast.error(title || "Xatolik", {
        description,
      })
    } else {
      sonnerToast.success(title || "Muvaffaqiyatli", {
        description,
      })
    }
  }

  return { toast }
}

export { sonnerToast as toast }
