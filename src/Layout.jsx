import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './components/app-sidebar'
import { Header } from './components/header'
import background from '@/assets/background.jpg'

export default function Layout({ children }) {
    return (
        <div
            className="bg-cover bg-center bg-fixed min-h-screen w-full p-2 sm:p-4"
            style={{
                backgroundImage: `url(${background})`,
            }}
        >
            <SidebarProvider defaultOpen={true}>
                <AppSidebar />
                <SidebarInset className="bg-transparent min-w-0 overflow-x-hidden">
                    <Header />
                    <main className="p-1 sm:p-2 pt-3 sm:pt-4 min-w-0">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}