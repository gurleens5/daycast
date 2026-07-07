import { useTheme } from "next-themes";

export default function Footer(){
    return (
        <footer className="flex items-center justify-center px-6 py-6 border-t text-gray-400 text-sm border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 w-full">
            © {new Date().getFullYear()} Daycast 
        </footer>
    )
}