import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      // expand={true}
      className="toaster group"
      position='top-right'  // Toast appears in top-right corner of screen
      richColors  //  Enables color-coded toasts (green for success, red for error, etc.)
      closeButton  // Shows an 'X' button to dismiss toasts
      offset={16}  // 16px gap from edge of viewport
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{  //  Individual Toast Styling
        style: {
          padding: '16px',
          borderRadius: '12px',
          fontSize: '14px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // Elevation effect (makes toast "float" above page)
        },
        className: 'shadow-lg',
        // Success variant styling
        classNames: {
          success: 'bg-green-50 dark:bg-green-900/20 border-green-500',
          error: 'bg-red-50 dark:bg-red-900/20 border-red-500',
          warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500',
          info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500',
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        }
      }
      {...props} />
  );
}

export { Toaster }
